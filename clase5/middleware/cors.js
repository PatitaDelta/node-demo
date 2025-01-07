import cors from 'cors' // ESModules

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:41913',
  'http://test.com',
  'http://guillermoll.es'
]

// ? Middleware - Controla el CORS
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  // Para el problema de CORS hay que poner la cabecera Access-Control-Allow-Origin
  // y poniendo como valor la url que esta atacando al server
  origin: (origin, callback) => {
    // Si esta en la lista -> permitido
    if (acceptedOrigins.includes(origin)) return callback(null, true)
    // Si es el mismo -> permitido
    if (!origin) return callback(null, true)

    return callback(new Error('Not allowed by CORS'))
  }
}
)

// ?  Middleware - My cors configuration
//   app.use('/', (req, res, next) => {
//     const origin = req.header('origin')
//     if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//       res.header('Access-Control-Allow-Origin', origin ?? '*')
//       res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
//     }
//     next()
//   })

// ? Por si no quieres que en todas la peticiones se mande el CORS
// ? El option se usa para 'PUT, PATCH, DELETE'
// app.options('/movies', (req, res) => {
//   const origin = req.header('origin')
//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
//   }
//   res.send(200)
// })
