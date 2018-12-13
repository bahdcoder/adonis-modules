'use strict'

const { readdirSync } = require('fs')
const { resolve, join } = require('path')
const { ServiceProvider } = require('@adonisjs/fold')

class ModuleProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    const Helpers = this.app.use('Helpers')

    /**
     * A helper to get the modules path.
     */
    Helpers.modulesPath = () => resolve(`${__dirname}/../modules`)

    /**
     * A helper to get all modules
     */
    Helpers.getAllModules = () => readdirSync(`${__dirname}/../modules`)

    /**
     * Register all module controllers
     */
    Helpers.registerAllModuleControllers = () => {
      const modules = Helpers.getAllModules()

      const controllerPaths = modules.map(module => {
        const controllerPath = join(Helpers.modulesPath(), module, 'controllers')

        return controllerPath
      })

      modules.forEach(module => {
        const capitalizedModule = `${module.charAt(0).toUpperCase()}${module.slice(1)}`
        const controllerPath = join(Helpers.modulesPath(), module, 'controllers')

        const controllerFiles = readdirSync(controllerPath)
        controllerFiles.forEach((controllerFile) => {
          const Controller = require(`${controllerPath}/${controllerFile}`)

          this.app.bind(`Modules/${capitalizedModule}/${controllerFile.substring(0, controllerFile.length - 3)}`, () => {
            return new Controller
          })
        })
      })

      return controllerPaths
    }

    // Definte function to register routes
    Helpers.registerAllModuleRoutes = (Route) => {
      const modules = Helpers.getAllModules()
      modules.forEach(module => {
        const routeFile = require(resolve(__dirname, '..', 'modules', module, 'routes.js'))
        routeFile(Route)
      })
    }
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    const Route = this.app.use('Route')
    const Helpers = this.app.use('Helpers')
    // Register controllers
    Helpers.registerAllModuleControllers()
    // Register routes
    Helpers.registerAllModuleRoutes(Route)
  }
}

module.exports = ModuleProvider
