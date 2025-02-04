// import { parse } from '@fast-csv/parse'
import { format } from '@fast-csv/format'
import fs from 'node:fs'

interface CreateCSVProps<T> {
  fileName: string
  values: T[]
  headers: string[]
  noOfRows: number
  delimiter: string | undefined
}

export default class CsvService {
  public static async createCSV<T extends { [key: string]: any }> ({
    fileName,
    values,
    headers,
    noOfRows,
    delimiter = ','
  }: CreateCSVProps<T>
  ): Promise<string> {
    fileName = !fileName.includes('.csv') ? fileName += '.csv' : fileName

    const csvFile = fs.createWriteStream(fileName)
    const stream = format({ headers, delimiter })
    stream.pipe(csvFile)

    // TODO tener en cuenta los sub objetos
    for (let i = 0; i < noOfRows; i++) {
      stream.write(values[i])
    }

    stream.end()
    console.log(`${fileName} written with stream and ${noOfRows} rows`)

    return fileName
  }
}
