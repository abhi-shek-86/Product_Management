const Product = require('../models/productModel');

// Get All Products
const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

// Add Product
const addProduct = async (req, res) => {
  const { name, price, category } = req.body;
  const product = new Product({ name, price, category });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// Update Product
const updateProduct = async (req, res) => {
  const { name, price, category } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };
