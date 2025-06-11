const express = require('express');
const router = express.Router();

const auth = require('./middleware/auth');
const validateProduct = require('./middleware/validateProduct');
const NotFoundError = require('./errors/NotFoundError');
const asyncWrapper = require('./middleware/asyncWrapper');

// GET all products with filtering and pagination
router.get('/', auth, asyncWrapper(async (req, res) => {
  let products = req.app.locals.products;
  const { category, page = 1, limit = 5 } = req.query;

  // Filter by category if provided
  if (category) {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Pagination logic
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = products.slice(startIndex, endIndex);

  res.json({
    total: products.length,
    page: parseInt(page),
    limit: parseInt(limit),
    data: paginatedProducts
  });
}));

// GET product by ID
router.get('/:id', auth, asyncWrapper(async (req, res) => {
  const products = req.app.locals.products;
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) throw new NotFoundError('Product not found');
  res.json(product);
}));

// POST new product
router.post('/', auth, validateProduct, asyncWrapper(async (req, res) => {
  const products = req.app.locals.products;
  const { name, description, price, category, inStock } = req.body;

  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price,
    category,
    inStock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
}));

// PUT update product
router.put('/:id', auth, validateProduct, asyncWrapper(async (req, res) => {
  const products = req.app.locals.products;
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) throw new NotFoundError('Product not found');

  const { name, description, price, category, inStock } = req.body;
  product.name = name;
  product.description = description;
  product.price = price;
  product.category = category;
  product.inStock = inStock;

  res.json(product);
}));

// DELETE product
router.delete('/:id', auth, asyncWrapper(async (req, res) => {
  const products = req.app.locals.products;
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) throw new NotFoundError('Product not found');

  const deletedProduct = products.splice(index, 1);
  res.json({ message: 'Product deleted successfully', deletedProduct });
}));

// SEARCH products by name
router.get('/search/name', auth, asyncWrapper(async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'Search query is required' });

  const products = req.app.locals.products;
  const results = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  res.json({
    totalResults: results.length,
    data: results
  });
}));

// PRODUCT STATISTICS: count by category
router.get('/stats/category', auth, asyncWrapper(async (req, res) => {
  const products = req.app.locals.products;
  const stats = {};

  products.forEach(p => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });

  res.json(stats);
}));

module.exports = router;
