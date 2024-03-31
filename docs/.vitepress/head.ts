const ga = "G-96EPGBWZFV";

const head = [
  [
    "script",
    {
      async: true,
      src: `https://www.googletagmanager.com/gtag/js?id=${ga}`,
    },
  ],
  [
    "script",
    {},
    `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${ga}');`,
  ],
];

export default head;
