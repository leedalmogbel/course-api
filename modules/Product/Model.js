const Helpers = require('../Util/Helpers');
const DB = require('../Util/DB');

/**
 *
 * Product Object
 */
module.exports = class Product extends DB {
  /**
   * Get Product by id
   * 
   * @param {int} id 
   */
  getProductById (id) {
    return this.where('product_id', id).get();
  }

  /**
   * return product title
   * 
   * @param {string} title 
   */
  getProductByTitle (title) {
    return this.where('product_title', title).get();
  }

  /**
   * Search Product
   * 
   * @param {object} data
   */
  searchProducts (data = {}) {
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
      data.q.product_search = '%' + data.q.product_search + '%';
      this.andWhere(function () {
        this.where('product_title', 'like', data.q.product_search)
      })
    }

    // filter active
    if (!('product_active' in filter) || !filter['product_active']) {
      filter.product_active = 1;
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
   * Validate create product
   * 
   * @param {Object} data
   * @param {File} image
   */
  getCreateErrors (data, image) {
    let errors = {};

    if (!Helpers.isset(data.product_title) ||
      !Helpers.isStringNotEmpty(data.product_title)) {
      errors.product_title = 'Title is required';
    }

    return errors;
  }

  /**
   * Validate update product
   * 
   * @param {Object} data
   * @param {File} image
   */
  getUpdateErrors (data, image) {
    let errors = {};

    if (!Helpers.isset(data.product_title) ||
      !Helpers.isStringNotEmpty(data.product_title)) {
      errors.product_title = 'Title is required';
    }

    return errors;
  }
}
