exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('budtenders', function (table) {
        table.increments('budtender_id').unsigned().primary();
        table.string('budtender_name', 255).notNull().collate('utf8_unicode_ci');
        table.string('budtender_description', 255).notNull();
        table.string('budtender_dob', 255).default('');
        table.string('budtender_retailer', 255).default('');
        table.string('budtender_contact_info', 255).default('');
        table.string('budtender_address_city', 255).default('');
        table.string('budtender_address_state', 255).default('');
        table.string('budtender_social_tag', 255).default('');
        table.float('budtender_rating').nullable();
        table.json('budtender_meta').nullable();
        table.integer('budtender_active').default(1);
        table.dateTime('budtender_created').notNull();
        table.dateTime('budtender_updated').notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('budtenders');
};
