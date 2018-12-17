'use strict'

const View = use('View')
const { resolve } = use('path')

class Module {
  async handle (context, next) {
    const moduleViewRender = view => {
      const viewArr = view.split('.')
      const module = viewArr[0]
      context._view_._loader._viewsPath = resolve(
        `modules/${module}/views`
      )

      viewArr.shift()

      return context.view.render(viewArr.join('.'))
    }

    context.renderModuleView = moduleViewRender

    await next()
  }
}

module.exports = Module
