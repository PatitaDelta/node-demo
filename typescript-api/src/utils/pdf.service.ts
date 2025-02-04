import PDFDocument from 'pdfkit-table'
import fs from 'node:fs'

interface CreatePDFProps<T> {
  fileName: string
  values: T[]
  headers: string[]
  noOfRows: number
}

export default class PdfService {
  public static async createPDF<T extends { [key: string]: any }> ({
    fileName,
    values,
    headers,
    noOfRows
  }: CreatePDFProps<T>
  ): Promise<string> {
    fileName = !fileName.includes('.pdf') ? fileName += '.pdf' : fileName
    noOfRows = noOfRows > values.length ? noOfRows = values.length : noOfRows

    const pdfFile = fs.createWriteStream(fileName)
    const doc = new PDFDocument({ margin: 30, size: 'A4' })
    doc.pipe(pdfFile)

    // Forma de hacer una tabla sin la libreria de pdfkit-table
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

    // TODO tener en cuenta los sub objetos
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
