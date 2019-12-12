exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('brands', function (table) {
        table.increments('brand_id').unsigned().primary();
        table.string('brand_fullname', 255).notNull().collate('utf8_unicode_ci');
        table.string('brand_manager', 255).notNull().collate('utf8_unicode_ci');
        table.string('brand_description', 255).notNull();
        table.string('brand_license', 255).default('');
        table.string('brand_contact_info', 255).default('');
        table.string('brand_address_city', 255).default('');
        table.string('brand_address_state', 255).default('');
        table.string('brand_social_tag', 255).default('');
        table.json('brand_meta').nullable();
        table.integer('brand_active').default(1);
        table.dateTime('brand_created').notNull();
        table.dateTime('brand_updated').notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('brands');
};
