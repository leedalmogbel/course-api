const express = require('express');
const router = express.Router();
const Episode = require('@module/Episode');

// set multer storage
const multer = require('multer');
const upload = multer({ storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/episodes'),
    filename: (req, file, cb) =>
      cb(null, Date.now() + '.' + file.originalname.split('.').pop())
  })
});

/**
 * GET: Search Episodes
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/search', async (req, res, next) => {
  // init query
  query = req.query || {};
  // wrap async
  try {
    // search Episodes model
    let model = Episode.Model
      .service()
      .searchEpisodes(query);

    // get episodes
    const episodes = await model.all();
    // get count
    const count = await model
      .searchEpisodes(query)
      .countDistinct('episode_id as total')
      .limit(0)
      .offset(0)
      .first();

    // total
    const total = count ? count.total : 0;

    // return response
    res.send({
      error: false,
      data: {
        rows: episodes,
        total
      }
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Create Episodes
 *
 * @param {string} path
 * @param {function} callback
 */
router.post('/create', upload.single('episode_image'), async (req, res, next) => {
  // wrap async
  try {
    // create new Episodes
    const episode = await Episode.Model
      .service()
      .createEpisodes(req.body, req.file);

    // log history
    await History.log('Created episode', req);

    // return response
    res.send({
      error: false,
      data: episode
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Update episode
 * 
 * @param {string} path
 * @param {function} callback
 */
router.post('/update', upload.single('episode_image'), async (req, res, next) => {
  // wrap async
  try {
    // update episode
    const episode = await Episode.Model
      .service()
      .updateEpisode(req.body, req.file);

    // return response
    res.send({
      error: false,
      data: episode
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET: Fetch Episode
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/detail/:episode_id', async (req, res, next) => {
  // set episode id
  const episodeId = parseInt(req.params.episode_id);

  // wrap async
  try {
    if (!('episode_id' in req.params)) {
      throw new Error('Invalid episode id');
    }

    // get episode by episode id
    const episode = await Episode.Model
      .service()
      .getEpisodeById(episodeId);

    // return response
    res.send({
      error: false,
      data: episode
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: episode remove
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/remove/:episode_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('episode_id' in req.params)) {
      throw new Error('Invalid episode id');
    }

    // set episode id
    const episodeId = parseInt(req.params.episode_id);

    // get episode
    const episode = await Episode.Model
      .service()
      .remove(episodeId);

    // return response
    res.send({
      error: false,
      data: episode
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: episode restore
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/restore/:episode_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('episode_id' in req.params)) {
      throw new Error('Invalid episode id');
    }

    // set episode id
    const episodeId = parseInt(req.params.episode_id);
    // get episode
    const episode = await Episode.Model
      .service()
      .restore(episodeId);

    // log history
    await History.log('Restored Episode', req);

    // return response
    res.send({
      error: false,
      data: episode
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;