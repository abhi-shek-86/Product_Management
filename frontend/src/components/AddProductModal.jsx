import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import './AddProductModal.css';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        const { data } = await axios.put(`/api/products/${editProduct._id}`, formData);
        setProducts((prev) => prev.map((p) => (p._id === editProduct._id ? data : p)));
      } else {
        const { data } = await axios.post('/api/products', formData);
        setProducts((prev) => [...prev, data]);
      }
      onClose();
      setFormData({ name: '', price: '', category: '' });
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Product Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
          <div className="modal-buttons">
            <button type="submit">{editProduct ? 'Update' : 'Add'}</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
