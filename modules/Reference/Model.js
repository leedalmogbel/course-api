const Helpers = require('../Util/Helpers');
const DB = require('../Util/DB');

/**
 *
 * Reference Object
 */
module.exports = class Reference extends DB {
  /**
   * Get Reference by id
   * 
   * @param {int} id 
   */
  getReferenceById (id) {
    return this.where('reference_id', id).get();
  }

  /**
   * Search Reference
   * 
   * @param {object} data
   */
  searchReferences (data = {}) {
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
    // if ('q' in data) {
    //   data.q.message_search = '%' + data.q.message_search + '%';
    //   this.andWhere(function () {
    //     this.where('message_content', 'like', data.q.message_search)
    //   })
    // }

    // filter active
    if (!('reference_active' in filter) || !filter['reference_active']) {
      filter.reference_active = 1;
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
   * Validate create reference
   * 
   * @param {Object} data
   * @param {File} image
   */
  getCreateErrors (data, image) {
    let errors = {};

    // if (!Helpers.isset(data.message_content) ||
    //   !Helpers.isStringNotEmpty(data.message_content)) {
    //   errors.message_content = 'Content is required';
    // }

    return errors;
  }

  /**
   * Validate update reference
   * 
   * @param {Object} data
   * @param {File} image
   */
  getUpdateErrors (data, image) {
    let errors = {};

    // if (!Helpers.isset(data.message_content) ||
    //   !Helpers.isStringNotEmpty(data.message_content)) {
    //   errors.message_content = 'Content is required';
    // }

    return errors;
  }
}
