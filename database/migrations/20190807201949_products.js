
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('products', function (table) {
      table.increments('product_id').unsigned().primary();
      table.integer('product_user').notNull();
      table.integer('product_category').notNull();
      table.string('product_title').default('');
      table.string('product_description').default('');
      table.json('product_images').nullable();
      table.float('product_price').nullable();
      table.float('product_weight').nullable();
      table.float('product_thc').nullable();
      table.float('product_cbd').nullable();
      table.string('product_effect').default('');
      table.integer('product_active').default(1);
      table.dateTime('product_created').notNull();
      table.dateTime('product_updated').notNull();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('products');
};
