import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper: Formatear moneda argentina
handlebars.registerHelper('fmtCurrency', function (value) {
    if (value === undefined || value === null) return '';
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(value);
});

export const generateReceiptPDF = async (receiptData) => {
    try {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const templatePath = path.join(__dirname, '../templates/receipt.hbs');

        const templateHtml = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(templateHtml);

        // Prepara los datos para la vista
        // Aplanar estructura si es necesario o pasar datos directos
        const context = {
            company: receiptData.companySnapshot,
            employee: receiptData.employeeSnapshot,
            // Agregamos fullName helper on the fly (o en el helper register)
            // employee.fullName es un getter virtual, pero en snapshot es data raw.
            // Concatenamos si no viene:
            employee: {
                ...receiptData.employeeSnapshot,
                fullName: `${receiptData.employeeSnapshot.apellido}, ${receiptData.employeeSnapshot.nombre}`,
                bankInfo: `${receiptData.employeeSnapshot.banco || ''} - CBU: ${receiptData.employeeSnapshot.cbu}`
            },
            periodo: `${receiptData.periodo.mes}/${receiptData.periodo.anio}`,
            items: receiptData.items,
            totals: {
                bruto: receiptData.totales.totalBruto,
                neto: receiptData.totales.totalNeto,
                descuentos: receiptData.totales.totalDescuentos,
                noRemunerativo: receiptData.items.reduce((acc, item) => acc + (item.montoNoRemunerativo || 0), 0)
            },
            isFinal: true // Flag para quitar marca de agua de borrador
        };

        const html = template(context);

        // Instancia Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Optimización para servidores/contenedores
        });

        const page = await browser.newPage();

        await page.setContent(html, {
            waitUntil: 'networkidle0' // Espera a que carguen fuentes/estilos
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm'
            }
        });

        await browser.close();

        return pdfBuffer;

    } catch (error) {
        console.error('Error generando PDF de recibo:', error);
        throw new Error('Falló la generación del PDF');
    }
};
