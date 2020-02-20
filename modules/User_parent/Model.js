const Helpers = require('../Util/Helpers');
const DB = require('../Util/DB');
const knex = require('knex');

/**
 * @author Leed Almogbel <leedalmogbel@gmail.com>
 * User Object
 */
module.exports = class User_parent extends DB {
  /**
   * Get user by id
   * 
   * @param {int} id 
   */
  getUserById (id) {
    // get user by id
    return this.where('user_id', id).get();
  }

  /**
   * return user email
   * 
   * @param {string} email 
   */
  getUserByEmail (email) {
    // get user by email
    return this.where('user_slug', email).get();
  }

  /**
   * return active user
   */
  getActiveUser () {
    return this.where('user_active', 1);
  }

  /**
   * Get Login Data
   * 
   * @param {Object} data
   */
  getUserLogin(data) {
    return this.where('user_slug', data.user_slug)
      .where('user_password', data.user_password)
      .where('user_active', 1);
  }

  /**
   * Search users
   * 
   * @param {object} data
   */
  searchUsers (data = {}) {
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
      data.q.user_search = '%' + data.q.user_search + '%';
      this.andWhere(function () {
        this.where('user_firstname', 'like', data.q.user_search)
          .orWhere('user_lastname', 'like', data.q.user_search)
          .orWhere('user_type', 'like', data.q.user_search)
          .orWhere('user_slug', 'like', data.q.user_search)
      })
    }

    // filter active
    if (!('user_active' in filter) || !filter['user_active']) {
      filter.user_active = 1;
    }
    
    // users not admin
    this.where('user_type', '<>', 'admin');

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
   * Validate create user
   */
  getCreateErrors (data) {
    let errors = {};


    if (!Helpers.isset(data.user_slug) ||
      !Helpers.isValidEmail(data.user_slug)) {
      errors.user_slug = 'Email is required';
    }

    if (!Helpers.isset(data.user_password)) {
      errors.user_password = 'Password is required';
    }

    return errors;
  }

  /**
   * Validate update user
   */
  getUpdateErrors (data) {
    let errors = {};

    // if (!Helpers.isset(data.user_firstname) ||
    //   !Helpers.isStringNotEmpty(data.user_firstname)) {
    //   errors.user_firstname = 'First name is required';
    // }

    // if (!Helpers.isset(data.user_lastname) ||
    //   !Helpers.isStringNotEmpty(data.user_lastname)) {
    //   errors.user_lastname = 'Last name is required';
    // }

    // if (!Helpers.isset(data.user_slug) ||
    //   !Helpers.isValidEmail(data.user_slug)) {
    //   errors.user_slug = 'Email is required';
    // }

    // if (!Helpers.isset(data.user_password)) {
    //   errors.user_slug = 'Password cannot be empty';
    // }

    // if (String(data.user_password).length < 8) {
    //   errors.user_password = 'Password must be atleast 8';
    // }

    return errors;
  }

  /**
   * Validate login data
   */
  getLoginErrors () {
    let errors = {};

    // parse data as string
    this.user_slug = String(this.user_slug);
    this.user_password = String(this.user_password);

    // required user slug
    if (!Helpers.isset(this.user_slug)
      || !Helpers.isStringNotEmpty(this.user_slug)) {
      errors.user_slug = 'Email address is required.';
    }

    // valid user slug
    if (!Helpers.isValidEmail(this.user_slug)) {
      errors.user_slug = 'Email address is invalid.';
    }

    // required passsword
    if (!Helpers.isset(this.user_password)
      || !Helpers.isStringNotEmpty(this.user_password)) {
      errors.user_password = 'Password is required.';
    }

    return errors;
  }
}
