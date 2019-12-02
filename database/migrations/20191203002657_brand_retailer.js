
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('brand_retailer', function (table) {
        table.increments('brand_retailer_id').unsigned().primary();
        table.integer('brand_id').notNull();
        table.integer('retailer_id').notNull();
        table.integer('brand_retailer_active').default(1);
        table.dateTime('brand_retailer_created').notNull();
        table.dateTime('brand_retailer_updated').notNull();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('brand_retailer');
};
