
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('courses', function (table) {
      table.increments('course_id').unsigned().primary();
      table.integer('course_user').notNull();
      table.integer('course_category').nullable();
      table.string('course_title').default('');
      table.string('course_description').default('');
      table.json('course_image').nullable();
      table.string('course_video_path').default('');
      table.integer('course_active').default(1);
      table.dateTime('course_created').notNull();
      table.dateTime('course_updated').notNull();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('courses');
};
