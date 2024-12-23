const fs = require('node:fs')
const data = require('./data.json')

function HomeController (request, response) {
  const { method, url } = request

  switch (method) {
    case 'GET':
      switch (url) {
        case '/':
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          return response.end(JSON.stringify(data))
        case '/imagen':
          return fs.readFile('./assets/img-test.png', (err, file) => {
            if (err) {
              response.statusCode = 500
              response.end('<h1>500 Internal server error </h1>')
            }
            response.setHeader('Content-Type', 'image/png')
            return response.end(file)
          })
        default:
          response.statusCode = 404
          response.setHeader('Content-Type', 'text/html; charset=utf-8')
          return response.end('<h1>404 Not found</h1>')
      }
    case 'POST':
      switch (url) {
        case '/products': {
          let body = ''

          // Escuchar el evento data
          // Echucha por bloques de bites
          request.on('data', chunk => {
            body += chunk.toString()
          })

          // Al terminar ya tendriamos todos los
          // datos en body
          request.on('end', () => {
            const data = JSON.parse(body)
            // Llamar a una BD para guardar los datos
            response.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' })

            data.timestamp = Date.now()
            response.end(JSON.stringify(data))
          })
          break
        }
        default:
          response.statusCode = 404
          response.setHeader('Content-Type', 'text/html; charset=utf-8')
          return response.end('<h1>404 Not found</h1>')
      }
  }
}

module.exports = {
  HomeController
}
