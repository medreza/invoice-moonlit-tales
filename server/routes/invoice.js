const express = require('express');
const router = express.Router();
const multer = require('multer');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const { parseCSV, generateInvoices } = require('../utils/createInvoice');

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Parse CSV endpoint
router.post('/parse', upload.single('csvFile'), async (req, res) => {
  try {
    let csvText;
    
    if (req.file) {
      csvText = req.file.buffer.toString('utf-8');
    } else if (req.body && req.body.csvText) {
      csvText = req.body.csvText;
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'No CSV data provided' 
      });
    }

    const parsedData = parseCSV(csvText);
    
    res.json({
      success: true,
      data: parsedData.groups,
      totalBuyers: parsedData.totalBuyers,
      totalItems: parsedData.totalItems,
      totalAmount: parsedData.totalAmount
    });
  } catch (error) {
    console.error('Parse error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Generate invoices endpoint
router.post('/generate', async (req, res) => {
  try {
    const { csvText, projectName, invoiceNumber, outputFormat = 'image' } = req.body;

    if (!csvText || !projectName || !invoiceNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: csvText, projectName, or invoiceNumber' 
      });
    }

    // Parse CSV
    const parsedData = parseCSV(csvText);
    
    // Generate invoices
    const invoiceFiles = await generateInvoices(
      parsedData.groups,
      projectName,
      invoiceNumber,
      outputFormat
    );

    // Create ZIP archive
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=invoices_${Date.now()}.zip`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(res);

    // Add files to archive
    for (const file of invoiceFiles) {
      if (file.buffer) {
        archive.append(file.buffer, { name: file.filename });
      } else if (file.path && fs.existsSync(file.path)) {
        archive.file(file.path, { name: file.filename });
      }
    }

    await archive.finalize();

    // Cleanup temporary files
    invoiceFiles.forEach(file => {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      if (file.tempDir && fs.existsSync(file.tempDir)) {
        fs.rmSync(file.tempDir, { recursive: true, force: true });
      }
    });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
