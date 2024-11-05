import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [stockData, setStockData] = useState(JSON.parse(localStorage.getItem('stockData')) || {});
  const [currentSection, setCurrentSection] = useState('productsSection');

  // Sync stock data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stockData', JSON.stringify(stockData));
  }, [stockData]);

  // Add a product to stock
  const addProduct = (product) => {
    setStockData(prevStockData => {
      const updatedData = { ...prevStockData };
      updatedData[product.name] = updatedData[product.name]
        ? updatedData[product.name] + product.quantity
        : product.quantity;
      return updatedData;
    });
  };

  // Remove a certain quantity of a product from stock
  const removeProduct = (productName, quantity) => {
    setStockData(prevStockData => {
      const updatedData = { ...prevStockData };
      if (updatedData[productName]) {
        updatedData[productName] -= quantity;
        if (updatedData[productName] <= 0) {
          delete updatedData[productName];
        }
      }
      return updatedData;
    });
  };

  // Switch between sections
  const showSection = (sectionId) => {
    setCurrentSection(sectionId);
  };

  return (
    <div className="App">
      <Sidebar showSection={showSection} />
      <MainContent
        stockData={stockData}
        addProduct={addProduct}
        removeProduct={removeProduct}
        currentSection={currentSection}
      />
    </div>
  );
}

function Sidebar({ showSection }) {
  return (
    <div className="sidebar">
      <h2 onClick={() => showSection('productsSection')}>Menu</h2>
      <div className="separator"></div>
      <a href="#products" className="menu-item" onClick={() => showSection('productsSection')}>Products</a>
      <a href="#productStock" className="menu-item" onClick={() => showSection('productStockSection')}>Product Stock</a>
      <a href="#logout" className="menu-item">Logout</a>
    </div>
  );
}

function MainContent({ stockData, addProduct, removeProduct, currentSection }) {
  return (
    <div className="main">
      {currentSection === 'productsSection' && (
        <ProductsSection addProduct={addProduct} stockData={stockData} removeProduct={removeProduct} />
      )}
      {currentSection === 'productStockSection' && <ProductStockSection addProduct={addProduct} />}
    </div>
  );
}

function ProductsSection({ addProduct, stockData, removeProduct }) {
  const [productName, setProductName] = useState('');
  const [productDate, setProductDate] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  const [productPrice, setProductPrice] = useState(0);
  const [productNote, setProductNote] = useState('');

  const handleSubmit = () => {
    if (productName && productDate && productQuantity > 0 && productPrice > 0) {
      addProduct({
        name: productName,
        quantity: productQuantity,
        price: productPrice,
        note: productNote,
      });
      setProductName('');
      setProductDate('');
      setProductQuantity(1);
      setProductPrice(0);
      setProductNote('');
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <div>
      <h1>Stock Management</h1>
      <div className="add-product">
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
        </div>
        <div>
          <input
            type="number"
            value={productQuantity}
            onChange={(e) => setProductQuantity(Number(e.target.value))}
            placeholder="Qty"
            required
            min="1"
          />
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(Number(e.target.value))}
            placeholder="Price"
            required
            min="0.01"
            step="0.01"
          />
          <input
            type="text"
            value={productNote}
            onChange={(e) => setProductNote(e.target.value)}
            placeholder="Notes"
          />
        </div>
        <button onClick={handleSubmit}>Add Product</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Date</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(stockData).map((productName) => (
            <tr key={productName}>
              <td>{productName}</td>
              <td>-</td>
              <td>{stockData[productName]}</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>
                <button onClick={() => removeProduct(productName, stockData[productName])}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductStockSection({ addProduct }) {
  const [incomingProductName, setIncomingProductName] = useState('');
  const [incomingQuantity, setIncomingQuantity] = useState(1);
  const [incomingNote, setIncomingNote] = useState('');

  const handleIncomingSubmit = () => {
    if (incomingProductName && incomingQuantity > 0) {
      addProduct({
        name: incomingProductName,
        quantity: incomingQuantity,
        price: 0,
        note: incomingNote,
      });
      setIncomingProductName('');
      setIncomingQuantity(1);
      setIncomingNote('');
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <div>
      <h1>Manage Stock</h1>
      <div className="add-product">
        <h3>Add Incoming Stock</h3>
        <div>
          <input
            type="text"
            value={incomingProductName}
            onChange={(e) => setIncomingProductName(e.target.value)}
            placeholder="Product Name"
            required
          />
          <input
            type="number"
            value={incomingQuantity}
            onChange={(e) => setIncomingQuantity(Number(e.target.value))}
            placeholder="Qty"
            required
            min="1"
          />
          <input
            type="text"
            value={incomingNote}
            onChange={(e) => setIncomingNote(e.target.value)}
            placeholder="Notes"
          />
        </div>
        <button onClick={handleIncomingSubmit}>Add Incoming Stock</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {/* Display incoming stock */}
          {/* Incoming stock display could be implemented here */}
        </tbody>
      </table>
    </div>
  );
}

export default App;
