import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [stockData, setStockData] = useState(JSON.parse(localStorage.getItem('stockData')) || {});
  const [salesData, setSalesData] = useState(JSON.parse(localStorage.getItem('salesData')) || []);
  
  // Product Management State
  const [productName, setProductName] = useState('');
  const [productDate, setProductDate] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productNote, setProductNote] = useState('');

  // Incoming Stock State
  const [incomingProductName, setIncomingProductName] = useState('');
  const [incomingQuantity, setIncomingQuantity] = useState('');
  const [incomingNote, setIncomingNote] = useState('');

  // Outgoing Stock State
  const [outgoingProductName, setOutgoingProductName] = useState('');
  const [outgoingQuantity, setOutgoingQuantity] = useState('');
  const [outgoingNote, setOutgoingNote] = useState('');

  // Sale Management State
  const [saleProductName, setSaleProductName] = useState('');
  const [saleQuantity, setSaleQuantity] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [saleNote, setSaleNote] = useState('');

  useEffect(() => {
    // Save stock and sales data to localStorage
    localStorage.setItem('stockData', JSON.stringify(stockData));
    localStorage.setItem('salesData', JSON.stringify(salesData));
  }, [stockData, salesData]);

  // Toggle Sections Display
  const showSection = (section) => {
    document.querySelectorAll('.main').forEach((sectionElement) => {
      sectionElement.style.display = 'none';
    });
    document.getElementById(section).style.display = 'block';
  };

  // Product Management Functions
  const addProduct = () => {
    if (productName && productDate && productQuantity > 0 && productPrice > 0) {
      const totalValue = parseInt(productQuantity) * parseFloat(productPrice);
      const newStockData = { ...stockData, [productName]: (stockData[productName] || 0) + parseInt(productQuantity) };
      setStockData(newStockData);
      clearProductFields();
    } else {
      alert("Please fill in all required fields with valid values.");
    }
  };

  const clearProductFields = () => {
    setProductName('');
    setProductDate('');
    setProductQuantity('');
    setProductPrice('');
    setProductNote('');
  };

  const removeProduct = (productName, quantity) => {
    const newStockData = { ...stockData };
    newStockData[productName] -= quantity;
    if (newStockData[productName] <= 0) {
      delete newStockData[productName];
    }
    setStockData(newStockData);
  };

  // Stock Management Functions
  const addIncomingStock = () => {
    if (incomingProductName && incomingQuantity > 0) {
      const newStockData = { ...stockData, [incomingProductName]: (stockData[incomingProductName] || 0) + parseInt(incomingQuantity) };
      setStockData(newStockData);
      clearIncomingFields();
    } else {
      alert("Please fill in all required fields with valid values.");
    }
  };

  const addOutgoingStock = () => {
    if (outgoingProductName && outgoingQuantity > 0) {
      if (stockData[outgoingProductName] === undefined || stockData[outgoingProductName] < outgoingQuantity) {
        alert("Insufficient stock available.");
        return;
      }
      const newStockData = { ...stockData, [outgoingProductName]: stockData[outgoingProductName] - outgoingQuantity };
      setStockData(newStockData);
      clearOutgoingFields();
    } else {
      alert("Please fill in all required fields with valid values.");
    }
  };

  const clearIncomingFields = () => {
    setIncomingProductName('');
    setIncomingQuantity('');
    setIncomingNote('');
  };

  const clearOutgoingFields = () => {
    setOutgoingProductName('');
    setOutgoingQuantity('');
    setOutgoingNote('');
  };

  // Sales Management Functions
  const addSale = () => {
    if (saleProductName && saleQuantity > 0 && salePrice > 0) {
      const totalSale = parseInt(saleQuantity) * parseFloat(salePrice);
      const newSale = {
        product: saleProductName,
        quantity: saleQuantity,
        price: salePrice,
        total: totalSale,
        notes: saleNote,
      };
      setSalesData([...salesData, newSale]);
      clearSaleFields();
    } else {
      alert("Please fill in all required fields with valid values.");
    }
  };

  const clearSaleFields = () => {
    setSaleProductName('');
    setSaleQuantity('');
    setSalePrice('');
    setSaleNote('');
  };

  return (
    <div className="App">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 onClick={() => showSection('productsSection')}>Stock Management</h2>
        <div className="separator"></div>
        <a href="#products" className="menu-item" onClick={() => showSection('productsSection')}>Products</a>
        <a href="#productStock" className="menu-item" onClick={() => showSection('stockSection')}>Product Stock</a>
        <a href="#sales" className="menu-item" onClick={() => showSection('salesSection')}>Sales</a>
        <a href="#logout" className="menu-item">Logout</a>
      </div>

      {/* Products Section */}
      <div className="main" id="productsSection">
        <h1>Stock Management</h1>
        <div className="add-product">
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product Name" required />
          <input type="date" value={productDate} onChange={(e) => setProductDate(e.target.value)} required />
          <input type="number" value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)} placeholder="Quantity" min="1" required />
          <input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="Price" min="0.01" step="0.01" required />
          <input type="text" value={productNote} onChange={(e) => setProductNote(e.target.value)} placeholder="Notes" />
          <button onClick={addProduct}>Add Product</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Date</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Value</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stockData).map(([productName, quantity]) => (
              <tr key={productName}>
                <td>{productName}</td>
                <td>-</td>
                <td>{quantity}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>
                  <button onClick={() => removeProduct(productName, quantity)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock Section */}
      <div className="main" id="stockSection">
        <h1>Manage Stock</h1>
        <div className="add-product">
          <h3>Add Incoming Stock</h3>
          <input type="text" value={incomingProductName} onChange={(e) => setIncomingProductName(e.target.value)} placeholder="Product Name" required />
          <input type="number" value={incomingQuantity} onChange={(e) => setIncomingQuantity(e.target.value)} placeholder="Quantity" min="1" required />
          <input type="text" value={incomingNote} onChange={(e) => setIncomingNote(e.target.value)} placeholder="Notes" />
          <button onClick={addIncomingStock}>Add Incoming Stock</button>
        </div>
        <div className="add-product">
          <h3>Add Outgoing Stock</h3>
          <input type="text" value={outgoingProductName} onChange={(e) => setOutgoingProductName(e.target.value)} placeholder="Product Name" required />
          <input type="number" value={outgoingQuantity} onChange={(e) => setOutgoingQuantity(e.target.value)} placeholder="Quantity" min="1" required />
          <input type="text" value={outgoingNote} onChange={(e) => setOutgoingNote(e.target.value)} placeholder="Notes" />
          <button onClick={addOutgoingStock}>Add Outgoing Stock</button>
        </div>
      </div>

      {/* Sales Section */}
      <div className="main" id="salesSection">
        <h1>Sales Management</h1>
        <div className="add-sale">
          <input type="text" value={saleProductName} onChange={(e) => setSaleProductName(e.target.value)} placeholder="Product Name" required />
          <input type="number" value={saleQuantity} onChange={(e) => setSaleQuantity(e.target.value)} placeholder="Quantity" min="1" required />
          <input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="Price" min="0.01" step="0.01" required />
          <input type="text" value={saleNote} onChange={(e) => setSaleNote(e.target.value)} placeholder="Notes" />
          <button onClick={addSale}>Add Sale</button>
        </div>
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
    </div>
  );
}

export default App;
