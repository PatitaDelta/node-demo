// import { parse } from '@fast-csv/parse'
import { format } from '@fast-csv/format';
import fs from 'node:fs';
export default class CsvService {
    static readCSV() {
    }
    static async createCSV(fileName, values, headers = Object.keys(values[0]), noOfRows = values.length, delimiter = ',') {
        fileName = !fileName.includes('.csv') ? fileName += '.csv' : fileName;
        noOfRows = noOfRows > values.length ? noOfRows = values.length : noOfRows;
        const csvFile = fs.createWriteStream(fileName);
        const stream = format({ headers, delimiter });
        stream.pipe(csvFile);
        // TODO tener en cuenta los sub objetos
        for (let i = 0; i < noOfRows; i++) {
            stream.write(values[i]);
        }
        stream.end();
        console.log(`${fileName} written with stream and ${noOfRows} rows`);
        return fileName;
    }
}
