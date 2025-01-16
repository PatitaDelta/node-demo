import express from 'express';
import cors from 'cors';
import { createHomeRouter } from './src/home/home.routes.js';
import { createCsvRouter } from './src/csv/csv.routes.js';
export function initApiRest() {
    var _a;
    const app = express();
    const homeRouter = createHomeRouter();
    const csvRouter = createCsvRouter();
    app.disable('x-powered-by');
    app.use(express.json());
    app.use(cors());
    app.use('/', homeRouter);
    app.use('/csv', csvRouter);
    const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080;
    app.listen(PORT, () => {
        console.log(`Listening in the port ${PORT}`);
    });
}
