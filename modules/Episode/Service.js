const Model = require('./Model');
const Exception = require('../Util/BaseException');

module.exports = class Service extends Model {
  /**
   * Class constructor
   */
  constructor () {
    super();

    // class constants and variables
    this.CREATE_FAILED = 'Create episode failed.';
    this.UPDATE_FAILED = 'Update episode failed.';
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
   * Create Episode
   * 
   * @param {Object} data
   * @param {file} image
   */
  async createEpisode (data, image) {
    // validate
    const errors = this.getCreateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        errors
      );
    }

    // check if Episode exist
    let exists = await this.getEpisodeByTitle(data.episode_title);

    // throw error if title already exists (NOT NEEDED)
    // if (Object.keys(exists).length > 0) {
    //   throw Exception.setValidations(
    //     this.CREATE_FAILED,
    //     { episode_title: 'title already exists' }
    //   );
    // }

    let model = Model.build(data);
    
    // return
    return model.save();
  }

  /**
   * Update Episode
   * 
   * @param {object} data
   */
  async updateEpisode (data) {

    // validate fields
    const errors = this.getUpdateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(this.UPDATE_FAILED, errors);
    }

    // check if valid Episode
    const valid = await this.getEpisodeById(data.episode_id);
    if (!valid || Object.keys(valid).length === 0) {
      throw new Error('Invalid episode.')
    }

    // init model
    let model = Model.build(data);

    // save episode
    return model.update();
  }

  /**
   * Remove episode
   *
   * @param id <integer>
   */
  remove(id) {
    let obj = {
      episode_active: 0
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('episode_id', id);
    } else {
      model.where('episode_id', id);
    }

    // remove episode
    return model.update();
  }

  /**
   * Restore episode
   *
   * @param id <integer>
   */
  restore(id) {
    let obj = {
      episode_active: 1
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('episode_id', id);
    } else {
      model.where('episode_id', id);
    }

    // remove episode
    return model.update();
  }
}
