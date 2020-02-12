const Helpers = require('../Util/Helpers');
const DB = require('../Util/DB');
const knex = require('knex');

/**
 *
 * Post Object
 */
module.exports = class Post extends DB {
  /**
   * Get post by id
   * 
   * @param {int} id 
   */
  getPostById (id) {
    return this.where('post_id', id).get();
  }

  /**
   * return post title
   * 
   * @param {string} title 
   */
  getPostByTitle (title) {
    return this.where('post_title', title).get();
  }

  /**
   * Search posts
   * 
   * @param {object} data
   */
  searchPosts (data = {}) {
    let helper = new Helpers();

    let filter = {};
    let range = 10;
    let start = 0;
    let order = {};

    // check if we have filter
    if (('filter' in data)
      && data.filter
    ) {
      // set the filter
      filter = data.filter;
    }

    // start
    if (('start' in data)
      && data.start
      // && helper.isInt(data.start)
    ) {
      start = parseInt(data.start);
    }

    // range
    if (('range' in data)
      && data.range
      // && helper.isInt(data.range)
    ) {
      range = parseInt(data.range);
    }

    // order
    if ('order' in data && data.order) {
      order = data.order;
    }

    // get q for query
    if ('q' in data) {
      data.q.post_search = '%' + data.q.post_search + '%';
      this.andWhere(function () {
        this.where('post_title', 'like', data.q.post_search)
      })
    }

    // filter active
    if (!('post_active' in filter) || !filter['post_active']) {
      filter.post_active = 1;
    }

    // loop out the filters
    Object.keys(filter).forEach((column) => {
      // check if the column if a valid string
      if (/^[a-zA-Z0-9-_]+$/.test(column)) {
        this.where(column, filter[column]);
      }
    });

    // add some sorting if given
    Object.keys(order).forEach((direction, sort) => {
      this.orderBy(direction, sort);
    });

    if (range > 0) {
      this.limit(range)
    }

    this.offset(start);

    // get all
    return this
  }

  /**
   * Validate create post
   * 
   * @param {Object} data
   * @param {File} image
   */
  getCreateErrors (data, image) {
    let errors = {};

    if (!Helpers.isset(data.post_title) ||
      !Helpers.isStringNotEmpty(data.post_title)) {
      errors.post_title = 'Title is required';
    }

    return errors;
  }

  /**
   * Validate update user
   * 
   * @param {Object} data
   * @param {File} image
   */
  getUpdateErrors (data, image) {
    let errors = {};
    if (!Helpers.isset(data.post_title) ||
      !Helpers.isStringNotEmpty(data.post_title)) {
      errors.post_title = 'Title is required';
    }

    return errors;
  }
}
