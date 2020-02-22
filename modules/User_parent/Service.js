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
    console.log('data: ', data.user_slug)

    // if valid user, update entry in user_parent
  }

  /**
   * Decline User
   * 
   * @param {object} data
   */
  async declineUser (data) {
    console.log('data: ', data.user_slug)

    // if valid user, remove to user_parent
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
