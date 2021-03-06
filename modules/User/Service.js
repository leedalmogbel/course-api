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
   * Create User
   * 
   * @param {Object} data
   * @param {file} image
   */
  async createUser (data, image) {
    // validate
    // const errors = this.getCreateErrors(data);
    // if (Object.keys(errors).length > 0) {
    //   throw Exception.setValidations(
    //     this.CREATE_FAILED,
    //     errors
    //   );
    // }

    // check if user exist
    let exists = await this.getUserByEmail(data.user_slug);

    // throw error if email already exists
    if (Object.keys(exists).length > 0) {
      throw {
        message: 'Invalid Request.',
        validation: { user_slug: 'Email already exists' }
      }
    }

    // encrypt password
    data.user_password = md5(data.user_password);

    let user = Model.build(data);

    let userObj = await user.save();
    
    // return
    return userObj;
  }
  
  /**
   * Check Unique Email
   * 
   * @param {Object} data
   */
  async checkEmail (email) {
    // check if user exist
    let exists = await this.getUserByEmail(email);

    // throw error if email already exists
    if (Object.keys(exists).length > 0) {
      throw {
        message: 'Invalid Request.',
        validation: { user_slug: 'Email already exists' }
      }
    }

    // return
    return exists;
  }

  /**
   * Check Email Exists
   * 
   * @param {Object} data
   */
  async checkEmailExists (email) {
    // check if user exist
    let exists = await this.getUserByEmail(email);

    // throw error if email already exists
    if (!Object.keys(exists).length > 0) {
      throw {
        message: 'Invalid Request.',
        validation: { user_slug: 'Email does not exist' }
      }
    }

    // return
    return exists;
  }

  /**
   * Get User Detail
   * 
   * @param {int} id
   */
  async getUserDetail (id) {
    // check if valid user
    const user = await this.getUserById(id);
    if (!user || Object.keys(user).length === 0) {
      throw new Error('Invalid user.')
    }
    
    return user;
  }

  /**
   * Update User
   * 
   * @param {object} data
   */
  async updateUser (data) {
    // validate fields
    const errors = this.getUpdateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(this.UPDATE_FAILED, errors);
    }

    // check if valid user
    const valid = await this.getUserById(data.user_id);
    if (!valid || Object.keys(valid).length === 0) {
      throw new Error('Invalid user.')
    }

    // remove user slug
    delete data.user_slug;

    if (typeof data.user_password === 'undefined') {
      delete data.user_password;
    } else {
      data.user_password = md5(data.user_password);
    }

    // init model
    let model = Model.build(data);

    // save user
    return model.update();
  }

  /**
   * Login user process
   * 
   * @param {Object} obj
   * @param {String} type
   */
  async loginUser (obj, type = null) {
    // build model
    let user = Model.build(obj);

    // validate data
    const errors = user.getLoginErrors();
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(
        this.LOGIN_FAILED,
        errors
      );
    }

    // format passsword
    user.user_password = md5(user.user_password);
    
    // get user
    let query = this.getUserLogin(user);

    if (type) {
      query = query.where('user_type', type);
    }

    const auth = await query.get();

    // if user does not exists
    if (!auth || Object.keys(auth).length === 0) {
      throw Exception.setValidations(
        this.LOGIN_FAILED,
        { user_slug: 'Your email address or password is incorrect' }
      );
    }

    return auth;
  }

  /**
   * Remove User
   *
   * @param id <integer>
   */
  remove(id) {
    let obj = {
      user_active: 0
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('user_id', id);
    } else {
      model.where('user_id', id);
    }

    // remove user
    return model.update();
  }

  /**
   * Restore User
   *
   * @param id <integer>
   */
  restore(id) {
    let obj = {
      user_active: 1
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('user_id', id);
    } else {
      model.where('user_id', id);
    }

    // remove user
    return model.update();
  }

  /**
   * Forgot Password
   * 
   * @param {object} data
   */
  async forgotPassword (data) {
    // validate fields
    const errors = this.getForgotPasswordErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(this.UPDATE_FAILED, errors);
    }

    // check if existing user user
    const exists = await this.getUserByEmail(data.user_slug);

    if (!exists || Object.keys(exists).length === 0) {
      throw new Error('Invalid user.')
    }

    // delete existing password
    delete exists.user_password;

    if (typeof data.user_password === 'undefined') {
      delete data.user_password;
    } else {
      data.user_password = md5(data.user_password);
    }

    // combine user's data with updated password
    // for the sake of updating
    data = {...data, ...exists};

    // remove unnecessary fields
    delete data.user_confirm;
    delete data.user_created;
    delete data.user_updated;

    // init model
    let model = Model.build(data);

    // save user
    model.update();

    // remove user password
    delete data.user_password;

    return data;
  }
}
