const express     = require('express');
const router      = express.Router();
const User        = require('@module/User');
const User_parent = require('@module/User_parent');
const History     = require('@module/Util/History');

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

router.post('/check/email', async (req, res, next) => {
  // set user slug

  const user_slug = req.body.user_slug;
  let exists = {};

  try {
    exists = await User.Model
      .service().checkEmail(user_slug);

    // throw error if email already exists
    if (Object.keys(exists).length > 0) {
      // return response
      res.send({
        error: true,
        message: 'Invalid Request.',
        validation: { user_slug: 'Email already exists' }
      });
    }

    // return response
    res.send({
      error: false,
      data: exists
    });
  } catch (e) {
    res.send({
      error: true,
      message: e.message,
      validation: e.validation
    });
  }

  return exists;
});

/**
 * POST: Create user
 *
 * @param {string} path
 * @param {function} callback
 */
router.post('/create', async (req, res, next) => {

  let errors = User.Model
    .service().getCreateErrors(req.body);

  // has errors?
  if (Object.keys(errors).length) {
    return res.send({
      error: true,
      message: 'Invalid Request',
      validation: errors
    });
  }

  // wrap async
  try {
    // create new user
    const user = await User.Model
      .service()
      .createUser(req.body);

    // log history
    // await History.log('Created User', req);

    // return response
    res.send({
      error: false,
      data: user
    });
  } catch (e) {
    res.send({
      error: true,
      message: e.message,
      validation: e.validation
    });
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
    // await History.log('Updated User', req);

    // return response
    res.send({
      error: false,
      // data: {...user}
      data: req.body
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
    // await History.log('Removed User', req);

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
    // await History.log('Restored User', req);

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
    // await History.log('Bulk Removed User', req);

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
    // await History.log('Bulk Restored User', req);

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
 * POST users invite
 */
router.post('/invite', async (req, res, next) => {
  // wrap async
  try {
    // check email
    if (!('user_slug' in req.body)) {
      throw new Error('Email is required');
    }

    // get invitee info
    const invitee = await User.Model
      .service()
      .checkEmailExists(req.body.user_slug);

    // get inviter info
    const user = await User.Model
      .service()
      .getUserDetail(req.body.parent_id);

    // compare user_type:
    // if user = , parent must be brand
    // if user = retailer, parent must be budtender
    if (
      (user.user_type !== 'brand'
      && user.user_type !== 'retailer'
      && invitee.user_type !== 'retailer'
      && invitee.user_type !== 'budtender')
      || (invitee.user_type === 'retailer' && user.user_type !== 'brand')
      || (invitee.user_type === 'budtender' && user.user_type !== 'retailer')
      || (invitee.user_type !== 'retailer' && user.user_type === 'brand')
      || (invitee.user_type !== 'budtender' && user.user_type === 'retailer')
    ) {
      // return response
      return res.send({
        error: true,
        message: "User is not permitted to do this action"
      });
    }

    // prepare data to be inserted
    let data = {
      user_id: invitee.user_id,
      parent_id: user.user_id,
    }

    // create new entry to user_parent
    // user_id = invitee, parent_id = inviter
    const user_parent = await User_parent.Model
      .service()
      .inviteUser(data);

    // log history
    // await History.log('Invite User', req);

    // return response
    res.send({
      error: false,
      data: user_parent
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST users accept
 */
router.post('/accept', async (req, res, next) => {
  // wrap async
  try {
    // get invitee info
    const invitee = await User.Model
      .service()
      .checkEmailExists(req.body.user_slug);

    console.log('invitee: ', invitee)

    // get inviter info
    const user = await User.Model
      .service()
      .getUserDetail(req.body.parent_id);

    // compare user_type:
    // if user = , parent must be brand
    // if user = retailer, parent must be budtender

    // if accepted, update user_parent_flag into 1

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
 * POST users decline
 */
router.post('/decline', async (req, res, next) => {
  // wrap async
  try {
    // get invitee info
    const invitee = await User.Model
      .service()
      .checkEmailExists(req.body.user_slug);

    console.log('invitee: ', invitee)

    // get inviter info
    const user = await User.Model
      .service()
      .getUserDetail(req.body.parent_id);

    // compare user_type:
    // if user = , parent must be brand
    // if user = retailer, parent must be budtender

    // if declined, delete user_parent entry

    // log history
    // await History.log('Removed User', req);

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