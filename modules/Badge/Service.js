const Model = require('./Model');
const Exception = require('./../Util/BaseException');

module.exports = class Service extends Model {
  /**
   * Class constructor
   */
  constructor () {
    super();

    // class constants and variables
    this.CREATE_FAILED = 'Create badge failed.';
    this.UPDATE_FAILED = 'Update badge failed.';
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
   * Create Badge
   * 
   * @param {Object} data
   * @param {file} image
   */
  async createBadge (data, image) {
    // validate
    const errors = this.getCreateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        errors
      );
    }

    // check if Badge exist
    let exists = await this.getBadgeByTitle(data.badge_title);

    // throw error if title already exists
    if (Object.keys(exists).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        { badge_title: 'Title already exists'}
      );
    }

    let model = Model.build(data);
    
    // return
    return model.save();
  }

  /**
   * Update Badge
   * 
   * @param {object} data
   */
  async updateBadge (data) {

    // validate fields
    const errors = this.getUpdateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(this.UPDATE_FAILED, errors);
    }

    // check if valid Badge
    const valid = await this.getBadgeById(data.badge_id);
    if (!valid || Object.keys(valid).length === 0) {
      throw new Error('Invalid badge.')
    }

    // init model
    let model = Model.build(data);

    // save badge
    return model.update();
  }

  /**
   * Remove badge
   *
   * @param id <integer>
   */
  remove(id) {
    let obj = {
      badge_active: 0
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('badge_id', id);
    } else {
      model.where('badge_id', id);
    }

    // remove badge
    return model.update();
  }

  /**
   * Restore badge
   *
   * @param id <integer>
   */
  restore(id) {
    let obj = {
      badge_active: 1
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('badge_id', id);
    } else {
      model.where('badge_id', id);
    }

    // remove badge
    return model.update();
  }
}