function initExpressApi () {
  const express = require('express')
  const fs = require('node:fs')
  const app = express()

  const PORT = process.env.PORT ?? 8080

  app.disable('x-powered-by')

  // * Middleware *
  // ? Forma nativa de express
  // app.use(express.json())
  // ? Forma manual
  app.use((request, response, next) => {
    if (request.method !== 'POST') return next()
    if (request.headers['content-type'] !== 'application/json') return next()

    // Solo llegan POST y las que tienen el Content-Type de JSON
    let body = ''

    // Escucha el evento data
    request.on('data', chunk => {
      body += chunk.toString()
    })

    request.on('end', () => {
      const data = JSON.parse(body)
      data.timestamp = Date.now()
      // Modifica la request para que este el body en JSON
      request.body = data
      next()
    })
  })

  app.get('/', (request, response) => {
    // Con express detecta el Content-Type que vamos a enviar
    response.send('<h1>Hola Mundo</h1>')
  })

  app.get('/imagen', (request, response) => {
    fs.readFile('./assets/img-test.png', (err, file) => {
      if (err) {
        response.status(500).send('<h1>500 Internal server error </h1>')
      }
      response.setHeader('Content-Type', 'image/png')
      return response.send(file)
    })
  })

  app.post('/products', (request, response) => {
    response.status(201).json(request.body)
  })

  // Poner el 404 al final porque asi es la ultima que va a mirar
  // El .use sirve para referenciar cualquier peticion GET POST PUT etc...
  app.use((request, response) => {
    response.status(404).send('<h1>404 Not found</h1>')
  })

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}

module.exports = {
  initExpressApi
}
