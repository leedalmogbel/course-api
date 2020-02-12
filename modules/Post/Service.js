const Model = require('./Model');
const Exception = require('../Util/BaseException');

module.exports = class Service extends Model {
  /**
   * Class constructor
   */
  constructor () {
    super();

    // class constants and variables
    this.CREATE_FAILED = 'Create post failed.';
    this.UPDATE_FAILED = 'Update post failed.';
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
   * Create Post
   * 
   * @param {Object} data
   * @param {file} image
   */
  async createPost (data, image) {
    // validate
    const errors = this.getCreateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        errors
      );
    }

    // check if Post exist
    let exists = await this.getPostByTitle(data.post_title);

    // throw error if title already exists
    if (Object.keys(exists).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        { post_title: 'title already exists'}
      );
    }

    let model = Model.build(data);
    
    // return
    return model.save();
  }

  /**
   * Update Post
   * 
   * @param {object} data
   */
  async updatePost (data) {

    // validate fields
    const errors = this.getUpdateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(this.UPDATE_FAILED, errors);
    }

    // check if valid Post
    const valid = await this.getPostById(data.post_id);
    if (!valid || Object.keys(valid).length === 0) {
      throw new Error('Invalid post.')
    }

    // init model
    let model = Model.build(data);

    // save post
    return model.update();
  }

  /**
   * Remove post
   *
   * @param id <integer>
   */
  remove(id) {
    let obj = {
      post_active: 0
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('post_id', id);
    } else {
      model.where('post_id', id);
    }

    // remove post
    return model.update();
  }

  /**
   * Restore post
   *
   * @param id <integer>
   */
  restore(id) {
    let obj = {
      post_active: 1
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('post_id', id);
    } else {
      model.where('post_id', id);
    }

    // remove post
    return model.update();
  }
}
