import express from 'express';
import cors from 'cors';
export function initApiRest() {
    var _a;
    const app = express();
    app.use(express.json());
    app.disable('x-powered-by');
    app.use(cors());
    app.get('/ping', (_request, response) => {
        response.send('<h1>pong</h1>');
    });
    const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080;
    app.listen(PORT, () => {
        console.log(`Listening in the port ${PORT}`);
    });
}
