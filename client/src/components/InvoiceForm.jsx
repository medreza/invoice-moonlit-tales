import { useState } from 'react';
import './InvoiceForm.css';

function InvoiceForm({ csvText, onGenerateStart, onGenerateComplete, onGenerateError }) {
  const [projectName, setProjectName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [outputFormat, setOutputFormat] = useState('image');
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csvText || !projectName || !invoiceNumber) {
      onGenerateError('Please fill in all fields and upload CSV data');
      return;
    }

    setGenerating(true);
    onGenerateStart();

    try {
      const response = await fetch('/api/invoice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvText,
          projectName,
          invoiceNumber,
          outputFormat
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate invoices');
      }

      // Download the ZIP file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoices_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      onGenerateComplete();
    } catch (err) {
      onGenerateError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="invoice-form">
      <h2>Invoice Configuration</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectName">Project Name *</label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g., SALE WALKER ETA JUNI 2026"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="invoiceNumber">Invoice Number *</label>
          <input
            id="invoiceNumber"
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="e.g., 202512-WALKER-1"
            required
          />
          <small>Individual invoices will be numbered as: {invoiceNumber || 'XXXXX'}-1, {invoiceNumber || 'XXXXX'}-2, etc.</small>
        </div>

        <div className="form-group">
          <label>Output Format *</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="image"
                checked={outputFormat === 'image'}
                onChange={(e) => setOutputFormat(e.target.value)}
              />
              <span>Images (PNG) - Default</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="pdf"
                checked={outputFormat === 'pdf'}
                onChange={(e) => setOutputFormat(e.target.value)}
              />
              <span>PDF Files</span>
            </label>
          </div>
        </div>

        <button type="submit" className="generate-button" disabled={generating || !csvText}>
          {generating ? 'Generating Invoices...' : 'Generate & Download Invoices'}
        </button>
      </form>
    </div>
  );
}

export default InvoiceForm;
