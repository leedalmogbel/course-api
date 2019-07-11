exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', function (table) {
        table.increments('user_id').unsigned().primary();
        table.string('user_firstname', 255).notNull().collate('utf8_unicode_ci');
        table.string('user_lastname', 255).notNull().collate('utf8_unicode_ci');
        table.string('user_slug', 255).notNull().collate('utf8_unicode_ci');
        table.string('user_password', 255).notNull();
        table.string('user_facebook', 255).default('');
        table.string('user_type', 255).notNull().collate('utf8_unicode_ci');
        table.json('user_meta').nullable();
        table.integer('user_active').default(1);
        table.dateTime('user_created').notNull();
        table.dateTime('user_updated').notNull();

        // indexes
        table.index(['user_slug']);
        table.index(['user_lastname']);
        table.index(['user_firstname']);
        table.index(['user_active']);
        table.index(['user_created']);
        table.index(['user_updated']);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
