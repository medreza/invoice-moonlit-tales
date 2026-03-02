# 📖 Invoice Generator - Usage Guide

## Quick Start

1. **Start the Application**
   ```bash
   npm run dev
   ```
   This starts both backend (port 3001) and frontend (port 5173)

2. **Open in Browser**
   Navigate to: http://localhost:5173

3. **Toggle Dark Mode (Optional)**
   Click the 🌙/☀️ button in the top-right corner

## Step-by-Step Instructions

### Step 1: Upload Your CSV Data

You have three options:

**Option A: Drag & Drop**
- Drag your CSV file into the upload zone
- The file will be automatically parsed

**Option B: File Picker**
- Click the "Choose File" button
- Select your CSV file from your computer
- File will be automatically parsed

**Option C: Paste CSV**
- Copy your CSV data
- Paste it into the textarea
- Click "Parse CSV" button

### Step 2: Review the Data Preview

After uploading, you'll see:
- Total number of buyers
- Total number of items
- A table with all buyers and their items
- Click on "X item(s)" to expand and see details

**Verify:**
- ✓ All buyer names are correct
- ✓ Phone numbers are present
- ✓ Items and quantities are accurate
- ✓ Prices are correct

### Step 3: Configure Invoice Settings

Fill in the required fields:

1. **Project Name** (Required)
   - Example: "SALE WALKER ETA JUNI 2026"
   - This appears on all invoices

2. **Invoice Number** (Required)
   - Example: "202512-WALKER-1"
   - Individual invoices will be numbered: XXX-1, XXX-2, etc.

3. **Output Format** (Required)
   - **Images (PNG)** - Default, recommended for social media
   - **PDF Files** - Better for printing and archiving

### Step 4: Generate & Download

1. Click "Generate & Download Invoices"
2. Wait for the generation process (you'll see "Generating invoices...")
3. A ZIP file will automatically download
4. Extract the ZIP to view all invoices

## Understanding the ZIP Contents

### If you selected "Images":
```
invoices_1234567890.zip
├── John_Doe_202512-WALKER-1-1.png
├── Jane_Smith_202512-WALKER-1-2.png
└── Bob_Wilson_202512-WALKER-1-3.png
```

### If you selected "PDF":
```
invoices_1234567890.zip
├── John_Doe_202512-WALKER-1-1.pdf
├── Jane_Smith_202512-WALKER-1-2.pdf
└── Bob_Wilson_202512-WALKER-1-3.pdf
```

## CSV Format Requirements

Your CSV must have these **required** columns (additional columns are allowed and will be ignored):

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| buyer | ✅ Yes | Customer name | John Doe |
| book title | ✅ Yes | Product name | The Great Adventure |
| format | ✅ Yes | Product format | Hardcover |
| quantity | ✅ Yes | Number of items | 2 |
| price | ✅ Yes | Total price (IDR) | 150000 |
| phone | ⭕ Optional | Phone number | 08123456789 |

**Important Notes:**
- Column names are case-insensitive
- You can use "book title" or "booktitle"
- Phone is optional - will show on invoice if provided
- Additional columns will be ignored
- Empty rows will be skipped
- Rows without a buyer name will be skipped

**Example CSV:**
```csv
buyer,book title,format,quantity,price
John Doe,The Great Adventure,Hardcover,2,150000
John Doe,Mystery Tales,Paperback,1,100000
Jane Smith,Science Fiction,eBook,3,75000
```

**Example CSV with phone numbers:**
```csv
buyer,phone,book title,format,quantity,price
John Doe,08123456789,The Great Adventure,Hardcover,2,150000
John Doe,08123456789,Mystery Tales,Paperback,1,100000
Jane Smith,08198765432,Science Fiction,eBook,3,75000
```

## Tips & Best Practices

### ✅ Do's
- Use the sample-data.csv as a template
- Preview data before generating
- Use descriptive project names
- Keep invoice numbers consistent
- Test with a small CSV first

### ❌ Don'ts
- Don't use special characters in buyer names (/, \, :, etc.)
- Don't leave required columns empty
- Don't mix different date formats
- Don't generate without previewing first

## Mobile Usage

The app works great on mobile devices:

1. **Upload**: Use file picker or paste CSV
2. **Preview**: Scroll horizontally to see full table
3. **Configure**: All inputs are full-width for easy typing
4. **Generate**: Full-width button for easy tapping

**Dark Mode on Mobile:**
- Same toggle button in top-right
- Reduces eye strain in low light
- Saves battery on OLED screens

## Troubleshooting

### "Please fill in all fields and upload CSV data"
- Make sure you've uploaded/pasted CSV data
- Fill in both Project Name and Invoice Number
- All fields marked with * are required

### "Failed to parse CSV"
- Check your CSV has all required columns
- Ensure column names match exactly (case-insensitive)
- Remove any empty rows
- Use comma (,) as separator

### "Error uploading file"
- Check file is actually a .csv file
- Ensure file size is under 5MB
- Try pasting the CSV content instead

### Download doesn't start
- Check browser popup blocker
- Try a different browser
- Check browser downloads folder
- Ensure backend server is running

## Keyboard Shortcuts

- **Tab**: Navigate between fields
- **Enter**: Submit form (when focused on inputs)
- **Escape**: Close expanded item details

## Browser Compatibility

**Fully Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Mobile:**
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+

## Performance Notes

- **Small CSV** (1-10 buyers): ~5 seconds
- **Medium CSV** (11-50 buyers): ~15-30 seconds
- **Large CSV** (50+ buyers): ~1-2 minutes

Generation time depends on:
- Number of invoices
- Output format (images take longer)
- Computer/device performance

## Data Privacy

- All processing happens on your local machine
- No data is sent to external servers
- CSV data is only kept in memory during generation
- Clear browser cache to remove any stored preferences

## Getting Help

If you encounter issues:

1. Check this guide first
2. Review the README.md
3. Check FEATURES.md for full feature list
4. Try the sample-data.csv to test
5. Restart the application

## Support

For questions or issues, contact the development team or refer to the project repository.

---

**Happy Invoicing! 🎉**

Follow us on Instagram: [@moonlittales.book](https://instagram.com/moonlittales.book)
