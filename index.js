const fs = require("fs");
const { createInvoice } = require("./createInvoice.js");
const dataForge = require("data-forge-fs");
const path = require("path");

const ProjectName = "BBW KL DES 2024";
const InvoiceNumber = "2024/12/BBWKL";

const BookTitleRow = "book title";

const pdfOutputDir = path.resolve(__dirname, "generated");
if (!fs.existsSync(pdfOutputDir)) {
  fs.mkdirSync(pdfOutputDir);
}

const filePath = path.resolve(__dirname, "data.csv");
const dataFrame = dataForge.readFileSync(filePath).parseCSV();
const groupedByBuyer = dataFrame.groupBy((row) => row.buyer).toArray();

var counter = 1;
groupedByBuyer.forEach((group) => {
  const buyer = group.first().buyer;
  const phone = group.first().phone;
  const items = group.toArray().map((row) => ({
    item: row[BookTitleRow],
    description: row.format,
    quantity: row.quantity,
    amount: row.price,
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0
  );

  const invoice = {
    shipping: {
      name: buyer,
      phone: phone,
    },
    items: items,
    subtotal: subtotal,
    paid: 0,
    invoice_nr: `${InvoiceNumber}-${counter++}`,
    projectName: ProjectName,
  };

  const invoicePath = path.resolve(
    __dirname,
    `generated/invoice_${invoice.invoice_nr
      .replace(/\//g, "_")
      .replace(/\s+/g, "_")}_${buyer.replace(/\s+/g, "_")}.pdf`
  );
  createInvoice(invoice, invoicePath);
});
