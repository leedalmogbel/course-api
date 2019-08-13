const express = require('express');
const router = express.Router();
const Product = require('@module/Product');

// set multer storage
const multer = require('multer');
const upload = multer({ storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/products'),
    filename: (req, file, cb) =>
      cb(null, Date.now() + '.' + file.originalname.split('.').pop())
  })
});

/* GET product search */
router.get('/search', async (req, res, next) => {
  // init query
  const query = req.query || {};

  // wrap async
  try {
    // search products model
    let model = await Product.Model
      .service()
      .searchProducts(query);

    // products
    const products = await model.all();

    // count products
    const count = await model
      .count('* as total')
      .first();

    // total
    const total = count ? count.total : 0;

    // return response
    res.send({
      error: false,
      data: {
        rows: products,
        total
      }
    });
  } catch (e) {
    next(e);
  }  
});

/* GET product detail */
router.get('/detail/:product_id', async (req, res, next) => {
  // wrap async
  try {
    if (!('product_id' in req.params)) {
      throw new Error('Invalid product id');
    }
    
    // set product id
    const id = parseInt(req.params.product_id);

    // get categories
    const product = await Product.Model
      .service()
      .getProductById(id);

    // return response
    res.send({
      error: false,
      data: product
    });
  } catch (e) {
    next(e);
  }
});

/* POST product create */
router.post('/create', upload.array('product_images'), async (req, res, next) => {
  // wrap async
  try {
    // create new product
    const product = await Product.Model
      .service()
      .createProduct(req.body, req.files);

    // return response
    res.send({
      error: false,
      data: product
    });
  } catch (e) {
    next(e);
  }
});

/* POST product update */
router.post('/update', upload.array('product_images'), async (req, res, next) => {
  // wrap async
  try {
    // create new product
    const product = await Product.Model
      .service()
      .updateProduct(req.body, req.files);

    // return response
    res.send({
      error: false,
      data: product
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
