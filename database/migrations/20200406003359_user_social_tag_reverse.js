
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', (table) => {
    // user_social_tag
    table
      .string('user_social_tag', 255)
      .default('')
      .nullable()
      .alter();
  });
};

exports.down = function(knex, Promise) {
  
};
