const express = require('express');
const router = express.Router();
const Quiz = require('@module/Quiz');
const History  = require('@module/Util/History');

// set multer storage
const multer = require('multer');
const upload = multer({ storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/quizes'),
    filename: (req, file, cb) =>
      cb(null, Date.now() + '.' + file.originalname.split('.').pop())
  })
});

/**
 * GET: Search Quizes
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/search', async (req, res, next) => {
  // init query
  query = req.query || {};
  // wrap async
  try {
    // search quizes model
    let model = Quiz.Model
      .service()
      .searchQuizes(query);

    // get quizes
    const quizes = await model.all();
    // get count
    const count = await model
      .searchQuizes(query)
      .countDistinct('quiz_id as total')
      .limit(0)
      .offset(0)
      .first();

    // total
    const total = count ? count.total : 0;

    // return response
    res.send({
      error: false,
      data: {
        rows: quizes,
        total
      }
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Create Quiz
 *
 * @param {string} path
 * @param {function} callback
 */
router.post('/create', upload.single('quiz_banner'), async (req, res, next) => {
  // wrap async
  try {
    // create new Quiz
    const quiz = await Quiz.Model
      .service()
      .createQuiz(req.body, req.file);

    // log history
    await History.log('Created Quiz', req);

    // return response
    res.send({
      error: false,
      data: quiz
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Update Quiz
 * 
 * @param {string} path
 * @param {function} callback
 */
router.post('/update', upload.single('quiz_banner'), async (req, res, next) => {
  // wrap async
  try {
    // update quiz
    const quiz = await Quiz.Model
      .service()
      .updateQuiz(req.body, req.file);

    // log history
    await History.log('Updated Quiz', req);

    // return response
    res.send({
      error: false,
      data: quiz
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET: Fetch Quiz
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/detail/:quiz_id', async (req, res, next) => {
  // set quiz id
  const quizId = parseInt(req.params.quiz_id);

  // wrap async
  try {
    if (!('quiz_id' in req.params)) {
      throw new Error('Invalid quiz id');
    }

    // get quiz by quiz id
    const quiz = await Quiz.Model
      .service()
      .getQuizById(quizId);

    // return response
    res.send({
      error: false,
      data: quiz
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: quiz remove
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/remove/:quiz_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('quiz_id' in req.params)) {
      throw new Error('Invalid quiz id');
    }

    // set brad id
    const quizId = parseInt(req.params.quiz_id);

    // get quiz
    const quiz = await Quiz.Model
      .service()
      .remove(quizId);

    // log history
    await History.log('Removed Quiz', req);

    // return response
    res.send({
      error: false,
      data: quiz
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: quiz restore
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/restore/:quiz_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('quiz_id' in req.params)) {
      throw new Error('Invalid quiz id');
    }

    // set quiz id
    const quizId = parseInt(req.params.quiz_id);
    // get quiz
    const quiz = await Quiz.Model
      .service()
      .restore(quizId);

    // log history
    await History.log('Restored Quiz', req);

    // return response
    res.send({
      error: false,
      data: quiz
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST quiz bulk remove
 */
router.post('/bulk/remove', async (req, res, next) => {
  try {
    // get quizes
    const quiz = await Quiz.Model
      .service()
      .remove(req.body.quiz_ids);

    // log history
    await History.log('Bulk Removed Quiz', req);

    // return response
    res.send({
      error: false,
      data: quiz
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST quiz bulk restore
 */
router.post('/bulk/restore', async (req, res, next) => {
  try {
    // get quizes
    const quiz = await Quiz.Model
      .service()
      .restore(req.body.quiz_ids);

    // log history
    await History.log('Bulk Restored Quiz', req);

    // return response
    res.send({
      error: false,
      data: quiz
    });
  } catch (e) {
    next(e);
  }
});


module.exports = router;