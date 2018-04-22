const { environment } = require('@rails/webpacker')
const babelLoader = environment.loaders.get("babel")
babelLoader.test = /\.(js|jsx|ts|tsx)?(\.erb)?$/

module.exports = environment
