const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
/*eslint-disable */
function srcPath(subdir) {
  return path.resolve(__dirname, `../src/${subdir}`);
}
const pageTemplates = srcPath("page-templates");

const pageTemplatesIncluder = () => {
  const htmlTemplatePluginInstances = [];
  fs.readdirSync(pageTemplates).forEach(file => {
    const newInstance = new HtmlWebpackPlugin({
      inject: false,
      filename: file,
      template: srcPath(`page-templates/${file}`)
    });
    htmlTemplatePluginInstances.push(newInstance);
  });
  return htmlTemplatePluginInstances;
};

module.exports = { srcPath, pageTemplatesIncluder };
