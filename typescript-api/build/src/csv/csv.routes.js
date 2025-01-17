import { Router } from 'express';
import { CsvController } from './csv.controller.js';
export function createCsvRouter() {
    const csvRouter = Router();
    const csvController = new CsvController();
    // TODO
    csvRouter.get('/', csvController.readCSV);
    return csvRouter;
}
