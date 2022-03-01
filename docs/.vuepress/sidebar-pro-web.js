module.exports = {
  '/pro-web': [
    {
      text: '企业级 Web 应用开发',
      children: [
        { text: 'Page', link: '/pro-web/ch01/page/', children: [
          '/pro-web/ch01/page/spm/',
        ]},
        { text: 'RESTFul', link: '/pro-web/ch09/restful/', children: [
          '/pro-web/ch09/restful/pagination/',
        ]},
        { text: 'CI / CD', link: '/pro-web/ch07/cicd/', children: [
          '/pro-web/ch07/cicd/version/',
        ]},
        { text: 'Scrum', link: '/pro-web/ch11/scrum/', children: [
          '/pro-web/ch11/scrum/sprint/',
          '/pro-web/ch11/scrum/trunk-based-development/',
        ]},
      ]
    },
  ],
};
