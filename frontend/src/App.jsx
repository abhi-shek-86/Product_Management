import React from 'react';
import ProductTable from './components/ProductTable';
import './styles/app.css';

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Product Management</h1>
      <ProductTable />
    </div>
  );
}

export default App;
