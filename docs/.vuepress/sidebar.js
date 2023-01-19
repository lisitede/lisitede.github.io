module.exports = {
  '/pages/lorem': [
    {
      text: '假文',
      children: [
        '/pages/lorem/weibo/',
        '/pages/lorem/xiaosangguai/'
      ]
    }
  ],
  '/pages/awesome': [
    {
      text: '职业',
      children: [
        '/pages/awesome/career/caocao',
        '/pages/awesome/career/starwood',
        '/pages/awesome/career/liangqichao',
        '/pages/awesome/career/xiaolaoban',
      ]
    },
    { text: '研报', link: '/pages/awesome/research-report/' }
  ],
};
