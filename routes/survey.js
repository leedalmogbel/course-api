const express = require('express');
const router = express.Router();
const Survey = require('@module/Survey');

// set multer storage
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/surveys'),
    filename: (req, file, cb) =>
      cb(null, Date.now() + '.' + file.originalname.split('.').pop())
  })
});

/**
 * GET: Search Surveys
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/search', async (req, res, next) => {
  // init query
  query = req.query || {};

  // wrap async
  try {
    // search surveys model
    let model = Survey.Model
      .service()
      .searchSurveys(query);

    // get surveys
    const surveys = await model.all();
    // get count
    const count = await model
      .searchSurveys(query)
      .countDistinct('survey_id as total')
      .limit(0)
      .offset(0)
      .first();

    // total
    const total = count ? count.total : 0;

    // send data to api side
    res.send({
      error: false,
      results: surveys,
      total

    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Create surveys
 *
 * @param {string} path
 * @param {function} callback
 */
router.post('/create', upload.single('survey_image'), async (req, res, next) => {
  // wrap async
  try {
    // create new surveys
    const survey = await Survey.Model
      .service()
      .createSurvey(req.body, req.file);

    // return response
    res.send({
      error: false,
      data: survey
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Update survey
 * 
 * @param {string} path
 * @param {function} callback
 */
router.post('/update', upload.single('survey_image'), async (req, res, next) => {
  // wrap async
  try {
    // update survey
    const survey = await Survey.Model
      .service()
      .updateSurvey(req.body, req.file);

    // return response
    res.send({
      error: false,
      data: survey
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET: Fetch Survey
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/detail/:survey_id', async (req, res, next) => {
  // set survey id
  const surveyId = parseInt(req.params.survey_id);

  // wrap async
  try {
    if (!('survey_id' in req.params)) {
      throw new Error('Invalid survey id');
    }

    // get survey by survey id
    const survey = await Survey.Model
      .service()
      .getSurveyById(surveyId);

    // return response
    res.send({
      error: false,
      data: survey
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: survey remove
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/remove/:survey_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('survey_id' in req.params)) {
      throw new Error('Invalid survey id');
    }

    // set survey id
    const surveyId = parseInt(req.params.survey_id);

    // get survey
    const survey = await Survey.Model
      .service()
      .remove(surveyId);

    // return response
    res.send({
      error: false,
      data: survey
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: survey restore
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/restore/:survey_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('survey_id' in req.params)) {
      throw new Error('Invalid survey id');
    }

    // set survey id
    const surveyId = parseInt(req.params.survey_id);
    // get survey
    const survey = await Survey.Model
      .service()
      .restore(surveyId);

    // return response
    res.send({
      error: false,
      data: survey
    });
  } catch (e) {
    next(e);
  }
});


module.exports = router;