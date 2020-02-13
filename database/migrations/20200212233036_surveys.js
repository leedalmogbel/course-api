
exports.up = function (knex, Promise) {
  return knex.schema
    .createTable('surveies', function (table) {
        table.increments('survey_id').unsigned().primary();
        table.integer('survey_points').default(0);
        table.string('survey_title').default('');
        table.string('survey_description').default('');
        table.json('survey_image').nullable();
        table.string('survey_type').default('');
        table.integer('survey_active').default(1);
        table.dateTime('survey_created').notNull();
        table.dateTime('survey_updated').notNull();
    });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('surveies');
};
