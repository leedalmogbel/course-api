const Helpers = require('./Helpers');
/**
 * Base Exception
 */
module.exports = class BaseException extends Error {
  /**
   * Error constructor
   *
   * @param message <string>
   * @param field <string>
   * @param numeric <int|string>
   */
  constructor(message, field, code) {
    // call super
    super(message);
    // set error name
    this.name = this.constructor.name;

    // set error code
    setErrorCode.call(this, code);
    // set field
    setErrorField.call(this, field);
    
    // capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * set validation
   *
   * @param message <message@string>
   * @param obj <object@json>
   */
  static setValidations(message = 'Validation error', obj) {
    // init exception
    let Obj = new this(message);
    // init validation
    Obj.validations = [];
    for (let field in obj) {
      // push each exception to validation
      Obj.validations.push(new this(obj[field], field));
    }

    // return exception
    return Obj;
  }
}

/**
 * set error code
 *
 * @param numeric <@int|string>
 */
function setErrorCode (code) {
  // if code is set
  if (code) {
    // init helper
    let helper = new Helpers(code);
    // if helper is integer
    if (helper.isInt(code)) {
      // set code 
      this.code = code;
      return;
    }
  }

  // else
  // default code is 500
  this.code = 500;
  return;
}

/**
 * set error field
 *
 * @param field <@string>
 */
function setErrorField (field) {
  // if field is set and not empty
  if (Helpers.isset(field)
      && Helpers.isStringNotEmpty(field)
      && typeof field === 'string') {
    // set error field
    this.field = field;
  }
}

