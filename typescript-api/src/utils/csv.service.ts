// import { parse } from '@fast-csv/parse'
import { format } from '@fast-csv/format'
import fs from 'node:fs'

export default class CsvService {
  public readCSV (): void {

  }

  public static async createCSV (
    fileName: string,
    values: any[],
    headers: string[] | boolean = true,
    noOfRows: number = values.length,
    delimiter: string = ','
  ): Promise<any> {
    // TODO
    const csvFile = fs.createWriteStream(fileName + '.csv')
    const stream = format({ headers, delimiter })
    stream.pipe(csvFile)

    for (let i = 0; i < noOfRows; i++) {
      stream.write(values[i])
    }

    stream.end()
    console.log(`${fileName} written with stream and ${noOfRows} rows`)

    return stream
  }
}
