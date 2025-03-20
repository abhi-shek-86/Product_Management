import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import './ProductTable.css';

const AddProductModal = ({ showModal, onClose, editProduct, setProducts }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: ''
  });

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        price: editProduct.price,
        category: editProduct.category
      });
    }
  }, [editProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        const { data } = await axios.put(`/api/products/${editProduct._id}`, formData);
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === editProduct._id ? data : product
          )
        );
      } else {
        const { data } = await axios.post('/api/products', formData);
        setProducts((prevProducts) => [...prevProducts, data]);
      }
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-effect">
        <div className="modal-header">
          <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="glass-input"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              className="glass-input"
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="glass-input"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              {editProduct ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="product-container glass-container">
      <div className="table-header">
        <h1>Product Management</h1>
        <button className="add-button" onClick={() => setShowModal(true)}>
          Add Product
        </button>
      </div>
      <div className="table-wrapper glass-effect">
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.category}</td>
                <td className="action-buttons">
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setEditProduct(product);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <AddProductModal
          showModal={showModal}
          onClose={() => {
            setShowModal(false);
            setEditProduct(null);
          }}
          editProduct={editProduct}
          setProducts={setProducts}
        />
      )}
    </div>
  );
};

export default ProductTable;