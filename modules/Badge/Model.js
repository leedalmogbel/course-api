const Helpers = require('../Util/Helpers');
const DB = require('../Util/DB');

/**
 *
 * Badge Object
 */
module.exports = class Badge extends DB {
  /**
   * Get Badge by id
   * 
   * @param {int} id 
   */
  getBadgeById (id) {
    return this.where('badge_id', id).get();
  }

  /**
   * return badge title
   * 
   * @param {string} title 
   */
  getBadgeByTitle (title) {
    return this.where('badge_title', title).get();
  }

  /**
   * Search badges
   * 
   * @param {object} data
   */
  searchQuizes (data = {}) {
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
      && helper.isInt(data.start)
    ) {
      start = parseInt(data.start);
    }

    // range
    if (('range' in data)
      && data.range
      && helper.isInt(data.range)
    ) {
      range = parseInt(data.range);
    }

    // order
    if ('order' in data && data.order) {
      order = data.order;
    }

    // get q for query
    if ('q' in data) {
      data.q.badge_search = '%' + data.q.badge_search + '%';
      this.andWhere(function () {
        this.where('badge_title', 'like', data.q.badge_search)
      })
    }

    // filter active
    if (!('badge_active' in filter) || !filter['badge_active']) {
      filter.badge_active = 1;
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

    this
      .limit(range)
      .offset(start);

    // get all
    return this
  }

  /**
   * Validate create badge
   * 
   * @param {Object} data
   * @param {File} image
   */
  getCreateErrors (data, image) {
    let errors = {};

    if (!Helpers.isset(data.badge_title) ||
      !Helpers.isStringNotEmpty(data.badge_title)) {
      errors.badge_title = 'Title is required';
    }

    return errors;
  }

  /**
   * Validate update badge
   * 
   * @param {Object} data
   * @param {File} image
   */
  getUpdateErrors (data, image) {
    let errors = {};
    if (!Helpers.isset(data.badge_title) ||
      !Helpers.isStringNotEmpty(data.badge_title)) {
      errors.badge_title = 'Title is required';
    }

    return errors;
  }
}
