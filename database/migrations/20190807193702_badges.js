
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('badges', function (table) {
      table.increments('badge_id').unsigned().primary();
      table.integer('badge_user').notNull();
      table.string('badge_title').default('');
      table.string('badge_description').default('');
      table.json('badge_image').nullable();
      table.string('badge_minimum_experience').default('');
      table.integer('badge_active').default(1);
      table.dateTime('badge_created').notNull();
      table.dateTime('badge_updated').notNull();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('badges');
};
