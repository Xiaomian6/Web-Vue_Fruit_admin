'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
  // BASE_API: '"https://easy-mock.com/mock/5cb1f38de1383c29e74b6032/fruit"',
  //BASE_API: '"http://www.zhouzhihui.cn"',
  BASE_API: '"http://47.106.94.110"',
})
