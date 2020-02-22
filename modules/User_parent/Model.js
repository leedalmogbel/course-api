const Helpers = require('../Util/Helpers');
const DB = require('../Util/DB');
const knex = require('knex');

/**
 * @author Leed Almogbel <leedalmogbel@gmail.com>
 * User Object
 */
module.exports = class User_parent extends DB {
  /**
   * Get invitee by id
   * 
   * @param {int} id 
   */
  getInviteeById (id) {
    // get user by id
    return this.where('user_id', id).get();
  }

  /**
   * Get user by id
   * 
   * @param {int} id 
   */
  getUserById (id) {
    // get user by id
    return this.where('parent_id', id).get();
  }

  /**
   * return active user
   */
  getAcceptedInvite () {
    return this.where('user_parent_active', 1);
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
}
