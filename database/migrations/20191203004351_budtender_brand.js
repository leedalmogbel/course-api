
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('buntender_brand', function (table) {
        table.increments('buntender_brand_id').unsigned().primary();
        table.integer('budtender_id').notNull();
        table.integer('brand_id').notNull();
        table.integer('buntender_brand_active').default(1);
        table.dateTime('buntender_brand_created').notNull();
        table.dateTime('buntender_brand_updated').notNull();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('buntender_brand');
};
