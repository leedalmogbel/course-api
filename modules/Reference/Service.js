const Model = require('./Model');
const Exception = require('./../Util/BaseException');

module.exports = class Service extends Model {
  /**
   * Class constructor
   */
  constructor () {
    super();

    // class constants and variables
    this.CREATE_FAILED = 'Create reference failed.';
    this.UPDATE_FAILED = 'Update reference failed.';
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
   * Create Reference
   * 
   * @param {Object} data
   * @param {file} image
   */
  async createReference (data, image) {
    // validate
    const errors = this.getCreateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        errors
      );
    }

    let model = Model.build(data);
    
    // return
    return model.save();
  }

  /**
   * Update Reference
   * 
   * @param {object} data
   */
  async updateReference (data) {

    // validate fields
    const errors = this.getUpdateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(this.UPDATE_FAILED, errors);
    }

    // check if valid Reference
    const valid = await this.getReferenceById(data.reference_id);
    if (!valid || Object.keys(valid).length === 0) {
      throw new Error('Invalid reference.')
    }

    // init model
    let model = Model.build(data);

    // save reference
    return model.update();
  }

  /**
   * Remove reference
   *
   * @param id <integer>
   */
  remove(id) {
    let obj = {
      reference_active: 0
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('reference_id', id);
    } else {
      model.where('reference_id', id);
    }

    // remove reference
    return model.update();
  }

  /**
   * Restore reference
   *
   * @param id <integer>
   */
  restore(id) {
    let obj = {
      reference_active: 1
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('reference_id', id);
    } else {
      model.where('reference_id', id);
    }

    // remove reference
    return model.update();
  }
}