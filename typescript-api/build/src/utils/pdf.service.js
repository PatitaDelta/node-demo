import PDFDocument from 'pdfkit-table';
import fs from 'node:fs';
export default class PdfService {
    static async createPDF(fileName, values, headers, noOfRows = values.length) {
        fileName = !fileName.includes('.pdf') ? fileName += '.pdf' : fileName;
        headers = headers.length === 0 ? headers = Object.keys(values[0]) : headers;
        noOfRows = noOfRows > values.length ? noOfRows = values.length : noOfRows;
        const pdfFile = fs.createWriteStream(fileName);
        const doc = new PDFDocument();
        doc.pipe(pdfFile);
        const tableArray = {
            headers: ['Country', 'Conversion rate', 'Trend'],
            rows: [
                ['Switzerland', '12%', '+1.12%'],
                ['France', '67%', '-0.98%'],
                ['England', '33%', '+4.44%']
            ]
        };
        doc.table(tableArray, { width: 300 }).catch(console.log);
        doc.text('Cabecera tabla \n' + headers.toString());
        for (let i = 0; i < noOfRows; i++) {
            headers.forEach(header => {
                doc.text(values[i][header]);
            });
        }
        doc.end();
        return fileName;
    }
}
