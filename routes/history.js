const express = require('express');
const router = express.Router();
const History = require('@module/History');

/**
 * GET: Search hitories
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/search', async (req, res, next) => {
  // init query
  query = req.query || {};

  // wrap async
  try {
    // search histories model
    let model = History.Model
      .service()
      .searchHistory(query);

    // get histories
    const histories = await model.all();

    // get count
    const count = await model
      .searchHistory(query)
      .countDistinct('history_id as total')
      .limit(0)
      .offset(0)
      .first();

    // total
    const total = count ? count.total : 0;

    // return response
    res.send({
      error: false,
      data: {
        rows: histories,
        total
      }
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;