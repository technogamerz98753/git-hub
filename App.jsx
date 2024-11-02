import React, { useState, useEffect } from 'react';
import './StockManagement.css';

const StockManagement = () => {
    const [stockData, setStockData] = useState(JSON.parse(localStorage.getItem('stockData')) || {});
    const [totalIncomingStock, setTotalIncomingStock] = useState(parseInt(localStorage.getItem('totalIncomingStock')) || 0);
    const [totalOutgoingStock, setTotalOutgoingStock] = useState(parseInt(localStorage.getItem('totalOutgoingStock')) || 0);
    
    const [productName, setProductName] = useState('');
    const [productDate, setProductDate] = useState('');
    const [productQuantity, setProductQuantity] = useState(1);
    const [productPrice, setProductPrice] = useState(0);
    const [productNote, setProductNote] = useState('');
    
    const [incomingProductName, setIncomingProductName] = useState('');
    const [incomingQuantity, setIncomingQuantity] = useState(1);
    const [incomingNote, setIncomingNote] = useState('');
    
    const [outgoingProductName, setOutgoingProductName] = useState('');
    const [outgoingQuantity, setOutgoingQuantity] = useState(1);
    const [outgoingNote, setOutgoingNote] = useState('');
    useEffect(() => {
        updateStockSummary();
        renderStockTable();
    }, [stockData]);

    const updateStockSummary = () => {
        setTotalIncomingStock(prev => prev);
        setTotalOutgoingStock(prev => prev);
    };

    const renderStockTable = () => {
        // This function can be used to re-render the stock table if needed
    };

    const addProduct = () => {
        if (productName && productDate && productQuantity > 0 && productPrice > 0) {
            const total = productQuantity * productPrice;
            const updatedStockData = {
                ...stockData,
                [productName]: (stockData[productName] || 0) + productQuantity,
            };

            setStockData(updatedStockData);
            localStorage.setItem('stockData', JSON.stringify(updatedStockData));

            clearProductFields();
            updateStockSummary();
        } else {
            alert("Please fill in all required fields with valid values.");
        }
    };

    const addIncomingStock = () => {
        if (incomingProductName && incomingQuantity > 0) {
            const updatedStockData = {
                ...stockData,
                [incomingProductName]: (stockData[incomingProductName] || 0) + incomingQuantity,
            };

            setStockData(updatedStockData);
            setTotalIncomingStock(prev => prev + incomingQuantity);
            localStorage.setItem('stockData', JSON.stringify(updatedStockData));
            localStorage.setItem('totalIncomingStock', totalIncomingStock + incomingQuantity);
            clearIncomingFields();
            updateStockSummary();
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
            const updatedStockData = {
                ...stockData,
                [outgoingProductName]: stockData[outgoingProductName] - outgoingQuantity,
            };

            setStockData(updatedStockData);
            setTotalOutgoingStock(prev => prev + outgoingQuantity);
            localStorage.setItem('stockData', JSON.stringify(updatedStockData));
            localStorage.setItem('totalOutgoingStock', totalOutgoingStock + outgoingQuantity);
            clearOutgoingFields();
            updateStockSummary();
        } else {
            alert("Please fill in all required fields with valid values.");
        }
    };

    const removeProduct = (productName, quantity) => {
        const updatedStockData = { ...stockData };
        updatedStockData[productName] -= quantity;
        if (updatedStockData[productName] <= 0) {
            delete updatedStockData[productName];
        }

        setStockData(updatedStockData);
        localStorage.setItem('stockData', JSON.stringify(updatedStockData));
        updateStockSummary();
    };

    const clearProductFields = () => {
        setProductName('');
        setProductDate('');
        setProductQuantity(1);
        setProductPrice(0);
        setProductNote('');
    };

    const clearIncomingFields = () => {
        setIncomingProductName('');
        setIncomingQuantity(1);
        setIncomingNote('');
    };

    const clearOutgoingFields = () => {
        setOutgoingProductName('');
        setOutgoingQuantity(1);
        setOutgoingNote('');
    };

    return (
        <div className="stock-management">
            <div className="sidebar">
                <h2 onClick={() => setToggleMenu(!toggleMenu)}>Menu</h2>
                <div className="separator"></div>
                <a href="#products" onClick={() => setCurrentSection('products')}>Products</a>
                <a href="#productStock" onClick={() => setCurrentSection('stock')}>Product Stock</a>
                <a href="#logout">Logout</a>
            </div>

            <div className={`main ${currentSection === 'products' ? 'active' : ''}`}>
                <h1>Stock Management</h1>
                <div className="stock-summary">
                    <strong>Total Incoming Stock:</strong> <span id="totalIncoming">{totalIncomingStock}</span><br />
                    <strong>Total Outgoing Stock:</strong> <span id="totalOutgoing">{totalOutgoingStock}</span>
                </div>
                <div className="add-product">
                    <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product Name" required />
                    <input type="date" value={productDate} onChange={(e) => setProductDate(e.target.value)} required />
                    <input type="number" value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)} placeholder="Qty" required min="1" />
                    <input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="Price" required min="0.01" step="0.01" />
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
                            <th>Total</th>
                            <th>Notes</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(stockData).map((product) => (
                            <tr key={product}>
                                <td>{product}</td>
                                <td>-</td>
                                <td>{stockData[product]}</td>
                                <td>{(productPrice || 0).toFixed(2)}</td>
                                <td>{(stockData[product] * productPrice).toFixed(2)}</td>
                                <td>-</td>
                                <td>
                                    <button onClick={() => removeProduct(product, stockData[product])}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={`main ${currentSection === 'stock' ? 'active' : ''}`}>
                <h1>Manage Stock</h1>
                <div className="add-product">
                    <h3>Add Incoming Stock</h3>
                    <input type="text" value={incomingProductName} onChange={(e) => setIncomingProductName(e.target.value)} placeholder="Product Name" required />
                    <input type="number" value={incomingQuantity} onChange={(e) => setIncomingQuantity(e.target.value)} placeholder="Qty" required min="1" />
                    <input type="text" value={incomingNote} onChange={(e) => setIncomingNote(e.target.value)} placeholder="Notes" />
                    <button onClick={addIncomingStock}>Add Incoming Stock</button>
                </div>

                <div className="add-product">
                    <h3>Add Outgoing Stock</h3>
                    <input type="text" value={outgoingProductName} onChange={(e) => setOutgoingProductName(e.target.value)} placeholder="Product Name" required />
                    <input type="number" value={outgoingQuantity} onChange={(e) => setOutgoingQuantity(e.target.value)} placeholder="Qty" required min="1" />
                    <input type="text" value={outgoingNote} onChange={(e) => setOutgoingNote(e.target.value)} placeholder="Notes" />
                    <button onClick={addOutgoingStock}>Add Outgoing Stock</button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Add Incoming/Outgoing stock table rendering logic here */}
                    </tbody>
                </table>
            </div>

            <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer">
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" className="github-logo" alt="GitHub Logo" />
            </a>
        </div>
    );
};

export default StockManagement;
