
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', (table) => {
    // user_bio
    table
      .string('user_bio', 255)
      .nullable()
      .after('user_buyer_name');

    // user_license_info
    table
      .string('user_license_info', 255)
      .nullable()
      .after('user_bio');
  });
};

exports.down = function(knex, Promise) {
  
};
