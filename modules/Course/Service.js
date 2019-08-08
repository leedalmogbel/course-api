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
    this.CREATE_FAILED = 'Create course failed.';
    this.UPDATE_FAILED = 'Update course failed.';
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
   * Create Course
   * 
   * @param {Object} data
   * @param {file} image
   */
  async createCourse (data, image) {
    // validate
    const errors = this.getCreateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        errors
      );
    }

    // check if Course exist
    let exists = await this.getCoruseByTitle(data.course_title);

    // throw error if title already exists
    if (Object.keys(exists).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        { course_title: 'title already exists'}
      );
    }

    let model = Model.build(data);
    
    // return
    return model.save();
  }

  /**
   * Update Course
   * 
   * @param {object} data
   */
  async updateCourse (data) {

    // validate fields
    const errors = this.getUpdateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(this.UPDATE_FAILED, errors);
    }

    // check if valid Course
    const valid = await this.getCourseById(data.course_id);
    if (!valid || Object.keys(valid).length === 0) {
      throw new Error('Invalid course.')
    }

    // init model
    let model = Model.build(data);

    // save course
    return model.update();
  }

  /**
   * Remove course
   *
   * @param id <integer>
   */
  remove(id) {
    let obj = {
      course_active: 0
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('course_id', id);
    } else {
      model.where('course_id', id);
    }

    // remove course
    return model.update();
  }

  /**
   * Restore course
   *
   * @param id <integer>
   */
  restore(id) {
    let obj = {
      course_active: 1
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('course_id', id);
    } else {
      model.where('course_id', id);
    }

    // remove course
    return model.update();
  }
}
