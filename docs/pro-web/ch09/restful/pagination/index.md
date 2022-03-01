# Pagination

## 是什么决定了你能在小破站看到什么样的视频？提示，不是推荐算法

这个故事源自于去年和飞哥的一次学术探讨，最开始是拿腾讯视频 VIP 做的例子，成文前和其他人又聊了一下，她指出腾讯视频是有会员二次收费的，尽管这个问题并没有击倒我，毕竟我准备澄清的是一个足够普适的场景。但是为了让第一章尽量简洁一些，元一些，所以改用小破站做例子了。

假设 B 站的电影在数据库里有一张表，当创业初期的时候这张表里只有 10 条数据，因为只买了这 10 部电影的版权。排序是按 id 主键的，而 id 的顺序大概率就是购买版权的顺序。而购买的顺序取决于市场部和法务部的效率，所以可以认为是乱序的。

此时 B 站处于推广期，所以这 10 部种子电影是免费的，不需要开会员，所以你打开 B 站，就会看见全部的 10 部电影展示在那里，并且从你的视角看去排序没有任何规律。随着购买的版权逐渐增多到了 20 部，那么就出现了分页问题，产品开始质疑乱序的实现，开发说那么我给你加一个排序用的字段吧。

至此，这张表的第一版就定型了，id，name，order。

接下来，市场部决定尝试收费，15 部收费电影和 5 部付费电影，这个举措非但没有引起用户的抵触，反而弹幕上和谐地打出了一片“让他恰”的呼声。开发在数据库里加了一个字段 is_member，非会员在展示列表的时候会多一个 where 条件以保证只会返回15条数据。

付费和非付费电影的数量都越来越多，产品提出能不能按上映年份搜索，能不能按上映国家搜索，以及能不能综合两项进行搜索。开发往数据库里又加了几个字段，轻松解决了这个需求。

至此，这张表的第二版就定型了，id，name，order，is_member，year，district。

开发和产品的蜜月期仅存在于“加个字段就好了”阶段，很快 B 站的影视区进入了实质性的商业化阶段，市面上那些适合的电影都被买了版权，产品和用户都需要一个足够实用的分类搜索功能。爱情、动作、科幻、动画，这种搜索方式和之前的字段最大的区别是，它们并不互斥，即一部电影既可能是爱情片，也可能是动作片，尽管你可以继续通过给每种类别加字段然后留出大量 NULL 的方式实现，并且实践中迭代早期大概率也是这么做，这么做也是对的。但是 DBA 不建议这么干，他们非常的反对 NULL。

标准一点的做法是你会新建一张或几张专门用来标记的表。其中标记分类的表大概会是这个样子，movie_id，genre。这是一张多对多的关系表，先从这张表里按分类搜，然后把搜出来的 movie_id 集合放到原始的 movie 表里去

```sql
SELECT FROM `movie` WHERE `id` IN (
    SELECT `movie_id` FROM `xref` WHERE `genre` IN ('a'，'b'));
```

很快这个搜索就会遇到性能问题，这个子查询里返回的 id 集合实在是太大了。

至此，本文的核心问题终于出现了：当数据不在一张表里的时候，应该怎样做搜索？

---

先说一个标准的解法，首先根据那些在 movie 表里的字段查出 10 条数据，然后根据那些在 xref 表里的字段查出 10 条数据，把这两组数据做一个并集，如果并出来的数据正好是 10 条，那么说明运气非常好，这就是要返回给用户的搜索结果。如果并出来的数据少于 10 条，那么就分别从两个数据源查第 11～20 条数据，再按上面的规则合并一次，直到搜索结果大于等于 10 条为止，返回前 10 条数据给用户，抛弃多余的数据。

产品给出了一个新的搜索需求「豆瓣 TOP 250」。尽管开发很想说服 DBA 允许到 movie 表新增一个 douban_rank 的字段，糙快猛又不失优雅。但是 B 站已经是一家成熟的公司了，总不能把友司的数据放到自己的主表里吧。考虑一下可拓展性，不局限于 250 条数据，这第 3 张表设计为 movie_id，douban_rank。

所谓标准解法就在于它是可以推广的，依次从 3 个数据源查询 10 条数据，合并，直到凑齐 10 条数据返回给用户为止。你甚至会发现，豆瓣的排名数据其实是不需要物理落表的。落表的目的是为了 join，如果不能 join，上游的数据源即使来自于豆瓣开放接口也不会对这个解法造成任何影响。我们将表的问题抽象成了数据源问题。

上文的描述其实非常投机地绕开了一个关键问题，实际上当第一次从多数据源取的 10 条数据不足以互相匹配时（这显然是绝大多数情况），第二次尝试查询的并不是第 11~20 条，而是 1~20 条。具体的原因这里就不深入了，毕竟这只是一部科幻小说。

显然，性能的问题又出现了。如果其中一个数据源迟迟查不到合适的数据，那么另外所有数据源都会浪费一次查询。

根据常识，即使是随机抽取，上映地区是美国是很好抽中的，影片类型是动作片也比较容易，然而要在豆瓣排名靠前就不那么容易了。所以对这种标准解法的一个修正是，分别从三个数据源查询 10 / 100 / 1000 条数据，有理由相信这个组合能匹配出有效的搜索结果的概率更高一些。再用基于实际业务的贝叶斯对这个比例做进一步的优化，就比较靠谱了。具体的方案就不展开讲了，其实我也不会，毕竟这只是一部科幻小说。

---

说了这么多，只为了表明一个观点，上游的数据源是异质的，实际的搜索算法并不是把用户输入的搜索条件复制的、均匀的发送给上游，算法并不中立了。

```sql
SELECT FROM
(
    FROM `database`.`table` SELECT WHERE `c1` = 'C1' LIMIT 10
    UNION
    FROM `redis` SELECT WHERE `k1` = 'K1' LIMIT 100
    UNION
    FROM `http://douban.com/api/top` SELECT WHERE `j1` = 'J1' LIMIT 1000)
WHERE `c1`, `k1`, `j1`;
```

显然当上游的数据源异质到这种程度，不可能是用普通的命令式编程，从上往下依次读取各个源的，也许这里应该开个多线程或者 channel 什么的，用某种朴素民科的眼光去设计一下，可能是某种异步请求和回调，其实我也不会，毕竟这只是一部科幻小说。

---

以上，大概率只是说说而已，欢迎大家给出更多漂亮的解法。解完之后尝试把用户查询的分页数量 pageSize 改成 1，再看看你的解法是否依然漂亮，反正我的这个解法是跪了。