const Model = require('./Model');
const Exception = require('./../Util/BaseException');
const md5 = require('md5');


module.exports = class Service extends Model {
  /**
   * Class constructor
   */
  constructor () {
    super();

    // class constants and variables
    this.CREATE_FAILED = 'Create user_parent failed.';
  }

  /**
   * Overrides model name
   */
  get modelName () {
    // by default, modelName is the class name
    // we should override Service classes to return the appropriate modelName
    // which is the parent class
    return Object.getPrototypeOf(this.constructor).name;
  }

  /**
   * Accept User
   * 
   * @param {object} data
   */
  async acceptUser (data) {
    // tell if both parent and user id exists
    const exists = await this.getDetailByBothId(data);

    // return if do not exists
    if (!exists || Object.keys(exists).length === 0) {
      throw new Error('Invalid user.')
    }

    // update user_parent_active
    data.user_parent_active = 1;
    data.where_statement = {
      parent_id: data.parent_id,
      user_id: data.user_id,
    }

    // init model
    let model = Model.build(data);

    // if valid user, update entry in user_parent
    return model.update();
  }

  /**
   * Decline User
   * 
   * @param {object} data
   */
  async declineUser (data) {
    // if valid user, remove to user_parent
    // tell if both parent and user id exists
    const exists = await this.getDetailByBothId(data);

    // return if do not exists
    if (!exists
      || Object.keys(exists).length === 0
      || exists.user_parent_active == 1
    ) {
      throw new Error('Invalid user.')
    }

    // delete user_parent entry
    data.where_statement = {
      parent_id: data.parent_id,
      user_id: data.user_id,
      user_parent_active: 0,
    }

    // init model
    let model = Model.build(data);

    // if valid user, delete entry in user_parent
    return model.del();
  }
  
  /**
   * Invite User
   * 
   * @param {object} data
   */
  async inviteUser (data) {
    // build data statement
    let user = Model.build(data);

    // save changes to database
    let userObj = await user.save();
    
    // return
    return userObj;
  }
}
