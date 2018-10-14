const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const { environment } = require('@rails/webpacker')
const babelLoader = environment.loaders.get("babel")
babelLoader.test = /\.(js|jsx|ts|tsx)?(\.erb)?$/

environment.plugins.prepend(
  'LodashReplacement',
  new LodashModuleReplacementPlugin
)

module.exports = environment
