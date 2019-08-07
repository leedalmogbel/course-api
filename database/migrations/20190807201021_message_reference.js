
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('references', function (table) {
      table.increments('reference_id').unsigned().primary();
      table.integer('reference_message').notNull();
      table.integer('reference_from').notNull();
      table.integer('reference_to').notNull();
      table.integer('reference_active').default(1);
      table.dateTime('reference_created').notNull();
      table.dateTime('reference_updated').notNull();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('references');
};
