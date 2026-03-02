import './DataPreview.css';

function DataPreview({ parsedData }) {
  if (!parsedData) return null;

  const { data: groups, totalBuyers, totalItems, totalAmount } = parsedData;

  return (
    <div className="data-preview">
      <h2>CSV Preview</h2>
      
      <div className="summary">
        <span className="summary-item">
          <strong>{totalBuyers}</strong> buyers
        </span>
        <span className="summary-item">
          <strong>{totalItems}</strong> items total
        </span>
        <span className="summary-item summary-total">
          Total: <strong>Rp {(totalAmount || 0).toLocaleString('id-ID')}</strong>
        </span>
      </div>

      <div className="preview-table-container">
        <table className="preview-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Buyer Name</th>
              <th>Phone</th>
              <th>Items</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, index) => {
              const total = group.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{group.buyer}</td>
                  <td>{group.phone}</td>
                  <td>
                    <details>
                      <summary>{group.items.length} item(s)</summary>
                      <ul className="items-list">
                        {group.items.map((item, idx) => (
                          <li key={idx}>
                            {item.item} ({item.description}) - Qty: {item.quantity} - Rp {item.amount.toLocaleString('id-ID')}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </td>
                  <td className="amount">Rp {total.toLocaleString('id-ID')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataPreview;
