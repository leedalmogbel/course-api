const express = require('express');
const router = express.Router();
const Reference = require('@module/Reference');
const History  = require('@module/Util/History');

/**
 * GET: Search References
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/search', async (req, res, next) => {
  // init query
  query = req.query || {};
  // wrap async
  try {
    // search references model
    let model = Reference.Model
      .service()
      .searchReferences(query);

    // get References
    const references = await model.all();
    // get count
    const count = await model
      .searchReferences(query)
      .countDistinct('reference_id as total')
      .limit(0)
      .offset(0)
      .first();

    // total
    const total = count ? count.total : 0;

    // return response
    res.send({
      error: false,
      data: {
        rows: references,
        total
      }
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Create Reference
 *
 * @param {string} path
 * @param {function} callback
 */
router.post('/create', async (req, res, next) => {
  // wrap async
  try {
    // create new Refence
    const reference = await Reference.Model
      .service()
      .createReference(req.body, req.file);

    // log history
    await History.log('Created Reference', req);

    // return response
    res.send({
      error: false,
      data: reference
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Update Reference
 * 
 * @param {string} path
 * @param {function} callback
 */
router.post('/update', async (req, res, next) => {
  // wrap async
  try {
    // update Reference
    const reference = await Reference.Model
      .service()
      .updateReference(req.body, req.file);

    // log history
    await History.log('Updated Reference', req);

    // return response
    res.send({
      error: false,
      data: reference
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET: Fetch Reference
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/detail/:reference_id', async (req, res, next) => {
  // set Reference id
  const referenceId = parseInt(req.params.reference_id);

  // wrap async
  try {
    if (!('reference_id' in req.params)) {
      throw new Error('Invalid Reference id');
    }

    // get Reference by Reference id
    const reference = await Reference.Model
      .service()
      .getReferenceById(referenceId);

    // return response
    res.send({
      error: false,
      data: reference
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: reference remove
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/remove/:reference_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('reference_id' in req.params)) {
      throw new Error('Invalid reference id');
    }

    // set brad id
    const referenceId = parseInt(req.params.reference_id);

    // get reference
    const reference = await Reference.Model
      .service()
      .remove(referenceId);

    // log history
    await History.log('Removed Reference', req);

    // return response
    res.send({
      error: false,
      data: reference
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: reference restore
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/restore/:reference_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('reference_id' in req.params)) {
      throw new Error('Invalid reference id');
    }

    // set reference id
    const referenceId = parseInt(req.params.reference_id);
    // get reference
    const reference = await Reference.Model
      .service()
      .restore(referenceId);

    // log history
    await History.log('Restored Reference', req);

    // return response
    res.send({
      error: false,
      data: reference
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST reference bulk remove
 */
router.post('/bulk/remove', async (req, res, next) => {
  try {
    // get references
    const reference = await Reference.Model
      .service()
      .remove(req.body.reference_ids);

    // log history
    await History.log('Bulk Removed Reference', req);

    // return response
    res.send({
      error: false,
      data: reference
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST reference bulk restore
 */
router.post('/bulk/restore', async (req, res, next) => {
  try {
    // get references
    const reference = await Reference.Model
      .service()
      .restore(req.body.reference_ids);

    // log history
    await History.log('Bulk Restored Reference', req);

    // return response
    res.send({
      error: false,
      data: reference
    });
  } catch (e) {
    next(e);
  }
});


module.exports = router;