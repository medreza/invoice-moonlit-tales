import { useState } from 'react';
import './CSVUploader.css';

function CSVUploader({ onCSVParsed, onCSVTextChange, onFileNameChange }) {
  const [csvText, setCsvText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await fetch('/api/invoice/parse', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          setCsvText(text);
          if (onCSVTextChange) onCSVTextChange(text);
        };
        reader.readAsText(file);
        
        // Extract filename without extension
        const fileNameWithoutExt = file.name.replace(/\.csv$/i, '');
        if (onFileNameChange) onFileNameChange(fileNameWithoutExt);
        
        onCSVParsed(data);
      } else {
        setError(data.error || 'Failed to parse CSV');
      }
    } catch (err) {
      setError('Error uploading file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    if (!csvText.trim()) {
      setError('Please paste CSV data');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/invoice/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText })
      });

      const data = await response.json();
      
      if (data.success) {
        if (onCSVTextChange) onCSVTextChange(csvText);
        onCSVParsed(data);
      } else {
        setError(data.error || 'Failed to parse CSV');
      }
    } catch (err) {
      setError('Error parsing CSV: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  return (
    <div className="csv-uploader">
      <h2>Upload or Paste CSV Data</h2>
      
      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon">📁</div>
        <p>Drag and drop your CSV file here</p>
        <p className="or-text">or</p>
        <label className="file-input-label">
          <input 
            type="file" 
            accept=".csv"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
          Choose File
        </label>
      </div>

      <div className="paste-section">
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder="Or paste your CSV data here..."
          rows={8}
        />
        <button onClick={handlePaste} disabled={loading || !csvText.trim()}>
          {loading ? 'Parsing...' : 'Parse CSV'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default CSVUploader;
