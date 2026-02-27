const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require('path');
const { execFile } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const os = require('os');

function createInvoice(invoice, pdfPath) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(pdfPath)).on('finish', () => {
    const imageOutputDir = path.resolve(__dirname,'generated','images');
    if (!fs.existsSync(imageOutputDir)) {
      fs.mkdirSync(imageOutputDir);
    }
    convertPdfToImage(pdfPath, imageOutputDir);
  });
}

function generateHeader(doc) {
  doc
    .image("logo-moonlit-tales.jpeg", 250, 35, { width: 100 })
    .fillColor("#444444")
    .fontSize(15)
    .text("Moonlit Tales Books", 230, 125)
    .fontSize(7)
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDateToCustom(new Date()), 150, customerInformationTop + 15)
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(invoice.subtotal - invoice.paid),
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font("Helvetica");
  
  // Only show phone if provided
  let yOffset = 15;
  if (invoice.shipping.phone) {
    doc.text(invoice.shipping.phone, 300, customerInformationTop + yOffset);
    yOffset += 15;
  }
  
  doc
    .font("Helvetica-Bold")
    .text(invoice.projectName, 300, customerInformationTop + yOffset)
    .moveDown();

  generateHr(doc, 252);
}

function formatDateToCustom(date) {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 280;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Item Total"
  );
  generateHr(doc, invoiceTableTop + 15); // Adjusted header row spacing
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 20; // Reduced row height
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 15); // Adjusted horizontal line spacing
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 20; // Adjusted subtotal position
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 15; // Adjusted paid-to-date position
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(invoice.paid)
  );

  const duePosition = paidToDatePosition + 20; // Adjusted balance due position
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(invoice.subtotal - invoice.paid)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Thank you for your purchase :)",
      50,
      770,
      { align: "center", width: 500 }
    )
    .text(
      "Follow us on Instagram @moonlittales.book",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 270, y)
    .text(unitCost, 300, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

function convertPdfToImage(pdfPath, outputDir) {
  const outputPrefix = path.join(outputDir, path.basename(pdfPath, '.pdf'));
  const pdfToCairoPath = '/opt/homebrew/bin/pdftocairo';
  
  const args = [
    '-png',
    '-singlefile',
    pdfPath,
    outputPrefix
  ];
  
  execFile(pdfToCairoPath, args, (error, stdout, stderr) => {
    if (error) {
      execFile('pdftocairo', args, (error2) => {
        if (error2) {
          console.error(`PDF to image conversion failed: ${error2.message}`);
        } else {
          console.log(`Invoice image generated from ${pdfPath}`);
        }
      });
    } else {
      console.log(`Invoice image generated from ${pdfPath}`);
    }
  });
}

// Parse CSV data into groups
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row');
  }

  // Helper function to parse CSV line (handles quoted fields)
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
  const buyerIdx = headers.indexOf('buyer');
  const phoneIdx = headers.indexOf('phone');
  const bookTitleIdx = headers.findIndex(h => h === 'book title' || h === 'booktitle');
  const formatIdx = headers.indexOf('format');
  const quantityIdx = headers.indexOf('quantity');
  const priceIdx = headers.indexOf('price');

  // Only check for required columns, ignore additional ones
  // Phone is optional - will be included if present
  const missingColumns = [];
  if (buyerIdx === -1) missingColumns.push('buyer');
  if (bookTitleIdx === -1) missingColumns.push('book title (or booktitle)');
  if (formatIdx === -1) missingColumns.push('format');
  if (quantityIdx === -1) missingColumns.push('quantity');
  if (priceIdx === -1) missingColumns.push('price');

  if (missingColumns.length > 0) {
    throw new Error(`CSV is missing required columns: ${missingColumns.join(', ')}. Additional columns are allowed and will be ignored.`);
  }

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    
    const values = parseCSVLine(lines[i]);
    if (values.length > 1 && values[buyerIdx]) { // Skip rows without buyer name
      rows.push({
        buyer: values[buyerIdx] || '',
        phone: values[phoneIdx] || '',
        bookTitle: values[bookTitleIdx] || '',
        format: values[formatIdx] || '',
        quantity: parseInt(values[quantityIdx]) || 1,
        price: parseFloat(values[priceIdx]) || 0
      });
    }
  }

  // Group by buyer
  const grouped = {};
  rows.forEach(row => {
    if (!grouped[row.buyer]) {
      grouped[row.buyer] = {
        buyer: row.buyer,
        phone: row.phone,
        items: []
      };
    }
    grouped[row.buyer].items.push({
      item: row.bookTitle,
      description: row.format,
      quantity: row.quantity,
      amount: row.price
    });
  });

  const groups = Object.values(grouped);
  const totalItems = rows.length;
  const totalAmount = rows.reduce((sum, row) => sum + row.price, 0);

  return {
    groups,
    totalBuyers: groups.length,
    totalItems,
    totalAmount
  };
}

// Generate invoices and return file buffers/paths
async function generateInvoices(groups, projectName, invoiceNumber, outputFormat = 'image') {
  const invoiceFiles = [];
  const tempDir = path.join(os.tmpdir(), `invoices_${uuidv4()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  let counter = 1;

  for (const group of groups) {
    const subtotal = group.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    const invoice = {
      shipping: {
        name: group.buyer,
        phone: group.phone
      },
      items: group.items,
      subtotal: subtotal,
      paid: 0,
      invoice_nr: `${invoiceNumber}-${counter++}`,
      projectName: projectName
    };

    const safeBuyerName = group.buyer.replace(/[/\\?%*:|"<>]/g, '_').replace(/\s+/g, '_');
    const safeInvoiceNr = invoice.invoice_nr.replace(/[/\\?%*:|"<>]/g, '_').replace(/\s+/g, '_');
    const pdfFilename = `${safeBuyerName}_${safeInvoiceNr}.pdf`;
    const pdfPath = path.join(tempDir, pdfFilename);

    // Generate PDF
    await createInvoicePromise(invoice, pdfPath);

    if (outputFormat === 'pdf') {
      // Return PDF
      const pdfBuffer = fs.readFileSync(pdfPath);
      invoiceFiles.push({
        filename: pdfFilename,
        buffer: pdfBuffer
      });
      fs.unlinkSync(pdfPath);
    } else {
      // Convert to image
      const imageOutputDir = path.join(tempDir, 'images');
      fs.mkdirSync(imageOutputDir, { recursive: true });

      await convertPdfToImagePromise(pdfPath, imageOutputDir);

      // Find generated image
      const imageFiles = fs.readdirSync(imageOutputDir).filter(f => 
        f.startsWith(path.basename(pdfPath, '.pdf'))
      );

      for (const imgFile of imageFiles) {
        const imgPath = path.join(imageOutputDir, imgFile);
        const imgBuffer = fs.readFileSync(imgPath);
        const imgFilename = `${safeBuyerName}_${safeInvoiceNr}.png`;
        
        invoiceFiles.push({
          filename: imgFilename,
          buffer: imgBuffer
        });
        fs.unlinkSync(imgPath);
      }

      fs.unlinkSync(pdfPath);
    }
  }

  return invoiceFiles.map(f => ({ ...f, tempDir }));
}

// Promise-based wrapper for createInvoice
function createInvoicePromise(invoice, pdfPath) {
  return new Promise((resolve, reject) => {
    const logoPath = path.resolve(__dirname, '../../logo-moonlit-tales.jpeg');
    
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeaderWithLogo(doc, logoPath);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    doc.end();

    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
}

// Updated header function to accept logo path
function generateHeaderWithLogo(doc, logoPath) {
  doc
    .image(logoPath, 250, 35, { width: 100 })
    .fillColor("#444444")
    .fontSize(15)
    .text("Moonlit Tales Books", 230, 125)
    .fontSize(7)
    .moveDown();
}

// Promise-based wrapper for PDF to image conversion
function convertPdfToImagePromise(pdfPath, outputDir) {
  return new Promise((resolve, reject) => {
    const outputPrefix = path.join(outputDir, path.basename(pdfPath, '.pdf'));
    
    // Use system pdftocairo instead of bundled one
    // Try common paths for pdftocairo
    const pdfToCairoPath = '/opt/homebrew/bin/pdftocairo'; // macOS Homebrew path
    
    const args = [
      '-png',
      '-singlefile',
      pdfPath,
      outputPrefix
    ];
    
    execFile(pdfToCairoPath, args, (error, stdout, stderr) => {
      if (error) {
        // Fallback to system PATH
        execFile('pdftocairo', args, (error2, stdout2, stderr2) => {
          if (error2) {
            reject(new Error(`PDF to image conversion failed: ${error2.message}. Make sure poppler is installed (brew install poppler).`));
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  createInvoice,
  parseCSV,
  generateInvoices
};
