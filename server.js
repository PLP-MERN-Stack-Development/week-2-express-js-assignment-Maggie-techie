const express = require('express');
const app = express();
const PORT = 3000;

const logger = require('./middleware/logger');
const productsRouter = require('./products');
const errorHandler = require('./middleware/errorHandler');

let products = [
  {
    id: 1,
    name: 'Laptop',
    description: 'A powerful laptop',
    price: 1500,
    category: 'Electronics',
    inStock: true
  },
  {
    id: 2,
    name: 'Shoes',
    description: 'Running shoes',
    price: 80,
    category: 'Fashion',
    inStock: false
  }
];

app.locals.products = products;

app.use(express.json());
app.use(logger);

// Mount product routes
app.use('/api/products', productsRouter);

// Global error handler (placed last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
