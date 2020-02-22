const Helpers = require('../Util/Helpers');
const DB = require('../Util/DB');
const knex = require('knex');

/**
 * @author Leed Almogbel <leedalmogbel@gmail.com>
 * User Object
 */
module.exports = class User_parent extends DB {
  /**
   * Get user_parent detail by using user_id and parent_id as params
   * 
   * @param {int} id 
   */
  getDetailByBothId (data) {
    // get user by id
    return this
      .where('user_id', data.user_id)
      .where('parent_id', data.parent_id)
      .get();
  }

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
}
