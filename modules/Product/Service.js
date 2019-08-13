const Model = require('./Model');
const Exception = require('./../Util/BaseException');

module.exports = class Service extends Model {
  /**
   * Class constructor
   */
  constructor () {
    super();

    // class constants and variables
    this.CREATE_FAILED = 'Create product failed.';
    this.UPDATE_FAILED = 'Update product failed.';
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
   * Create Product
   * 
   * @param {Object} data
   * @param {file} image
   */
  async createProduct (data, image) {
    // validate
    const errors = this.getCreateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        errors
      );
    }

    // check if Product exist
    let exists = await this.getProductByTitle(data.product_title);

    // throw error if title already exists
    if (Object.keys(exists).length > 0) {
      throw Exception.setValidations(
        this.CREATE_FAILED,
        { product_title: 'Title already exists'}
      );
    }

    let model = Model.build(data);
    
    // return
    return model.save();
  }

  /**
   * Update Product
   * 
   * @param {object} data
   * @param {file} image
   */
  async updateProduct (data, image) {

    // validate fields
    const errors = this.getUpdateErrors(data);
    if (Object.keys(errors).length > 0) {
      throw Exception.setValidations(this.UPDATE_FAILED, errors);
    }

    // check if valid Product
    const valid = await this.getProductById(data.product_id);
    if (!valid || Object.keys(valid).length === 0) {
      throw new Error('Invalid product.')
    }

    // init model
    let model = Model.build(data);

    // save product
    return model.update();
  }

  /**
   * Remove product
   *
   * @param id <integer>
   */
  remove(id) {
    let obj = {
      product_active: 0
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('product_id', id);
    } else {
      model.where('product_id', id);
    }

    // remove product
    return model.update();
  }

  /**
   * Restore product
   *
   * @param id <integer>
   */
  restore(id) {
    let obj = {
      product_active: 1
    };

    // init model
    let model = Model.build(obj);

    // bulk remove?
    if (Array.isArray(id)) {
      model.whereIn('product_id', id);
    } else {
      model.where('product_id', id);
    }

    // remove product
    return model.update();
  }
}