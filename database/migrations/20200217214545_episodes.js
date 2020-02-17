
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('episodes', function (table) {
        table.increments('episode_id').unsigned().primary();
        table.integer('episode_course').default(0);
        table.string('episode_title').default('');
        table.string('episode_description').default('');
        table.json('episode_path').nullable();
        table.json('episode_meta').nullable();
        table.integer('episode_active').default(1);
        table.dateTime('episode_created').notNull();
        table.dateTime('episode_updated').notNull();
    });
};

exports.down = function(knex, Promise) {
  
};
