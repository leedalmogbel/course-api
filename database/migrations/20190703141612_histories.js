exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('histories', function (table) {
        table.increments('history_id').unsigned().primary();
        table.string('history_log').default('');
        table.string('history_remote_ip').default('');
        table.integer('history_user').nullable();
        table.json('history_meta').nullable();
        table.integer('history_active').default(1);
        table.dateTime('history_created').notNull();
        table.dateTime('history_updated').notNull();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('histories');
};