const ga = 'G-96EPGBWZFV';


module.exports = [
  [
    'script',
    {
      async: true,
      src: `https://www.googletagmanager.com/gtag/js?id=${ga}`,
    },
  ],
  [
    'script',
    {},
    `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${ga}');`,
  ],
];
