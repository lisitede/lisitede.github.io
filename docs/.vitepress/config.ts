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
    'https://lisitede.com/unpkg/@head.js/guancecom-browser-rum-slim@3.2.24-10/guancecom-browser-rum-slim.js',
    '09c80c92c4bc46818c12373f1ab6e96c',
    'lisitede',
    '1.0.0',
    'prd',
    {}),

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