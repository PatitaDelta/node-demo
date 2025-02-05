import PDFDocument from 'pdfkit-table';
import fs from 'node:fs';
export default class PdfService {
    static async createPDF({ fileName, values, headers, noOfRows }) {
        fileName = !fileName.includes('.pdf') ? fileName += '.pdf' : fileName;
        noOfRows = noOfRows > values.length ? noOfRows = values.length : noOfRows;
        const pdfFile = fs.createWriteStream(fileName);
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        doc.pipe(pdfFile);
        const tableHeaders = headers.map((header) => {
            const label = header.charAt(0).toUpperCase() + header.slice(1);
            const width = Number(values[0][header].length) + 50;
            return { label, property: header, width };
        });
        doc.table({ headers: tableHeaders, datas: values }, {
            prepareHeader: () => doc.font('Helvetica-Bold').fontSize(8),
            prepareRow: (_, indexColumn, _indexRow, rectRow) => {
                doc.font('Helvetica').fontSize(8);
                indexColumn === 0 && doc.addBackground(rectRow, 'blue', 0.15);
                return doc;
            }
        }).catch(console.log);
        doc.end();
        return fileName;
    }
}
