const navbar = require('./navbar');
const sidebar = require('./sidebar');


module.exports = {
  host: '0.0.0.0',
  port: '3001',
  pagePatterns: ['**/*.md', '!.vuepress', '!node_modules', '!pro-web/apps'],

  lang: 'zh-CN',
  title: '理斯特的',
  description: '技能 / 知识 / 经验',

  themeConfig: {
    lastUpdated: false,
    contributors: false,

    logo: 'https://cdn.lisitede.com/logo-lisitede.png',

    navbar,
    sidebar,
  },

  plugins: [
    [ '@vuepress/plugin-google-analytics', { id: 'G-96EPGBWZFV' } ],
  ],
};
