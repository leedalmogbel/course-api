const Helpers = require('../Util/Helpers');
const DB = require('../Util/DB');
const knex = require('knex');

/**
 *
 * Survey Object
 */
module.exports = class Survey extends DB {
  /**
   * Get survey by id
   * 
   * @param {int} id 
   */
  getSurveyById (id) {
    return this.where('survey_id', id).get();
  }

  /**
   * return survey title
   * 
   * @param {string} title 
   */
  getSurveyByTitle (title) {
    return this.where('survey_title', title).get();
  }

  /**
   * Search surveys
   * 
   * @param {object} data
   */
  searchSurveys (data = {}) {
    let helper = new Helpers();

    let filter = {};
    let range = 10;
    let start = 0;
    let order = {};
console.log('tae',data)
    // check if we have filter
    if (('filter' in data)
      && data.filter
    ) {
      // set the filter
      filter = data.filter;
    }

    // start
    if (('start' in data)
      && data.start) {
      start = parseInt(data.start);
    }

    // range
    if (('range' in data)
      && data.range) {
      range = parseInt(data.range);
    }

    // order
    if ('order' in data && data.order) {
      order = data.order;
    }

    // get q for query
    if ('q' in data) {
      data.q.survey_search = '%' + data.q.survey_search + '%';
      this.andWhere(function () {
        this.where('survey_title', 'like', data.q.survey_search)
      })
    }

    // filter active
    if (!('survey_active' in filter) || !filter['survey_active']) {
      filter.survey_active = 1;
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
   * Validate create survey
   * 
   * @param {Object} data
   * @param {File} image
   */
  getCreateErrors (data, image) {
    let errors = {};

    if (!Helpers.isset(data.survey_title) ||
      !Helpers.isStringNotEmpty(data.survey_title)) {
      errors.survey_title = 'Title is required';
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
    if (!Helpers.isset(data.survey_title) ||
      !Helpers.isStringNotEmpty(data.survey_title)) {
      errors.survey_title = 'Title is required';
    }

    return errors;
  }
}
