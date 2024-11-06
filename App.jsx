import React, { useState, useEffect } from 'react';
import './App.css';
function App() {
  const [currentSection, setCurrentSection] = useState('productsSection');
  const [stockData, setStockData] = useState(JSON.parse(localStorage.getItem('stockData')) || {});
  const [salesData, setSalesData] = useState(JSON.parse(localStorage.getItem('salesData')) || []);

  const showSection = (section) => {
    setCurrentSection(section);
  };

  const addProduct = (productName, productDate, productQuantity, productPrice, productNote) => {
    const total = productQuantity * productPrice;
    const updatedStock = { ...stockData, [productName]: (stockData[productName] || 0) + productQuantity };
    setStockData(updatedStock);
    localStorage.setItem('stockData', JSON.stringify(updatedStock));
  };

  const addIncomingStock = (productName, quantity, note) => {
    const updatedStock = { ...stockData, [productName]: (stockData[productName] || 0) + quantity };
    setStockData(updatedStock);
    localStorage.setItem('stockData', JSON.stringify(updatedStock));
  };

  const addOutgoingStock = (productName, quantity, note) => {
    if (stockData[productName] < quantity) {
      alert('Insufficient stock');
      return;
    }
    const updatedStock = { ...stockData, [productName]: stockData[productName] - quantity };
    setStockData(updatedStock);
    localStorage.setItem('stockData', JSON.stringify(updatedStock));
  };

  const addSale = (productName, saleQuantity, salePrice, saleNote) => {
    const totalSale = saleQuantity * salePrice;
    const saleRecord = { product: productName, quantity: saleQuantity, price: salePrice, total: totalSale, notes: saleNote };
    const updatedSales = [...salesData, saleRecord];
    setSalesData(updatedSales);
    localStorage.setItem('salesData', JSON.stringify(updatedSales));
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={sidebarStyle}>
        <h2 onClick={() => showSection('productsSection')} style={headerStyle}>Menu</h2>
        <div style={separatorStyle}></div>
        <a href="#products" onClick={() => showSection('productsSection')} style={linkStyle}>Products</a>
        <a href="#stock" onClick={() => showSection('stockSection')} style={linkStyle}>Product Stock</a>
        <a href="#sales" onClick={() => showSection('salesSection')} style={linkStyle}>Sales</a>
        <a href="#logout" onClick={() => alert("Logout functionality")} style={linkStyle}>Logout</a>
      </div>
      
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        {currentSection === 'productsSection' && (
          <ProductManagement addProduct={addProduct} stockData={stockData} />
        )}
        {currentSection === 'stockSection' && (
          <StockManagement
            addIncomingStock={addIncomingStock}
            addOutgoingStock={addOutgoingStock}
            stockData={stockData}
          />
        )}
        {currentSection === 'salesSection' && (
          <SalesManagement addSale={addSale} salesData={salesData} />
        )}
      </div>
      
      <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
          <button style={githubButtonStyle}>View on GitHub</button>
        </a>
      </div>
    </div>
  );
}

const sidebarStyle = {
  width: '240px',
  backgroundColor: '#1c1c1c',
  padding: '20px',
  borderRight: '2px solid #444',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = {
  fontSize: '26px',
  color: '#fff',
  fontWeight: '600',
  textAlign: 'center',
  cursor: 'pointer',
};

const separatorStyle = {
  borderBottom: '2px solid #444',
  marginBottom: '20px',
};

const linkStyle = {
  color: '#ccc',
  padding: '12px',
  margin: '6px 0',
  borderRadius: '5px',
  fontSize: '16px',
  textDecoration: 'none',
  transition: 'background-color 0.3s ease',
};

const githubButtonStyle = {
  backgroundColor: '#333',
  color: '#fff',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
};

// ProductManagement Component
function ProductManagement({ addProduct, stockData }) {
  const [productName, setProductName] = useState('');
  const [productDate, setProductDate] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productNote, setProductNote] = useState('');

  const handleSubmit = () => {
    if (productName && productDate && productQuantity && productPrice > 0) {
      addProduct(productName, productDate, parseInt(productQuantity), parseFloat(productPrice), productNote);
      setProductName('');
      setProductDate('');
      setProductQuantity('');
      setProductPrice('');
      setProductNote('');
    } else {
      alert('Please fill in all required fields with valid values.');
    }
  };

  return (
    <div>
      <h1>Stock Management</h1>
      <div>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product Name"
          required
        />
        <input
          type="date"
          value={productDate}
          onChange={(e) => setProductDate(e.target.value)}
          required
        />
        <input
          type="number"
          value={productQuantity}
          onChange={(e) => setProductQuantity(e.target.value)}
          placeholder="Qty"
          required
        />
        <input
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          placeholder="Price"
          required
        />
        <input
          type="text"
          value={productNote}
          onChange={(e) => setProductNote(e.target.value)}
          placeholder="Notes"
        />
        <button onClick={handleSubmit}>Add Product</button>
      </div>
      <div>
        <h2>Current Stock</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(stockData).map((product) => (
              <tr key={product}>
                <td>{product}</td>
                <td>{stockData[product]}</td>
                <td><button onClick={() => alert("Remove functionality")}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// StockManagement Component
function StockManagement({ addIncomingStock, addOutgoingStock, stockData }) {
  const [incomingProductName, setIncomingProductName] = useState('');
  const [incomingQuantity, setIncomingQuantity] = useState('');
  const [incomingNote, setIncomingNote] = useState('');

  const [outgoingProductName, setOutgoingProductName] = useState('');
  const [outgoingQuantity, setOutgoingQuantity] = useState('');
  const [outgoingNote, setOutgoingNote] = useState('');

  const handleAddIncomingStock = () => {
    if (incomingProductName && incomingQuantity > 0) {
      addIncomingStock(incomingProductName, parseInt(incomingQuantity), incomingNote);
      setIncomingProductName('');
      setIncomingQuantity('');
      setIncomingNote('');
    }
  };

  const handleAddOutgoingStock = () => {
    if (outgoingProductName && outgoingQuantity > 0) {
      addOutgoingStock(outgoingProductName, parseInt(outgoingQuantity), outgoingNote);
      setOutgoingProductName('');
      setOutgoingQuantity('');
      setOutgoingNote('');
    }
  };

  return (
    <div>
      <h1>Manage Stock</h1>

      <h2>Add Incoming Stock</h2>
      <div>
        <input
          type="text"
          value={incomingProductName}
          onChange={(e) => setIncomingProductName(e.target.value)}
          placeholder="Product Name"
        />
        <input
          type="number"
          value={incomingQuantity}
          onChange={(e) => setIncomingQuantity(e.target.value)}
          placeholder="Quantity"
        />
        <input
          type="text"
          value={incomingNote}
          onChange={(e) => setIncomingNote(e.target.value)}
          placeholder="Notes"
        />
        <button onClick={handleAddIncomingStock}>Add Incoming</button>
      </div>

      <h2>Add Outgoing Stock</h2>
      <div>
        <input
          type="text"
          value={outgoingProductName}
          onChange={(e) => setOutgoingProductName(e.target.value)}
          placeholder="Product Name"
        />
        <input
          type="number"
          value={outgoingQuantity}
          onChange={(e) => setOutgoingQuantity(e.target.value)}
          placeholder="Quantity"
        />
        <input
          type="text"
          value={outgoingNote}
          onChange={(e) => setOutgoingNote(e.target.value)}
          placeholder="Notes"
        />
        <button onClick={handleAddOutgoingStock}>Add Outgoing</button>
      </div>
    </div>
  );
}

// SalesManagement Component
function SalesManagement({ addSale, salesData }) {
  const [saleProductName, setSaleProductName] = useState('');
  const [saleQuantity, setSaleQuantity] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [saleNote, setSaleNote] = useState('');

  const handleSaleSubmit = () => {
    if (saleProductName && saleQuantity > 0 && salePrice > 0) {
      addSale(saleProductName, parseInt(saleQuantity), parseFloat(salePrice), saleNote);
      setSaleProductName('');
      setSaleQuantity('');
      setSalePrice('');
      setSaleNote('');
    }
  };

  return (
    <div>
      <h1>Sales Management</h1>
      <div>
        <input
          type="text"
          value={saleProductName}
          onChange={(e) => setSaleProductName(e.target.value)}
          placeholder="Product Name"
        />
        <input
          type="number"
          value={saleQuantity}
          onChange={(e) => setSaleQuantity(e.target.value)}
          placeholder="Quantity"
        />
        <input
          type="number"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          placeholder="Price"
        />
        <input
          type="text"
          value={saleNote}
          onChange={(e) => setSaleNote(e.target.value)}
          placeholder="Notes"
        />
        <button onClick={handleSaleSubmit}>Add Sale</button>
      </div>

      <h2>Sales Records</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((sale, index) => (
            <tr key={index}>
              <td>{sale.product}</td>
              <td>{sale.quantity}</td>
              <td>{sale.price}</td>
              <td>{sale.total}</td>
              <td>{sale.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
