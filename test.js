require('module-alias/register');
let Template = require('@module/Template');
let Product = require('@module/Product');

//let { Template } = require('@module/Template');
//let { Category } = require('@module/Category');
let { Builder, DB, Helpers } = require('@module/Util');


(async () => {
  let json = {
    product_price: 10.00,
    product_variants : {
      color: 'BLUE',
      size: 'small'
    },
    product_qty: 12,
    product_template: 2,
    product_user : 1,
    product_active: 1
  };

  let product = Product.Model.build(json);
  let tpl = new Template.Model();
  console.log(await product.save());
  product.destroy();
})();

