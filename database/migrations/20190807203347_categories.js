
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('categories', function (table) {
      table.increments('category_id').unsigned().primary();
      table.string('category_title').default('');
      table.string('category_description').default('');
      table.string('category_type').default('');
      table.integer('category_active').default(1);
      table.dateTime('category_created').notNull();
      table.dateTime('category_updated').notNull();
    });
};

exports.down = function(knex, Promise) {
  
};
