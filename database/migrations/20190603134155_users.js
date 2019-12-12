exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', function (table) {
        table.increments('user_id').unsigned().primary();
        table.string('user_fullname', 255).notNull().collate('utf8_unicode_ci');
        table.string('user_slug', 255).notNull().collate('utf8_unicode_ci');
        table.string('user_password', 255).notNull();
        table.string('user_facebook', 255).default('');
        table.string('user_google', 255).default('');
        table.string('user_brand_name', 255).default('');
        table.string('user_manager_name', 255).default('');
        table.string('user_buyer_name', 255).default('');
        table.string('user_contact_info', 255).default('');
        table.string('user_address_city', 255).default('');
        table.string('user_address_state', 255).default('');
        table.string('user_social_tag', 255).default('');
        table.string('user_type', 255).notNull().collate('utf8_unicode_ci');
        table.json('user_meta').nullable();
        table.json('user_brand').nullable();
        table.json('user_retailer').nullable();
        table.json('user_budtender').nullable();
        table.json('user_consumer').nullable();
        table.integer('user_active').default(1);
        table.dateTime('user_created').notNull();
        table.dateTime('user_updated').notNull();

        // indexes
        table.index(['user_slug']);
        table.index(['user_fullname']);
        table.index(['user_active']);
        table.index(['user_created']);
        table.index(['user_updated']);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
