const http = require('node:http')
const fs = require('node:fs')
const desiredPort = process.env.PORT ?? 8080

http
  .createServer((req, res) => {
    console.log('REQUEST RECIVED', req.url)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    if (req.url === '/') {
      res.end('<h1>Bienvenido a mi página web</h1>')
      return
    }

    if (req.url === '/contacto') {
      res.end('<h1>Contactos</h1>')
      return
    }

    if (req.url === '/imagen.png') {
      fs.readFile('./assets/img-test.png', (err, data) => {
        if (err) {
          res.statusCode = 500
          res.end('<h1>500 Internal server error</h1>')
          return
        }
        res.setHeader('Content-Type', 'imagen/png')
        res.end(data)
      })
      return
    }

    res.statusCode = 404
    res.end('<h1>404</h1>')
  })
  .listen(desiredPort, () => {
    console.log(`server listening on port http://localhost:${desiredPort}`)
  })
