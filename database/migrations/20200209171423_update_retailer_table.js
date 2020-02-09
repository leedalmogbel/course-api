
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('retailers', (table) => {
    // retailer_title
    table
      .string('retailer_title', 255)
      .nullable()
      .after('retailer_id');
  });
};

exports.down = function(knex, Promise) {
  
};
