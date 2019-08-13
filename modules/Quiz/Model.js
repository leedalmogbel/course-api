const Helpers = require('../Util/Helpers');
const DB = require('../Util/DB');

/**
 *
 * Quiz Object
 */
module.exports = class Quiz extends DB {
  /**
   * Get quiz by id
   * 
   * @param {int} id 
   */
  getQuizById (id) {
    return this.where('quiz_id', id).get();
  }

  /**
   * return quiz question
   * 
   * @param {string} question 
   */
  getQuizByQuestion (question) {
    return this.where('quiz_question', question).get();
  }

  /**
   * Search quizes
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
      data.q.quiz_search = '%' + data.q.quiz_search + '%';
      this.andWhere(function () {
        this.where('quiz_question', 'like', data.q.quiz_search)
      })
    }

    // filter active
    if (!('quiz_active' in filter) || !filter['quiz_active']) {
      filter.quiz_active = 1;
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
   * Validate create quiz
   * 
   * @param {Object} data
   * @param {File} image
   */
  getCreateErrors (data, image) {
    let errors = {};

    if (!Helpers.isset(data.quiz_question) ||
      !Helpers.isStringNotEmpty(data.quiz_question)) {
      errors.quiz_question = 'Question is required';
    }

    return errors;
  }

  /**
   * Validate update quiz
   * 
   * @param {Object} data
   * @param {File} image
   */
  getUpdateErrors (data, image) {
    let errors = {};
    if (!Helpers.isset(data.quiz_question) ||
      !Helpers.isStringNotEmpty(data.quiz_question)) {
      errors.quiz_question = 'Question is required';
    }

    return errors;
  }
}
