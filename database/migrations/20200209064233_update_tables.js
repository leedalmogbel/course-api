
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('products', (table) => {
    // product_thc
    table
      .json('product_thc')
      .nullable()
      .alter();

    // product_cbd
    table
      .json('product_cbd')
      .nullable()
      .alter();

    // product_activity
    table
      .json('product_activity')
      .nullable()
      .alter();

    // product_effect
    table
      .json('product_effect')
      .nullable()
      .alter();

    // product_category
    table
      .integer('product_category')
      .nullable()
      .alter();
  });
};

exports.down = function(knex, Promise) {
  
};
