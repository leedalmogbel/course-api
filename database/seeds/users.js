const md5 = require('md5');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users')
        .insert([
          {
            user_fullname: 'Admin',
            user_slug: 'admin@meta.com',
            user_password: md5('123'),
            user_facebook: '',
            user_type: 'admin',
            user_meta: null,
            user_active: 1,
            user_created: '2019-06-18 00:00:00',
            user_updated: '2019-06-18 00:00:00'
          },
          {
            user_fullname: 'Brand',
            user_slug: 'brand@meta.com',
            user_password: md5('123'),
            user_facebook: '',
            user_type: 'brand',
            user_meta: null,
            user_active: 1,
            user_created: '2019-06-18 00:00:00',
            user_updated: '2019-06-18 00:00:00'
          }
        ]);
  });
};
