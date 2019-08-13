const Model = require('./Model');
const Exception = require('./../Util/BaseException');
const Reference = require('@module/Reference/Model');

module.exports = class Service extends Model {
  /**
   * Class constructor
   */
  constructor () {
    super();

    // class constants and variables
    this.CREATE_FAILED = 'Create message failed.';
    this.UPDATE_FAILED = 'Update message failed.';
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
   * Create Message
   * 
   * @param {Object} data
   * @param {file} image
   */
  async createMessage (data) {
    // validate
    const errors = this.getCreateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        errors
      );
    }

    let message = Model.build(data);

    let msgObj = await message.save();

    // save message reference
    data.reference_message = msgObj.message_id;
    data.reference_from = msgObj.user_from;
    data.reference_to = msgObj.user_to;

    // create reference
    let reference = await Reference
    .service()
    .createReference(data);
    
    // return
    return msgObj;
  }

  /**
   * Update Message
   * 
   * @param {object} data
   */
  async updateMessage (data) {

    // validate fields
    const errors = this.getUpdateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(this.UPDATE_FAILED, errors);
    }

    // check if valid Message
    const valid = await this.getMessageById(data.message_id);
    if (!valid || Object.keys(valid).length === 0) {
      throw new Error('Invalid message.')
    }

    // init model
    let model = Model.build(data);

    // save message
    return model.update();
  }

  /**
   * Remove message
   *
   * @param id <integer>
   */
  remove(id) {
    let obj = {
      message_active: 0
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('message_id', id);
    } else {
      model.where('message_id', id);
    }

    // remove message
    return model.update();
  }

  /**
   * Restore message
   *
   * @param id <integer>
   */
  restore(id) {
    let obj = {
      message_active: 1
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('message_id', id);
    } else {
      model.where('message_id', id);
    }

    // remove message
    return model.update();
  }
}