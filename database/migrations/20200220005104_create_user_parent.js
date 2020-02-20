
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('user_parent', function (table) {
        table.integer('user_id').notNullable();
        table.integer('parent_id').notNullable();
        table.integer('user_active').default(0);
    });
};

exports.down = function(knex, Promise) {
  
};
