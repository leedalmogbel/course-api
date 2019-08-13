const Model = require('./Model');
const Exception = require('./../Util/BaseException');

module.exports = class Service extends Model {
  /**
   * Class constructor
   */
  constructor () {
    super();

    // class constants and variables
    this.CREATE_FAILED = 'Create quiz failed.';
    this.UPDATE_FAILED = 'Update quiz failed.';
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
   * Create Quiz
   * 
   * @param {Object} data
   * @param {file} image
   */
  async createQuiz (data, image) {
    // validate
    const errors = this.getCreateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        errors
      );
    }

    // check if Quiz exist
    let exists = await this.getQuizByQuestion(data.quiz_question);

    // throw error if title already exists
    if (Object.keys(exists).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        { quiz_question: 'Question already exists'}
      );
    }

    let model = Model.build(data);
    
    // return
    return model.save();
  }

  /**
   * Update Quiz
   * 
   * @param {object} data
   */
  async updateQuiz (data) {

    // validate fields
    const errors = this.getUpdateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(this.UPDATE_FAILED, errors);
    }

    // check if valid Quiz
    const valid = await this.getQuizById(data.quiz_id);
    if (!valid || Object.keys(valid).length === 0) {
      throw new Error('Invalid quiz.')
    }

    // init model
    let model = Model.build(data);

    // save quiz
    return model.update();
  }

  /**
   * Remove quiz
   *
   * @param id <integer>
   */
  remove(id) {
    let obj = {
      quiz_active: 0
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('quiz_id', id);
    } else {
      model.where('quiz_id', id);
    }

    // remove quiz
    return model.update();
  }

  /**
   * Restore quiz
   *
   * @param id <integer>
   */
  restore(id) {
    let obj = {
      quiz_active: 1
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('quiz_id', id);
    } else {
      model.where('quiz_id', id);
    }

    // remove quiz
    return model.update();
  }
}