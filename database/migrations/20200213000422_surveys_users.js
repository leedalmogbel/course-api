
exports.up = function (knex, Promise) {
  return knex.schema
    .createTable('surveys_users', function (table) {
        table.increments('survey_users_id').unsigned().primary();
        table.integer('survey_id').notNull();
        table.integer('user_id').notNull();
        table.dateTime('survey_users_created').notNull();
        table.dateTime('survey_users_updated').notNull();
    });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('surveys_users');
};
