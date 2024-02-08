
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---src-pages-about-js": preferDefault(require("C:\\Users\\bpatil\\Desktop\\react\\Gatsby\\tutorial\\src\\pages\\about.js")),
  "component---src-pages-contact-js": preferDefault(require("C:\\Users\\bpatil\\Desktop\\react\\Gatsby\\tutorial\\src\\pages\\contact.js")),
  "component---src-pages-contentful-recipe-title-js": preferDefault(require("C:\\Users\\bpatil\\Desktop\\react\\Gatsby\\tutorial\\src\\pages\\{ContentfulRecipe.title}.js")),
  "component---src-pages-error-js": preferDefault(require("C:\\Users\\bpatil\\Desktop\\react\\Gatsby\\tutorial\\src\\pages\\Error.js")),
  "component---src-pages-index-js": preferDefault(require("C:\\Users\\bpatil\\Desktop\\react\\Gatsby\\tutorial\\src\\pages\\index.js")),
  "component---src-pages-recipe-js": preferDefault(require("C:\\Users\\bpatil\\Desktop\\react\\Gatsby\\tutorial\\src\\pages\\Recipe.js")),
  "component---src-pages-tags-js": preferDefault(require("C:\\Users\\bpatil\\Desktop\\react\\Gatsby\\tutorial\\src\\pages\\Tags.js")),
  "component---src-pages-testing-js": preferDefault(require("C:\\Users\\bpatil\\Desktop\\react\\Gatsby\\tutorial\\src\\pages\\testing.js")),
  "component---src-template-tag-template-js": preferDefault(require("C:\\Users\\bpatil\\Desktop\\react\\Gatsby\\tutorial\\src\\template\\tag-template.js"))
}

