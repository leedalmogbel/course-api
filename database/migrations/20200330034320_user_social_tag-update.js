
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', (table) => {
    // user_social_tag
    table
      .json('user_social_tag')
      .nullable()
      .alter();
  });
};

exports.down = function(knex, Promise) {
  
};
