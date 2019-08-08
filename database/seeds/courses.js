exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('courses').del()
    .then(function () {
      // Inserts seed entries
      return knex('courses')
        .insert([
          {
            course_user: 1,
            course_category: 1,
            course_title: 'meta cana',
            course_description: 'canabis 101',
            course_image: null,
            course_video_path: '',
            course_active: 1,
            course_created: '2019-06-18 00:00:00',
            course_updated: '2019-06-18 00:00:00'
          },
          {
            course_user: 1,
            course_category: 1,
            course_title: 'test cana',
            course_description: 'canabis 201',
            course_image: null,
            course_video_path: '',
            course_active: 1,
            course_created: '2019-06-18 00:00:00',
            course_updated: '2019-06-18 00:00:00'
          }
        ], ['id'])
  });
};
