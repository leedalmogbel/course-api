const Model = require('./Model');
const Helpers = require('./../Util/Helpers');

module.exports = class Service extends Model {
  /**
   * Class constructor
   */
  constructor () {
    super();
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
   * Create History
   * 
   * @param {Object} data
   */
  createHistory (data) {
    let history = Model.build(data);

    // return
    return history.save();
  }
}