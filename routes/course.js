const express = require('express');
const router = express.Router();
const Course = require('@module/Course');
const Episode = require('@module/Episode');

// set multer storage
const multer = require('multer');
const upload = multer({ storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/courses'),
    filename: (req, file, cb) =>
      cb(null, Date.now() + '.' + file.originalname.split('.').pop())
  })
});

/**
 * GET: Search Courses
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/search', async (req, res, next) => {
  // init query
  query = req.query || {};
  // wrap async
  try {
    // search courses model
    let model = Course.Model
      .service()
      .searchCourses(query);

    // get courses
    const courses = await model.all();
    // get count
    const count = await model
      .searchCourses(query)
      .countDistinct('course_id as total')
      .limit(0)
      .offset(0)
      .first();

    // total
    const total = count ? count.total : 0;

    // return response
    res.send({
      error: false,
      data: {
        rows: courses,
        total
      }
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Create courses
 *
 * @param {string} path
 * @param {function} callback
 */
router.post('/create', upload.single('course_image'), async (req, res, next) => {
  // wrap async
  try {
    // create new courses
    let course = await Course.Model
      .service()
      .createCourse(req.body, req.file);

    if ('episode_title' in course) {
      course = {
        ...course,
        episode_course: course.course_id,
      }

      await Episode.Model
        .service()
        .createEpisode(course, null);
    }
    // log history
    // await History.log('Created course', req);

    // return response
    res.send({
      error: false,
      data: course
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Update Course
 * 
 * @param {string} path
 * @param {function} callback
 */
router.post('/update', upload.single('course_image'), async (req, res, next) => {
  // wrap async
  try {
    // update course
    const course = await Course.Model
      .service()
      .updateCourse(req.body, req.file);

    // log history
    await History.log('Updated Course', req);

    // return response
    res.send({
      error: false,
      data: course
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET: Fetch Course
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/detail/:course_id', async (req, res, next) => {
  // set course id
  const courseId = parseInt(req.params.course_id);

  // wrap async
  try {
    if (!('course_id' in req.params)) {
      throw new Error('Invalid course id');
    }

    // get course by course id
    const course = await Course.Model
      .service()
      .getCourseById(courseId);

    // return response
    res.send({
      error: false,
      data: course
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: course remove
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/remove/:course_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('course_id' in req.params)) {
      throw new Error('Invalid course id');
    }

    // set brad id
    const courseId = parseInt(req.params.course_id);

    // get course
    const course = await Course.Model
      .service()
      .remove(courseId);

    // log history
    await History.log('Removed Course', req);

    // return response
    res.send({
      error: false,
      data: course
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: course restore
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/restore/:course_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('course_id' in req.params)) {
      throw new Error('Invalid course id');
    }

    // set course id
    const courseId = parseInt(req.params.course_id);
    // get course
    const course = await Course.Model
      .service()
      .restore(courseId);

    // log history
    await History.log('Restored Course', req);

    // return response
    res.send({
      error: false,
      data: course
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST course bulk remove
 */
router.post('/bulk/remove', async (req, res, next) => {
  try {
    // get courses
    const course = await Course.Model
      .service()
      .remove(req.body.course_ids);

    // log history
    await History.log('Bulk Removed Course', req);

    // return response
    res.send({
      error: false,
      data: course
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST course bulk restore
 */
router.post('/bulk/restore', async (req, res, next) => {
  try {
    // get courses
    const course = await Course.Model
      .service()
      .restore(req.body.course_ids);

    // log history
    await History.log('Bulk Restored Course', req);

    // return response
    res.send({
      error: false,
      data: course
    });
  } catch (e) {
    next(e);
  }
});


module.exports = router;