# 🌙 Moonlit Tales Invoice Generator

A modern web application for generating professional invoices from CSV data. Upload your sales data and automatically create beautifully formatted invoices with your company branding.

## Features

- **CSV Upload or Paste**: Drag & drop CSV files, use file picker, or paste CSV data directly
- **Data Preview**: Review parsed data with total amount calculation before generating invoices
- **Bulk Generation**: Create multiple invoices at once, grouped by buyer
- **Multiple Formats**: Choose between PNG images (default) or PDF files
- **ZIP Download**: Get all invoices in a single ZIP file
- **Beautiful UI**: Modern, responsive interface with real-time feedback
- **Dark Mode** 🌙: Toggle between light and dark themes (preference saved)
- **Mobile Responsive** 📱: Works perfectly on desktop, tablet, and mobile devices

## Prerequisites

### Option 1: Using Docker (Recommended)
- Docker
- Docker Compose

### Option 2: Local Development
- Node.js (v14 or higher)
- npm or yarn
- pdf-poppler (for PDF to image conversion)

### Installing pdf-poppler Dependencies (Local Development Only)

**macOS:**
```bash
brew install poppler
```

**Ubuntu/Debian:**
```bash
sudo apt-get install poppler-utils
```

**Windows:**
Download and install from: https://github.com/oschwartz10612/poppler-windows/releases/

## Quick Start with Docker

The easiest way to run the application is using Docker:

```bash
make run
```

This will:
- Build the Docker images
- Start both backend and frontend services
- Make the app available at http://localhost

**Other useful commands:**
```bash
make stop      # Stop the application
make logs      # View application logs
make restart   # Restart the application
make clean     # Clean up everything
make help      # Show all commands
```

📖 **For detailed Docker instructions**, see [DOCKER.md](DOCKER.md)

## Installation (Local Development)

1. **Clone the repository**
```bash
git clone https://github.com/medreza/invoice-moonlit-tales.git
cd invoice-moonlit-tales
```

2. **Install server dependencies**
```bash
npm install
```

3. **Install client dependencies**
```bash
cd client
npm install
cd ..
```

## Running the Application

### Option 1: Local Development (Without Docker)

**Easiest - Use Makefile:**
```bash
make run-local
```

This will start both servers:
- Backend server on http://localhost:3001
- Frontend on http://localhost:5173

**Or use npm directly:**
```bash
npm run dev
```

**Run servers separately:**
```bash
make server  # Backend only
make client  # Frontend only
```

**Open your browser and navigate to:** http://localhost:5173

### Option 2: Development Mode (Manual)

You'll need two terminal windows:

**Terminal 1 - Start the Backend Server:**
```bash
npm run server
```
Server will run on http://localhost:3001

**Terminal 2 - Start the Frontend:**
```bash
cd client
npm run dev
```
Frontend will run on http://localhost:5173

**Open your browser and navigate to:** http://localhost:5173

## CSV Format

Your CSV file must include the following **required** columns (additional columns are allowed and will be ignored):
- `buyer` - Customer name
- `book title` (or `booktitle`) - Product/book name
- `format` - Product format/description
- `quantity` - Number of items
- `price` - Price per item (in IDR)

**Optional columns:**
- `phone` - Customer phone number (will be displayed on invoice if provided)

**Note:** Column names are case-insensitive. Additional columns in your CSV will be ignored.

### Example CSV:

```csv
buyer,book title,format,quantity,price
John Doe,The Great Adventure,Hardcover,2,150000
John Doe,Mystery Tales,Paperback,1,100000
Jane Smith,Science Fiction,eBook,3,75000
```

**With optional phone numbers:**
```csv
buyer,phone,book title,format,quantity,price
John Doe,08123456789,The Great Adventure,Hardcover,2,150000
John Doe,08123456789,Mystery Tales,Paperback,1,100000
Jane Smith,08198765432,Science Fiction,eBook,3,75000
```

## How to Use

1. **Upload CSV Data**
   - Drag and drop your CSV file into the upload zone, OR
   - Click "Choose File" to select a CSV file, OR
   - Paste CSV content directly into the text area and click "Parse CSV"

2. **Review Preview**
   - Check the parsed data in the preview table
   - Verify buyer names, phone numbers, and items
   - See totals for each buyer

3. **Configure Invoice**
   - Enter Project Name (e.g., "SALE WALKER ETA JUNI 2026")
   - Enter Invoice Number (e.g., "202512-WALKER-1")
   - Choose output format: Images (PNG) or PDF

4. **Generate & Download**
   - Click "Generate & Download Invoices"
   - A ZIP file will be downloaded containing all invoices
   - Each invoice is named: `{BuyerName}_{InvoiceNumber}.png` (or `.pdf`)

## Project Structure

```
invoice-moonlit-tales/
├── server/                 # Backend Express server
│   ├── index.js           # Server entry point
│   ├── routes/
│   │   └── invoice.js     # API routes
│   └── utils/
│       └── createInvoice.js  # Invoice generation logic
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── CSVUploader.jsx
│   │   │   ├── DataPreview.jsx
│   │   │   └── InvoiceForm.jsx
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── vite.config.js     # Vite configuration
├── logo-moonlit-tales.jpeg # Company logo
└── package.json           # Root dependencies
```

## API Endpoints

### POST `/api/invoice/parse`
Parse CSV data and return preview.

**Request (multipart/form-data):**
- `csvFile`: CSV file

**OR Request (JSON):**
```json
{
  "csvText": "buyer,phone,book title..."
}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "totalBuyers": 5,
  "totalItems": 12
}
```

### POST `/api/invoice/generate`
Generate invoices and return ZIP file.

**Request (JSON):**
```json
{
  "csvText": "buyer,phone,book title...",
  "projectName": "SALE WALKER ETA JUNI 2026",
  "invoiceNumber": "202512-WALKER-1",
  "outputFormat": "image"
}
```

**Response:** ZIP file download

## Technologies Used

**Backend:**
- Express.js - Web server
- PDFKit - PDF generation
- pdf-poppler - PDF to image conversion
- Multer - File upload handling
- Archiver - ZIP file creation

**Frontend:**
- React - UI framework
- Vite - Build tool and dev server
- CSS3 - Styling

## Invoice Format

Generated invoices include:
- Moonlit Tales Books branding
- Invoice number
- Invoice date
- Customer name and phone
- Project name
- Itemized list with descriptions, quantities, and prices
- Subtotal and balance due
- Instagram handle (@moonlittales.book)

## Troubleshooting

**Server won't start:**
- Check if port 3001 is available
- Make sure all dependencies are installed: `npm install`

**Client won't start:**
- Check if port 5173 is available
- Make sure client dependencies are installed: `cd client && npm install`

**CSV parsing fails:**
- Verify CSV has required columns
- Check for proper CSV formatting
- Ensure data doesn't have special characters that break CSV format

**Image generation fails:**
- Make sure poppler is installed on your system
- Check pdf-poppler installation: `npm list pdf-poppler`

## License

ISC

## Author

Moonlit Tales Books

---

**Follow us on Instagram:** [@moonlittales.book](https://instagram.com/moonlittales.book)
