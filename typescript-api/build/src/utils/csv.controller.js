import { parse } from '@fast-csv/parse';
export default class CsvController {
    readCSV() {
    }
    createCSV(values, headers) {
        const stream = parse({ headers })
            .on('error', error => console.error(error))
            .on('data', row => console.log(row))
            .on('end', (rowCount) => console.log(`Parsed ${rowCount} rows`));
        stream.write(values);
        stream.end();
    }
}
