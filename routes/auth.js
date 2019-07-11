const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('@module/User');
const settings = require('@config/settings');
const History = require('@module/Util/History');

/**
 * POST Admin Login
 */
router.post('/admin/login', async (req, res, next) => {
  let token = '';
  // wrap async
  try {
    // login user
    const auth = await User.Model
      .service()
      .loginUser(req.body, 'admin');

    // token payload
    const payload = {
      user_id: auth.user_id,
      user_firstname: auth.user_firstname,
      user_lastname: auth.user_lastname,
      user_slug: auth.user_slug,
    };

    // create token
    token = jwt.sign(payload, settings.secret, { expiresIn: '24h' });

    // remove user id from payload
    delete payload.user_id;

    // return response
    res.send({
      error: false,
      data: { token, user: payload }
    });
  } catch (e) {
    next(e);
  }

  // log history
  await History.log('Logged as Admin', req);
});

/**
 * POST Admin Login
 */
router.post('/merchant/login', async (req, res, next) => {
  // wrap async
  try {
    // login user
    const auth = await User.Model
      .service()
      .loginUser(req.body, 'merchant');

    // token payload
    const payload = {
      user_id: auth.user_id,
      user_firstname: auth.user_firstname,
      user_lastname: auth.user_lastname,
      user_slug: auth.user_slug,
      store_id: auth.store_id,
      store_name: auth.store_name
    };

    // create token
    const token = jwt.sign(payload, settings.secret, { expiresIn: '24h' });

    // return response
    res.send({
      error: false,
      data: { token, user: payload }
    });
  } catch (e) {
    next(e);
  }

  // log history
  await History.log('Logged as Merchant', req);
});

module.exports = router;
