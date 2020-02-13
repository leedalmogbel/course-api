const Model = require('./Model');
const Exception = require('../Util/BaseException');

module.exports = class Service extends Model {
  /**
   * Class constructor
   */
  constructor () {
    super();

    // class constants and variables
    this.CREATE_FAILED = 'Create survey failed.';
    this.UPDATE_FAILED = 'Update survey failed.';
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
   * Create Survey
   * 
   * @param {Object} data
   * @param {file} image
   */
  async createSurvey (data, image) {
    // validate
    const errors = this.getCreateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        errors
      );
    }

    // check if Survey exist
    let exists = await this.getSurveyByTitle(data.survey_title);

    // throw error if title already exists
    if (Object.keys(exists).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        { survey_title: 'title already exists'}
      );
    }

    let model = Model.build(data);
    
    // return
    return model.save();
  }

  /**
   * Update Survey
   * 
   * @param {object} data
   */
  async updateSurvey (data) {

    // validate fields
    const errors = this.getUpdateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(this.UPDATE_FAILED, errors);
    }

    // check if valid Survey
    const valid = await this.getSurveyById(data.survey_id);
    if (!valid || Object.keys(valid).length === 0) {
      throw new Error('Invalid survey.')
    }

    // init model
    let model = Model.build(data);

    // save survey
    return model.update();
  }

  /**
   * Remove survey
   *
   * @param id <integer>
   */
  remove(id) {
    let obj = {
      survey_active: 0
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('survey_id', id);
    } else {
      model.where('survey_id', id);
    }

    // remove survey
    return model.update();
  }

  /**
   * Restore survey
   *
   * @param id <integer>
   */
  restore(id) {
    let obj = {
      survey_active: 1
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('survey_id', id);
    } else {
      model.where('survey_id', id);
    }

    // remove survey
    return model.update();
  }
}
