
exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('posts', function (table) {
            table.increments('post_id').unsigned().primary();
            table.string('post_title').default('');
            table.string('post_description').default('');
            table.json('post_image').nullable();
            table.string('post_type').default('');
            table.integer('post_active').default(1);
            table.dateTime('post_created').notNull();
            table.dateTime('post_updated').notNull();
        });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('posts');
};
