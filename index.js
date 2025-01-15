// **********************************************
// ** CLASE 2  **********************************
// **********************************************

// ? API basica
// const { initBasicApi } = require('./clase2/1.basicApi')
// initBasicApi()

// ? Inicio de Express
// const { initExpressApi } = require('./clase2/3.express')
// initExpressApi()

// **********************************************
// ** CLASE 3  **********************************
// **********************************************

// ? Api REST
// const { initApiRest } = require('./clase3/1.appRest')
// initApiRest()

// **********************************************
// ** CLASE 4  **********************************
// **********************************************

// ? Api REST con ESModules
// import { initApiRest } from './clase4/1.appRest.js'
// initApiRest()

// **********************************************
// ** CLASE 5  **********************************
// **********************************************

// ? Api REST con MySQL
// import { initApiRest } from './clase5/app.js'
// import { Movie } from './clase5/models/mysql/movie.js'

// initApiRest({ movieModel: Movie })

// **********************************************
// ** TypeScript Api  ***************************
// **********************************************

// ? Api REST con TypeScript
import { initApiRest } from './typescript-api/build/index.js'

initApiRest()
