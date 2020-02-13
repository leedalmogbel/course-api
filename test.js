require('module-alias/register');
// let Template = require('@module/Template');
// let Product = require('@module/Product');
let User = require('@module/User')
let { Builder, DB, Helpers } = require('@module/Util');
const fs = require("fs");
const fastcsv = require("fast-csv");
const md5 = require('md5');

(async () => {
  // let json = {
  //   product_price: 10.00,
  //   product_variants : {
  //     color: 'BLUE',
  //     size: 'small'
  //   },
  //   product_qty: 12,
  //   product_template: 2,
  //   product_user : 1,
  //   product_active: 1
  // };

  // let product = Product.Model.build(json);
  // let tpl = new Template.Model();
  // console.log(await product.save());
  // product.destroy();

  let stream = fs.createReadStream("./Retailers_V3.csv");
  let csvData = [];
  let csvStream = fastcsv
    .parse()
    .on("data", function(data) {
      csvData.push(data);
    })
    .on("end", function() {
      // remove the first line: header
      csvData.shift();
      let json = {};

      for (let index = 0; index < csvData.length; index++) {
        json = {
          user_fullname: csvData[index][0],
          user_slug: csvData[index][10],
          user_license_info: csvData[index][1],
          user_contact_info: csvData[index][7],
          user_address_city: csvData[index][3],
          user_address_state: csvData[index][5],
          user_meta: {
            address: csvData[index][2],
            zip_code: csvData[index][6],
            region: csvData[index][4],
            lat: csvData[index][8],
            long: csvData[index][9]
          },
          user_password: md5('changemelater123'),
          user_type: 'retailer'
        };
        try {
          let user = User.Model.build(json);
          user.save();
        } catch (error) {
          console.log(error)
        }

        console.log(`Retailer ${index+1} created`)
      }

      console.log('done...')
    });

  stream.pipe(csvStream);

})();

