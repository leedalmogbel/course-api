const BaseUtil = require('./Base');
const Helpers = require('./Helpers');
const BaseException = require('./BaseException');

/**
 * @author Clark Galgo <clark@dev-engine.net>
 * Object Builder
 */
module.exports = class Builder extends BaseUtil {

  /**
   * build model object
   *
   * @param objJson <object@json>
   * @param model <string>
   *
   * @return Object <object@Model>
   */
  static buildObjectModel(objJson, model) {
    let Model = require(`./../${model}`).Model;

    try {
      return buildObjectFromJson(objJson, new Model());
    } catch (err) {
      throw new BaseException(err);
    }
  }
};

/**
 * Build Object from json value
 */
var buildObjectFromJson = function (objJson, Model) {
  // validate values
  if (typeof objJson !== 'object') {
    throw 'Invalid object values';
  }

  // loop thru columns
  for(let i in objJson) {
    let value = objJson[i];
    // check value is set
    if (typeof value == 'undefined') {
      // if value is not set,
      // proceed next
      continue;
    }

    let helper = new Helpers(value);
    if (typeof value == 'string') {
      try {
        value = JSON.parse(value);
      } catch (err) {}
    }
    
    Model[i] = value;
  }

  return Model;
};
