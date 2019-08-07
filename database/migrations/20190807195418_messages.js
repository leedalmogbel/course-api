exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('messages', function (table) {
      table.increments('message_id').unsigned().primary();
      table.string('message_content').default('');
      table.string('message_status').default('unread');
      table.integer('message_active').default(1);
      table.dateTime('message_created').notNull();
      table.dateTime('message_updated').notNull();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages');
};
