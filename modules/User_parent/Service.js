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
    this.LOGIN_FAILED = 'Login failed.';
    this.CREATE_FAILED = 'Create user failed.';
    this.UPDATE_FAILED = 'Update user failed.';
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
   * Update User
   * 
   * @param {object} data
   */
  async inviteUser (data) {
    // validate fields
    const errors = this.getUpdateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(this.UPDATE_FAILED, errors);
    }
    console.log('data: ', data.user_slug)

    // if valid user


    // // check if valid user
    // const valid = await this.getUserById(data.user_id);
    // if (!valid || Object.keys(valid).length === 0) {
    //   throw new Error('Invalid user.')
    // }

    // // remove user slug
    // delete data.user_slug;

    // if (typeof data.user_password === 'undefined') {
    //   delete data.user_password;
    // } else {
    //   data.user_password = md5(data.user_password);
    // }

    // // init model
    // let model = Model.build(data);

    // // save user
    // return model.update();

    // let user = Model.build(data);

    // let userObj = await user.save();
    
    // // return
    // return userObj;
  }
}
