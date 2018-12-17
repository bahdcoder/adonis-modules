'use strict'

class ArticleController {
  index ({ renderModuleView }) {

    return renderModuleView('blog.articles')
  }
}

module.exports = ArticleController
