
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('products', (table) => {
    // product_flavor
    table
      .json('product_flavor')
      .nullable()
      .alter();
  });
};

exports.down = function(knex, Promise) {
  
};
