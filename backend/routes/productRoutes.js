const express = require('express');
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

router.route('/').get(getProducts).post(addProduct);
router.route('/:id').put(updateProduct).delete(deleteProduct);

module.exports = router;
