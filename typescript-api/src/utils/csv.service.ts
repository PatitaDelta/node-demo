// import { parse } from '@fast-csv/parse'
import { format } from '@fast-csv/format'
import fs from 'node:fs'

export default class CsvService {
  public static readCSV (): void {

  }

  public static async createCSV<T extends { [key: string]: any }> (
    fileName: string,
    values: T[],
    headers: string[] = Object.keys(values[0]),
    noOfRows: number = values.length,
    delimiter: string = ','
  ): Promise<string> {
    fileName = !fileName.includes('.csv') ? fileName += '.csv' : fileName
    noOfRows = noOfRows > values.length ? noOfRows = values.length : noOfRows

    const csvFile = fs.createWriteStream(fileName)
    const stream = format({ headers, delimiter })
    stream.pipe(csvFile)

    for (let i = 0; i < noOfRows; i++) {
      stream.write(values[i])
    }

    stream.end()
    console.log(`${fileName} written with stream and ${noOfRows} rows`)

    return fileName
  }
}
