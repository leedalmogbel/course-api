const express  = require('express');
const router   = express.Router();
const User     = require('@module/User');
const History  = require('@module/Util/History');

// set multer storage
const multer = require('multer');
const upload = multer({ storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/stores'),
    filename: (req, file, cb) =>
      cb(null, Date.now() + '.' + file.originalname.split('.').pop())
  })
});

// Search page
router.get('/search', async function(req, res, next) {
  // init query
  const query = req.query || {};

  // wrap async
  try {
    // search users model
    const model = User.Model
      .service()
      .searchUsers(query);

    // get users
    const users = await model.all();

    const count = await model
      .searchUsers(query)
      .countDistinct('user_id as total')
      .limit(0)
      .offset(0)
      .first();

    // total
    const total = count ? count.total : 0;

    // send data to api side
    res.send({
      error: false,
      results:users,
      total
      
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET: Fetch user
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/detail/:user_id', async (req, res, next) => {
  // set user id
  const userId = parseInt(req.params.user_id);

  // wrap async
  try {
    if (!('user_id' in req.params)) {
      throw new Error('Invalid user id');
    }

    // get user by user id
    const user = await User.Model
      .service()
      .getUserById(userId);

    delete user.user_password;
   
    // return response
    res.send({
      error: false,
      data: {...user}
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Create user
 *
 * @param {string} path
 * @param {function} callback
 */
router.post('/create', upload.single('store_image'), async (req, res, next) => {
  // wrap async
  try {
    // create new user
    const user = await User.Model
      .service()
      .createUser(req.body, req.file);

    // log history
    await History.log('Created User', req);

    // return response
    res.send({
      error: false,
      data: user
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Update user
 * 
 * @param {string} path
 * @param {function} callback
 */
router.post('/update', upload.single('store_image'), async (req, res, next) => {
  // wrap async
  try {
    // update user
    const user = await User.Model
      .service()
      .updateUser(req.body);
    

    // log history
    await History.log('Updated User', req);

    // return response
    res.send({
      error: false,
      data: {...user}
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET: user remove
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/remove/:user_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('user_id' in req.params)) {
      throw new Error('Invalid user id');
    }

    // set user id
    const userId = parseInt(req.params.user_id);

    // get categories
    const user = await User.Model
      .service()
      .remove(userId);

    // log history
    await History.log('Removed User', req);

    // return response
    res.send({
      error: false,
      data: user
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: user restore
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/restore/:user_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('user_id' in req.params)) {
      throw new Error('Invalid user id');
    }

    // set user id
    const userId = parseInt(req.params.user_id);
    // get categories
    const user = await User.Model
      .service()
      .restore(userId);

    // log history
    await History.log('Restored User', req);

    // return response
    res.send({
      error: false,
      data: user
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST users bulk remove
 */
router.post('/bulk/remove', async (req, res, next) => {
  try {
    // get categories
    const user = await User.Model
      .service()
      .remove(req.body.user_ids);

    // log history
    await History.log('Bulk Removed User', req);

    // return response
    res.send({
      error: false,
      data: user
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST users bulk restore
 */
router.post('/bulk/restore', async (req, res, next) => {
  try {
    // get categories
    const user = await User.Model
      .service()
      .restore(req.body.user_ids);

    // log history
    await History.log('Bulk Restored User', req);

    // return response
    res.send({
      error: false,
      data: user
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;