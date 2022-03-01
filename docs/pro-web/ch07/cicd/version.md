# Version

## Mode

前端主要有两种场景，实践中一般指 `NODE_ENV=development` 和 `NODE_ENV=production`，可能还有第三种场景 `NODE_ENV=unittest`，对应的是 [Webpack 的配置](https://webpack.js.org/configuration/mode/)。

## Profile

实际用来做部署容器的后端有多种场景，不同公司有不同的说法，大致是 `dev 开发自测`，`fat 功能提测`，`sit 集成测试`，`uat 生产内测`，`prd 生产发版`，对应的是 [Spring Boot 的配置](https://docs.spring.io/spring-boot/docs/2.5.5/reference/html/features.html#features.profiles)。

## Build

用来标记具体的代码版本，可能也应该标记资源和配置的版本，但似乎海量到几乎不现实，可能需要另行自标记。

按照 [MicroSoft 的标准](https://docs.microsoft.com/en-us/dotnet/api/system.version.build?view=net-5.0#System_Version_Build)，应该是 `Major.Minor.Build.MajorRevision(/MinorRevision)`。对于技术侧来说，主要需要标记 `Build`。

## Agent

以上都是 `compile time` 标记，实际上还需要标记 `runtime` 跑在哪种容器上。

## @head.js

建议用以下几个全局变量来标记这些值：

```javascript
head.env.mode = 'production';
head.env.profile = 'prd';
head.env.version = '1.20210925.e231280d';
head.env.agent = 'wechat';
```
