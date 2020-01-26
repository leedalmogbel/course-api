
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('products', (table) => {
      // product_recommended
      table
        .integer('product_recommended')
        .nullable()
        .default(0)
        .after('product_featured')
        .alter();
    });
  
  };
  
  exports.down = function(knex, Promise) {
  };
  