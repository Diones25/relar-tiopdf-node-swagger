const { Router } = require('express');
const productController = require('../controller/productController.js');

const router = Router();

router.get('/', (req, res) => {
  return res.json('Hello');
});

router.get('/products', productController.show);
router.get('/product/:id', productController.details);
router.get('/products/report', productController.productsReport);
router.post('/products', productController.create);
router.put('/products/:id', productController.edit);
router.delete('/products/:id', productController.remove);

module.exports = router; 