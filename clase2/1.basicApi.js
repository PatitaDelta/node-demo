function initBasicApi () {
  const http = require('node:http')
  const { HomeController } = require('./2.controller')
  const desiredPort = process.env.PORT ?? 8080

  http
    .createServer((req, res) => {
      console.log('REQUEST RECIVED', req.url)
      HomeController(req, res)
    })
    .listen(desiredPort, () => {
      console.log(`server listening on port http://localhost:${desiredPort}`)
    })
}

module.exports = {
  initBasicApi
}
