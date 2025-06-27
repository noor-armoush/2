const express = require('express');
const router = express.Router();

// استيراد دوال المنتجات
const productController = require('../controllers/controller');

// استيراد دوال الأصناف

// Routes for products
router.get('/allProduct', productController.getAllProducts);
router.delete('/product/:id', productController.deleteProduct);
router.get('/product/:id/variants', productController.getProductVariants);
router.put('/product/:id', productController.updateProduct);

// Routes for variants
router.delete('/variant/:id', productController.deleteVariant);
router.get('/variant/:id', productController.getSingleVariant);
router.put('/variant/:id', productController.updateVariant);

router.get('/allCategories', productController.getAllCategories);


router.put('/category/:id', productController.updateCategory);
router.post('/category',  productController.addCategory);
router.delete('/category/:id', productController.deleteCategory);
router.get('/category/:id/products', productController.getProductsByCategory);
router.get('/regions', productController.getAllRegions);

router.get('/orders',productController. getAllOrders);
router.get('/orders/:id',productController.getOrderById);
router.put('/orders/:id/status',productController.updateOrderStatus);


module.exports = router;