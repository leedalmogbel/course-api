
exports.up = function(knex, Promise) {
  return knex.schema.hasTable('user_parent').then(function(exists) {
    if (exists) {
      return knex.schema
        .renameTable('user_parent', 'user_parents')
        .alterTable('user_parents', (table) => {
          table.renameColumn('user_active', 'user_parent_active')
          table.dateTime('user_parent_created').notNull();
          table.dateTime('user_parent_updated').notNull();
        });
    }
  });
};

exports.down = function(knex, Promise) {
  
};
