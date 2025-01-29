import PDFDocument from 'pdfkit-table'
import fs from 'node:fs'

export default class PdfService {
  public static async createPDF<T extends { [key: string]: any }> (
    fileName: string,
    values: T[],
    headers: string[] = Object.keys(values[0]),
    noOfRows: number = values.length
  ): Promise<string> {
    fileName = !fileName.includes('.pdf') ? fileName += '.pdf' : fileName
    noOfRows = noOfRows > values.length ? noOfRows = values.length : noOfRows

    const pdfFile = fs.createWriteStream(fileName)
    const doc = new PDFDocument({ margin: 30, size: 'A4' })
    doc.pipe(pdfFile)

    // 🥺 Es inutil pero lo tengo cariño por eso no lo borro
    // Relleno de la tabla
    // const rows: string[][] = [[]]
    // rows.shift() // borra la inicializacion del principio
    //
    // for (let i = 0; i < noOfRows; i++) {
    //   const row: string[] = []
    //   headers.forEach(header => {
    //     row.push(values[i][header])
    //   })
    //   rows.push(row)
    // }

    // Creacion de los headers
    const tableHeaders = headers.map((header) => {
      const label = header.charAt(0).toUpperCase() + header.slice(1)
      const width: number = Number(values[0][header].length) + 50
      return { label, property: header, width }
    })

    // Creacion de la tabla
    doc.table({ headers: tableHeaders, datas: values }, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(8),
      prepareRow: (_, indexColumn, _indexRow, rectRow) => {
        doc.font('Helvetica').fontSize(8)
        indexColumn === 0 && doc.addBackground(rectRow, 'blue', 0.15)
        return doc
      }
    }).catch(console.log)

    doc.end()

    return fileName
  }
}
