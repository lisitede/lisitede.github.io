module.exports = [
  {
    text: '首页',
    link: '/',
  },
  {
    text: '小鲜',
    children: [
      { text: '职业', link: '/pages/awesome/career/caocao/' },
      { text: '研报', link: '/pages/awesome/research-report/' },
    ],
  },
  {
    text: '微信非官方文档',
    children: [
      { text: '25 位银行账户', link: '/pages/wechat/25-yinhang-zhanghao' },
    ],
  },
  {
    text: '假文',
    children: [
      { text: '微博', link: '/pages/lorem/weibo/' },
      { text: '小丧怪', link: '/pages/lorem/xiaosangguai/' },
    ],
  },
  {
    text: '阅读',
    children: [
      { text: '设计', link: '/pages/read/design/' },
      { text: '领域驱动设计', link: '/pages/read/ddd/' },
    ],
  },
  {
    text: '企业级 Web 应用开发',
    link: '/pro-web/',
  },
];
