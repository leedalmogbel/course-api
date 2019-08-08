const Helpers = require('../Util/Helpers');
const DB = require('../Util/DB');
const knex = require('knex');

/**
 * @author Leed Almogbel <leedalmogbel@gmail.com>
 * Course Object
 */
module.exports = class Course extends DB {
  /**
   * Get course by id
   * 
   * @param {int} id 
   */
  getCourseById (id) {
    return this.where('course_id', id).get();
  }

  /**
   * return course title
   * 
   * @param {string} title 
   */
  getCoruseByTitle (title) {
    return this.where('course_title', title).get();
  }

  /**
   * Search courses
   * 
   * @param {object} data
   */
  searchCourses (data = {}) {
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
      data.q.course_search = '%' + data.q.course_search + '%';
      this.andWhere(function () {
        this.where('course_title', 'like', data.q.course_search)
      })
    }

    // filter active
    if (!('course_active' in filter) || !filter['course_active']) {
      filter.course_active = 1;
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
   * Validate create course
   */
  getCreateErrors (data) {
    let errors = {};

    if (!Helpers.isset(data.course_title) ||
      !Helpers.isStringNotEmpty(data.course_title)) {
      errors.course_title = 'Title is required';
    }

    return errors;
  }

  /**
   * Validate update user
   */
  getUpdateErrors (data) {
    let errors = {};
    if (!Helpers.isset(data.course_title) ||
      !Helpers.isStringNotEmpty(data.course_title)) {
      errors.course_title = 'Title is required';
    }

    return errors;
  }
}
