const express = require('express');
const router = express.Router();
const Message = require('@module/Message');
const History  = require('@module/Util/History');

/**
 * GET: Search Messages
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/search', async (req, res, next) => {
  // init query
  query = req.query || {};
  // wrap async
  try {
    // search Messages model
    let model = Message.Model
      .service()
      .searchMessages(query);

    // get Messages
    const messages = await model.all();
    // get count
    const count = await model
      .searchMessages(query)
      .countDistinct('message_id as total')
      .limit(0)
      .offset(0)
      .first();

    // total
    const total = count ? count.total : 0;

    // return response
    res.send({
      error: false,
      data: {
        rows: messages,
        total
      }
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Create Message
 *
 * @param {string} path
 * @param {function} callback
 */
router.post('/create', async (req, res, next) => {
  // wrap async
  try {
    // create new Mesaage
    const message = await Message.Model
      .service()
      .createMessage(req.body);

    // log history
    await History.log('Created Message', req);

    // return response
    res.send({
      error: false,
      data: message
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Update message
 * 
 * @param {string} path
 * @param {function} callback
 */
router.post('/update', async (req, res, next) => {
  // wrap async
  try {
    // update message
    const message = await Message.Model
      .service()
      .updateMessage(req.body, req.file);

    // log history
    await History.log('Updated Message', req);

    // return response
    res.send({
      error: false,
      data: message
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET: Fetch MEssage
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/detail/:message_id', async (req, res, next) => {
  // set message id
  const messageId = parseInt(req.params.message_id);

  // wrap async
  try {
    if (!('message_id' in req.params)) {
      throw new Error('Invalid message id');
    }

    // get message by message id
    const message = await Message.Model
      .service()
      .getMessageById(messageId);

    // return response
    res.send({
      error: false,
      data: message
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: message remove
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/remove/:message_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('message_id' in req.params)) {
      throw new Error('Invalid message id');
    }

    // set brad id
    const messageId = parseInt(req.params.message_id);

    // get message
    const message = await Message.Model
      .service()
      .remove(messageId);

    // log history
    await History.log('Removed Message', req);

    // return response
    res.send({
      error: false,
      data: message
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: message restore
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/restore/:message_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('message_id' in req.params)) {
      throw new Error('Invalid badge id');
    }

    // set badge id
    const badgeId = parseInt(req.params.message_id);
    // get message
    const message = await Message.Model
      .service()
      .restore(messageId);

    // log history
    await History.log('Restored Message', req);

    // return response
    res.send({
      error: false,
      data: message
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST message bulk remove
 */
router.post('/bulk/remove', async (req, res, next) => {
  try {
    // get messages
    const message = await Message.Model
      .service()
      .remove(req.body.message_ids);

    // log history
    await History.log('Bulk Removed Message', req);

    // return response
    res.send({
      error: false,
      data: message
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST message bulk restore
 */
router.post('/bulk/restore', async (req, res, next) => {
  try {
    // get messages
    const message = await Message.Model
      .service()
      .restore(req.body.message_ids);

    // log history
    await History.log('Bulk Restored Message', req);

    // return response
    res.send({
      error: false,
      data: message
    });
  } catch (e) {
    next(e);
  }
});


module.exports = router;