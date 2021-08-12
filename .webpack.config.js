
// define child rescript
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = config => {
  config.target = 'electron-renderer';
  config.plugins.push(
    new MonacoWebpackPlugin({
      languages: [
        "yaml"
      ],
      filename: "static/[name].worker.js"
    })
  )
  return config;
}
