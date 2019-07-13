var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.send({
    error: true,
    message: 'Invalid Request'
  });
  
  // res.setHeader('Content-Type', 'application/json');
  /*let product = new Product();
    let pr = await product.select('products.*',
    'product_templates.*',
    'product_templates.id as tId',
    'products.id as pId')
    //.where('products.id', 1)
    .innerJoin('product_templates',
    'template',
    'product_templates.id')
    .find();*/

    // let tpl = new Template.Model(2);

    // tpl = await tpl.findOne();
    // let c = await tpl.categoryObject().findOne();
    // res.send(await c.templates().where('template_active', 1).limit(1).orderBy('template_id', 'desc').find());
    // res.end();
});

module.exports = router;
