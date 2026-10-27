import { defineConfig } from "vitepress";
import nav from "./nav";
import sidebar from "./sidebar";
import footer from "./footer";
import { makeTransformHtml } from "@head.js/snippet/dist/vite.cjs";


export default defineConfig({
  lang: "zh-CN",
  title: "理斯特的",
  description: "技能 / 知识 / 经验",

  transformHtml: makeTransformHtml(
    'https://lisitede.com/unpkg/@head.js/gc-rum-browser-slim@3.3.21-4/gc-rum-browser-slim.js',
    'https://cn3-rum-openway.guance.com',
    'cd0d737faba948008d5b22cc8c6fd177',
    'com',
    '1.0.0',
    'prd',
    { visitorId: { enabled: true} }),

  themeConfig: {
    logo: "https://lisitede.com/rsrc/img/logo-lisitede.png",
    aside: false,
    search: {
      provider: "local",
    },

    nav,
    sidebar,
    footer,

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/lisitede/lisitede.github.io",
      },
    ],
  },
});
