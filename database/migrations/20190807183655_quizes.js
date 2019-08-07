exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('quizes', function (table) {
      table.increments('quiz_id').unsigned().primary();
      table.integer('quiz_course').notNull();
      table.string('quiz_question').default('');
      table.json('quiz_banner').nullable();
      table.string('quiz_correct_answer').default('');
      table.string('quiz_answer1').default('');
      table.string('quiz_answer2').default('');
      table.string('quiz_answer3').default('');
      table.integer('quiz_active').default(1);
      table.dateTime('quiz_created').notNull();
      table.dateTime('quiz_updated').notNull();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('quizes');
};
