import { Request, Response } from "express"

export class HomeController {
    constructor() { }

    public homePage(_: Request, res: Response): void {
        res.send('<h1>Hola mundo</h1>')
    }

    public ping(_: Request, res: Response): void {
        res.send('<h1>Pong</h1>')
    }
}
