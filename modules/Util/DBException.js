const BaseException = require('./BaseException');

module.exports = class DBException extends BaseException {
  /**
   * Model not found exception
   *
   * @param model <@string>
   */
  static modelNotFound(model) {
    return new this(`${model} model not found`, '', 404);
  }
  
  /**
   * Service not found exception
   *
   * @param model <@string>
   */
  static serviceNotFound(model) {
    return new this(`${model} service not found`, '', 404);
  }
}
