
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('products', (table) => {
    // product_category
    table
      .string('product_category')
      .nullable()
      .after('product_user')
      .alter();
  });
};

exports.down = function(knex, Promise) {
  
};
