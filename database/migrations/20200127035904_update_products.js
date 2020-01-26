
exports.up = function(knex, Promise) {
return knex.schema.alterTable('products', (table) => {
    // product_thc
    table
      .float('product_thc')
      .nullable()
      .alter();

    // product_cbd
    table
      .float('product_cbd')
      .nullable()
      .alter();

    // product_discount
    table
      .float('product_discount')
      .nullable()
      .after('product_price');

    // product_featured
    table
      .integer('product_featured')
      .nullable()
      .default(0)
      .after('product_activity');

    // product_recommended
    table
      .integer('product_recommended')
      .nullable()
      .default(0)
      .after('product_featured');
  });

};

exports.down = function(knex, Promise) {
};
