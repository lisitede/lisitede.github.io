import { defineConfig } from "vitepress";
import head from "./head";
import nav from "./nav";
import sidebar from "./sidebar";
import footer from "./footer";

export default defineConfig({
  lang: "zh-CN",
  title: "理斯特的",
  description: "技能 / 知识 / 经验",

  head,

  themeConfig: {
    logo: "https://gitlab-hbrls.lisitede.com/rsrc/img/logo-lisitede.png",
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
