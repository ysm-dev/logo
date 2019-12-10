const pkg = require('./package')

module.exports = {
  mode: 'spa',

  head: {
    title: 'Logo Game',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { property: 'og:title', hid: 'og:title', content: `Logo Game` },
      { property: 'og:description', hid: 'og:description', content: `로고 맞추기 게임` },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', hid: 'og:url', content: 'https://logo.ysm.now.sh/..' },
      {
        property: 'og:image',
        hid: 'og:image',
        content: 'https://cf.festa.io/img/2019-4-16/dc53dda2-df25-430b-8ba4-613752e1d2e6.png',
      },
    ],
    link: [
      {
        rel: 'shortcut icon',
        href: 'https://images.velog.io/post-images/chris/dec99770-700d-11e9-a5e2-859ad0b9e6fb/favicon1.ico',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Noto+Sans+KR:500,800,900',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto+Mono:400,700',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:400,900',
      },
    ],
  },

  loading: { color: '#3B8070' },

  css: [],

  plugins: [{ src: '~plugins/index.js' }],

  modules: [],
  generate: {
    dir: 'public',
  },
  build: {
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },
  },
}
