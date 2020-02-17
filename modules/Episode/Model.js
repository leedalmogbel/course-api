const Helpers = require('../Util/Helpers');
const DB = require('../Util/DB');
const knex = require('knex');

/**
 *
 * Episode Object
 */
module.exports = class Episode extends DB {
  /**
   * Get episode by id
   * 
   * @param {int} id 
   */
  getEpisodeById (id) {
    return this.where('episode_id', id).get();
  }

  /**
   * return epusode title
   * 
   * @param {string} title 
   */
  getEpisodeByTitle (title) {
    return this.where('episode_title', title).get();
  }

  /**
   * Search Episodes
   * 
   * @param {object} data
   */
  searchEpisodes (data = {}) {
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
      data.q.episode_search = '%' + data.q.episode_search + '%';
      this.andWhere(function () {
        this.where('episode_title', 'like', data.q.episode_search)
      })
    }

    // filter active
    if (!('episode_active' in filter) || !filter['episode_active']) {
      filter.episode_active = 1;
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
   * Validate create episode
   * 
   * @param {Object} data
   * @param {File} image
   */
  getCreateErrors (data, image) {
    let errors = {};

    if (!Helpers.isset(data.episode_title) ||
      !Helpers.isStringNotEmpty(data.episode_title)) {
      errors.episode_title = 'Title is required';
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
    if (!Helpers.isset(data.episode_title) ||
      !Helpers.isStringNotEmpty(data.episode_title)) {
      errors.episode_title = 'Title is required';
    }

    return errors;
  }
}
