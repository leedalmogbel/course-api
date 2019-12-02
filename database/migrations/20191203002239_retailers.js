exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('retailers', function (table) {
        table.increments('retailer_id').unsigned().primary();
        table.string('retailer_manager', 255).notNull().collate('utf8_unicode_ci');
        table.string('retailer_buyername', 255).notNull().collate('utf8_unicode_ci');
        table.string('retailer_description', 255).notNull();
        table.string('retailer_license', 255).default('');
        table.string('retailer_contact_info', 255).default('');
        table.string('retailer_address_city', 255).default('');
        table.string('retailer_address_state', 255).default('');
        table.string('retailer_social_tag', 255).default('');
        table.float('retailer_rating').nullable();
        table.json('retailer_meta').nullable();
        table.integer('retailer_active').default(1);
        table.dateTime('retailer_created').notNull();
        table.dateTime('retailer_updated').notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('retailers');
};
