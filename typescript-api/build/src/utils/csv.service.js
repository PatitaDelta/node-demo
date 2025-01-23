// import { parse } from '@fast-csv/parse'
import { format } from '@fast-csv/format';
import fs from 'node:fs';
export default class CsvService {
    readCSV() {
    }
    static async createCSV(fileName, values, headers = true, noOfRows = values.length, delimiter = ',') {
        // TODO
        const csvFile = fs.createWriteStream(fileName + '.csv');
        const stream = format({ headers, delimiter });
        stream.pipe(csvFile);
        for (let i = 0; i < noOfRows; i++) {
            stream.write(values[i]);
        }
        stream.end();
        console.log(`${fileName} written with stream and ${noOfRows} rows`);
        return stream;
    }
}
