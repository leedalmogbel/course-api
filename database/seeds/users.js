const md5 = require('md5');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users')
        .insert([
          {
            user_firstname: 'User',
            user_lastname: 'Admin',
            user_slug: 'joe@doe.com',
            user_password: md5('123'),
            user_facebook: '',
            user_type: 'user',
            user_meta: null,
            user_active: 1,
            user_created: '2019-06-18 00:00:00',
            user_updated: '2019-06-18 00:00:00'
          },
          {
            user_firstname: 'Super',
            user_lastname: 'Admin',
            user_slug: 'john@doe.com',
            user_password: md5('123'),
            user_facebook: '',
            user_type: 'admin',
            user_meta: null,
            user_active: 1,
            user_created: '2019-06-18 00:00:00',
            user_updated: '2019-06-18 00:00:00'
          }
        ], ['id']).then(function (id) {
          return knex('stores').del()
            .then(function () {
              return knex('stores').insert([
                {
                  store_name: 'Ninja Store',
                  store_user: id[0],
                  store_active: 1,
                  store_created: '2019-06-18 00:00:00',
                  store_updated: '2019-06-18 00:00:00'
                }
              ])
            })
        });
  });
};
