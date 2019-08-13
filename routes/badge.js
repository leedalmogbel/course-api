const express = require('express');
const router = express.Router();
const Badge = require('@module/Badge');
const History  = require('@module/Util/History');

// set multer storage
const multer = require('multer');
const upload = multer({ storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/badges'),
    filename: (req, file, cb) =>
      cb(null, Date.now() + '.' + file.originalname.split('.').pop())
  })
});

/**
 * GET: Search Badges
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/search', async (req, res, next) => {
  // init query
  query = req.query || {};
  // wrap async
  try {
    // search badges model
    let model = Badge.Model
      .service()
      .searchBadges(query);

    // get Badges
    const badges = await model.all();
    // get count
    const count = await model
      .searchBadges(query)
      .countDistinct('badge_id as total')
      .limit(0)
      .offset(0)
      .first();

    // total
    const total = count ? count.total : 0;

    // return response
    res.send({
      error: false,
      data: {
        rows: badges,
        total
      }
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Create Badge
 *
 * @param {string} path
 * @param {function} callback
 */
router.post('/create', upload.single('badge_image'), async (req, res, next) => {
  // wrap async
  try {
    // create new Badge
    const badge = await Badge.Model
      .service()
      .createBadge(req.body, req.file);

    // log history
    await History.log('Created Badge', req);

    // return response
    res.send({
      error: false,
      data: badge
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Update Badge
 * 
 * @param {string} path
 * @param {function} callback
 */
router.post('/update', upload.single('badge_image'), async (req, res, next) => {
  // wrap async
  try {
    // update badge
    const badge = await Badge.Model
      .service()
      .updateBadge(req.body, req.file);

    // log history
    await History.log('Updated Badge', req);

    // return response
    res.send({
      error: false,
      data: badge
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET: Fetch Badge
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/detail/:badge_id', async (req, res, next) => {
  // set badge id
  const badgeId = parseInt(req.params.badge_id);

  // wrap async
  try {
    if (!('badge_id' in req.params)) {
      throw new Error('Invalid badge id');
    }

    // get badge by badge id
    const badge = await Badge.Model
      .service()
      .getBadgeById(badgeId);

    // return response
    res.send({
      error: false,
      data: badge
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: badge remove
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/remove/:badge_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('badge_id' in req.params)) {
      throw new Error('Invalid badge id');
    }

    // set brad id
    const badgeId = parseInt(req.params.badge_id);

    // get badge
    const badge = await Badge.Model
      .service()
      .remove(badgeId);

    // log history
    await History.log('Removed Badge', req);

    // return response
    res.send({
      error: false,
      data: badge
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: badge restore
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/restore/:badge_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('badge_id' in req.params)) {
      throw new Error('Invalid badge id');
    }

    // set badge id
    const badgeId = parseInt(req.params.badge_id);
    // get badge
    const badge = await Badge.Model
      .service()
      .restore(badgeId);

    // log history
    await History.log('Restored Badge', req);

    // return response
    res.send({
      error: false,
      data: badge
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST badge bulk remove
 */
router.post('/bulk/remove', async (req, res, next) => {
  try {
    // get badges
    const badge = await Badge.Model
      .service()
      .remove(req.body.badge_ids);

    // log history
    await History.log('Bulk Removed Badge', req);

    // return response
    res.send({
      error: false,
      data: badge
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST badge bulk restore
 */
router.post('/bulk/restore', async (req, res, next) => {
  try {
    // get badges
    const badge = await Badge.Model
      .service()
      .restore(req.body.badge_ids);

    // log history
    await History.log('Bulk Restored Badge', req);

    // return response
    res.send({
      error: false,
      data: badge
    });
  } catch (e) {
    next(e);
  }
});


module.exports = router;