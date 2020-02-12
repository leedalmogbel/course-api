const express = require('express');
const router = express.Router();
const Post = require('@module/Post');

// set multer storage
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/posts'),
    filename: (req, file, cb) =>
      cb(null, Date.now() + '.' + file.originalname.split('.').pop())
  })
});

/**
 * GET: Search Posts
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/search', async (req, res, next) => {
  // init query
  query = req.query || {};
  // wrap async
  try {
    // search posts model
    let model = Post.Model
      .service()
      .searchPosts(query);

    // get posts
    const posts = await model.all();
    // get count
    const count = await model
      .searchPosts(query)
      .countDistinct('post_id as total')
      .limit(0)
      .offset(0)
      .first();

    // total
    const total = count ? count.total : 0;

    // send data to api side
    res.send({
      error: false,
      results: posts,
      total

    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Create posts
 *
 * @param {string} path
 * @param {function} callback
 */
router.post('/create', upload.single('post_image'), async (req, res, next) => {
  // wrap async
  try {
    // create new posts
    const post = await Post.Model
      .service()
      .createPost(req.body, req.file);

    // return response
    res.send({
      error: false,
      data: post
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST: Update Post
 * 
 * @param {string} path
 * @param {function} callback
 */
router.post('/update', upload.single('post_image'), async (req, res, next) => {
  // wrap async
  try {
    // update post
    const post = await Post.Model
      .service()
      .updatePost(req.body, req.file);

    // log history
    // await History.log('Updated Post', req);

    // return response
    res.send({
      error: false,
      data: post
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET: Fetch Post
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/detail/:post_id', async (req, res, next) => {
  // set post id
  const postId = parseInt(req.params.post_id);

  // wrap async
  try {
    if (!('post_id' in req.params)) {
      throw new Error('Invalid post id');
    }

    // get post by post id
    const post = await Post.Model
      .service()
      .getPostById(postId);

    // return response
    res.send({
      error: false,
      data: post
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: post remove
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/remove/:post_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('post_id' in req.params)) {
      throw new Error('Invalid post id');
    }

    // set brad id
    const postId = parseInt(req.params.post_id);

    // get post
    const post = await Post.Model
      .service()
      .remove(postId);

    // log history
    // await History.log('Removed Post', req);

    // return response
    res.send({
      error: false,
      data: post
    });
  } catch (e) {
    next(e);
  }
});


/**
 * GET: post restore
 * 
 * @param {string} path
 * @param {function} callback
 */
router.get('/restore/:post_id', async (req, res, next) => {
  // wrap async
  try {
    // check id
    if (!('post_id' in req.params)) {
      throw new Error('Invalid post id');
    }

    // set post id
    const postId = parseInt(req.params.post_id);
    // get post
    const post = await Post.Model
      .service()
      .restore(postId);

    // log history
    // await History.log('Restored Post', req);

    // return response
    res.send({
      error: false,
      data: post
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST post bulk remove
 */
router.post('/bulk/remove', async (req, res, next) => {
  try {
    // get posts
    const post = await Post.Model
      .service()
      .remove(req.body.post_ids);

    // log history
    await History.log('Bulk Removed Post', req);

    // return response
    res.send({
      error: false,
      data: post
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST post bulk restore
 */
router.post('/bulk/restore', async (req, res, next) => {
  try {
    // get posts
    const post = await Post.Model
      .service()
      .restore(req.body.post_ids);

    // log history
    await History.log('Bulk Restored Post', req);

    // return response
    res.send({
      error: false,
      data: post
    });
  } catch (e) {
    next(e);
  }
});


module.exports = router;