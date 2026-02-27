import { useState } from 'react';
import CSVUploader from './components/CSVUploader';
import DataPreview from './components/DataPreview';
import InvoiceForm from './components/InvoiceForm';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [parsedData, setParsedData] = useState(null);
  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleCSVParsed = (data) => {
    setParsedData(data);
    setMessage({ type: 'success', text: `Successfully parsed ${data.totalBuyers} buyers with ${data.totalItems} items` });
  };

  const handleCSVTextChange = (text) => {
    setCsvText(text);
  };

  const handleFileNameChange = (name) => {
    setFileName(name);
  };

  const handleGenerateStart = () => {
    setMessage({ type: 'info', text: 'Generating invoices...' });
  };

  const handleGenerateComplete = () => {
    setMessage({ type: 'success', text: 'Invoices generated successfully! Download started.' });
  };

  const handleGenerateError = (error) => {
    setMessage({ type: 'error', text: error });
  };

  return (
    <div className="app">
      <ThemeToggle />
      <header className="app-header">
        <h1>🌙 Moonlit Tales Invoice Generator</h1>
        <p>Create professional invoices from your CSV data</p>
      </header>

      <main className="app-main">
        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <CSVUploader 
          onCSVParsed={handleCSVParsed} 
          onCSVTextChange={handleCSVTextChange}
          onFileNameChange={handleFileNameChange}
        />

        {parsedData && <DataPreview parsedData={parsedData} />}

        {parsedData && (
          <InvoiceForm
            csvText={csvText}
            defaultProjectName={fileName}
            onGenerateStart={handleGenerateStart}
            onGenerateComplete={handleGenerateComplete}
            onGenerateError={handleGenerateError}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 Moonlit Tales Books</p>
      </footer>
    </div>
  );
}

export default App;
