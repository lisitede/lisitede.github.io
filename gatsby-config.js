module.exports = {
  siteMetadata: {
    siteTitle: `理斯特的`,
    defaultTitle: `理斯特的`,
    siteTitleShort: `理斯特的`,
    siteDescription: `技能 / 知识 / 经验`,
    siteUrl: `https://lisitede.com`,
    siteAuthor: `@hbrls`,
    siteImage: `/banner.png`,
    siteLanguage: `en`,
    themeColor: `#8257E6`,
    basePath: `/`,
  },
  plugins: [
    {
      resolve: `@rocketseat/gatsby-theme-docs`,
      options: {
        configPath: `src/config`,
        docsPath: `content`,
        repositoryUrl: `https://github.com/lisitede/lisitede.github.io`,
        baseDir: `examples/gatsby-theme-docs`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Rocketseat Gatsby Themes`,
        short_name: `RS Gatsby Themes`,
        start_url: `/`,
        background_color: `#ffffff`,
        display: `standalone`,
        icon: `static/favicon.png`,
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-7072136-12`,
      },
    },
    `gatsby-plugin-remove-trailing-slashes`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://lisitede.com`,
      },
    },
    `gatsby-plugin-offline`,
  ],
};
