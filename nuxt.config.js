module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Country guesser',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Put in a list of countries in the left panel, check the possible matches and copy the output list' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [
    // Load a node module directly (here it's a SASS file)
    'normalize-scss',
    // CSS file in the project
    '@/assets/style/base.scss'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (ctx.isServer) {
        config.externals = [
          require('webpack-node-externals')({
            whitelist: [/^vue-slick/]
          })
        ]
      }
    }
  }
}
