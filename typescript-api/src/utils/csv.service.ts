// import { parse } from '@fast-csv/parse'
import { format } from '@fast-csv/format'
import fs from 'node:fs'

export default class CsvService {
  public readCSV (): void {

  }

  public static async createCSV (fileName: string, values: string[], headers?: string[]): Promise<any[]>
  public static async createCSV (fileName: string, values: string[], headers: string[]): Promise<any[]> {
    // TODO
    const randoms = []
    const min = 1
    const max = 90000
    const noOfRows = 80000

    const csvFile = fs.createWriteStream(fileName + '.csv')
    const stream = format({ headers: true })
    stream.pipe(csvFile)

    for (let i = 0; i < noOfRows; i++) {
      randoms.push({
        characters: Math.random().toString(36).substr(2, 7),
        number: Math.floor(Math.random() * (max - min + 1) + min)
      })
      stream.write(randoms[i])
    }
    stream.end()
    console.log(`${fileName} written with stream and ${noOfRows} rows`)

    return randoms
  }
}
