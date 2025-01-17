export class HomeController {
    // constructor () { }
    homePage(_, res) {
        res.send('<h1>Hola mundo</h1>');
    }
    ping(_, res) {
        res.send('<h1>Pong</h1>');
    }
}
