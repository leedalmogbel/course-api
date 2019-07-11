const config = require('./../../knexfile');
const knex = require('knex');
const Helpers = require('./Helpers');
const Connect = require('./Connect');
const DBWrapper = require('./DBWrapper');
const DBException = require('./DBException');
const moment = require('moment');

/**
 * @author Clark Galgo <clark@dev-engine.net>
 */
module.exports = class DB extends DBWrapper {
  constructor (primary) {
    super();
    
    if (primary) {
      this[this.primary] = primary;
    }
  }

  /**
   * returns models service
   */
  static service () {
    let Obj = new this();
    // get model name first
    let model = Obj.modelName;
    // require service
    let Service = require(`./../${model}`).Service;
    // if no service
    if (!Service || typeof Service == 'undefined') {
      // throw exception
      throw DBException.serviceNotFound(model);
    }

    // init service
    let service = new Service();
    
    return service;
  }

  /**
   * build object from json
   *
   * @param obj <object@json>
   */
  static build (obj) {
    let Model = new this();
    // require builder
    const Builder = require('./../Util/Builder');
    // build object
    return Builder.buildObjectModel(obj, Model.modelName);
  }

  /**
   * has many relation
   *
   * @param obj <string>
   * @param column <string>
   * @param field <string|null>
   */
  hasMany (obj, column, field) {
    field = field || this.primary;

    // check if object field is set
    if (typeof this[field] == 'undefined' || !this[field]) {
      // return empty object
      return {};
    }
    
    let Obj = require(`./../${obj}`).Model;
    let object = new Obj();

    return object.where(column, this[field]);
  }

  /**
   * has one relation
   *
   * @param obj <string>
   * @param column <string>
   * @param field <string>
   */
  hasOne (obj, column, field) {
    // include object
    let Obj = require(`./../${obj}`).Model;
    // check if field is already an instance of object
    if (typeof this[field] == 'object' && this[field] instanceof Obj) {
      // return field as is
      return this[field];
    }

    // if field is not set
    if (typeof this[field] == 'undefined' || !this[field]) {
      // return null
      return null;
    }

    // init object
    let object = new Obj();
    
    return object.where(column, this[field]);
  }
  
  /**
   * get object columns
   *
   */
  async getObjectColumns () {
    // check if columns is set and columns is a valid object
    if (typeof this.OBJ_COLUMNS !== 'object') {
      let info = await this.columnInfo();
      let columns = [];

      for (let col in info) {
        columns.push(col);
      }
      
      return columns;
      
    }

    return this.OBJ_COLUMNS;
  }

  /**
   * update database
   *
   * @param criteria <object|string>Z
   */
  async update () {
    this.into(this.table);
    // compose settings from object
    let settings = await composeSettings.call(this);
    // if there is no settings
    if (settings.length < 1) {
      throw new DBException('Nothing to update');
    }

    if (this[this.primary] != null && typeof this[this.primary] != 'undefined') {
      this.where(this.primary, this[this.primary]);
    }
    
    // call update
    return update.call(this, settings);
  }

  /**
   * save object to database
   *
   * @param trx <function|null>
   */
  save (trx) {
    if (trx) {
      this.transacting(trx);
    }

    this.into(this.table);
    
    // if primary is set
    if (this[this.primary] == null) {
      // call insert
      return insert.call(this);
    } else {
      let primary = this.primary;
      // else, update using primary as criteria
      this.where(primary, this[this.primary]);
      // update
      return this.update();
    }
  }

  /**
   * get raw json value
   *
   * @return settings <object@json>
   */
  async toRawJson () {
    // compose settings
    let settings = await composeSettings.call(this);
    for (i in settings) {
      let helper = new Helpers(settings[i]);
      if (helper.isJson()) {
        settings[i] = JSON.parse(settings[i]);
      }
    }
    
    // if primary is set
    if (typeof this.primary != 'undefined' && typeof this[this.primary]) {
      // push primary to settings
      settings[this.primary] = this[this.primary];
    }

    return settings;
  }

  /**
   * find one data from database
   *
   */
  async findOne (raw) {
    raw = raw ? true : false; 
    this.from(this.table);

    // if primary is set
    if (this[this.primary]) {
      // filter by primary
      this.query = this.query.where(this.primary, this[this.primary]);
    }
    
    try {
      // get data from database by primary
      let row = await this.query.first();
      // if row is empty
      if (row == null || row.length < 1) {
        // return empty object
        return {};
      }

      // if raw, return as is
      if (raw) {
        return row;
      }

      let model = require(`./../${this.modelName}/`).Model;
      // return
      row = model.build(row);
      delete row.query;
      return row;
    } catch (err) {
      throw new DBException(err);
    }
  }

  /**
   * find from database
   *
   */
  async find (raw) {
    raw = raw ? true : false; 
    this.from(this.table);

    try {
      // get data from database by primary
      const rows = await this.query;
      // if row is empty
      if (rows == null || rows.length < 1) {
        // return empty object
        return [];
      }

      // if raw, return as is
      if (raw) {
        return rows;
      }

      let model = require(`./../${this.modelName}/`).Model;
      let collection = [];
      for(let i in rows) {
        // build object and push to collection
        let row = model.build(rows[i]);
        delete row.query;
        collection.push(row);
      }

      // return collection
      return collection;
    } catch (err) {
      throw new DBException(err);
    }
  }

  /**
   * returns findOne
   */
  get (...args) {
    return this.findOne(...args);
  }

  /**
   * returns find
   */
  all (...args) {
    return this.find(...args);
  }
};

/** 
 * update database
 *
 * @param criteria <object|string>
 */
async function update (settings) {
  // if updated at is not set
  if (typeof settings[`${this.singluar}_updated`] == 'undefined' || !settings[`${this.singular}_updated`]) {
    // get time stamp now from helper
    settings[`${this.singular}_updated`] = Helpers.timeStampNow();
  }

  let setting = {};
  // remove undefined and null values
  for(let key in settings) {
    // push settings if there is value
    if (typeof settings[key] == 'undefined'
        || settings[key] == 'null'
       ) {
      
      continue;
    }

    // push to setting
    setting[key] = settings[key];
  }

  try {
    // if query is null
    // init query
    if (this.query == null) {
      this.query = this.conn(this.table);
    }
    
    // if self.trx is set, this means this is a transaction query
    if (typeof this.trx != 'undefined' && this.trx) {
      // set transaction
      this.query = this.query.transacting(this.trx);
    }

    // exec query
    let res = await this.query.update(setting);
    // return result
    return res;
  } catch (err) {
    throw new DBException(err);
  }
}
/**
 * insert to database
 *
 */
async function insert () {
  // preserve this to self
  var self = this;
  // compose settings from object
  let settings = await composeSettings.call(self);

  // if created at is not set
  if (typeof settings[`${this.singular}_created`] == 'undefined' || !settings[`${this.singular}_created`]) {
    // get time stamp now from helper
    settings[`${this.singular}_created`] = Helpers.timeStampNow();
  }

  // if updated at is not set
  if (typeof settings[`${this.singular}_updated`] == 'undefined' || !settings[`${this.singular}_updated`]) {
    // get time stamp now from helper
    settings[`${this.singular}_updated`] = Helpers.timeStampNow();
  }
  
  try {
    // insert to database
    if (self.query == null) {
      self.query = self.conn(self.table);
    }
    
    // if self.trx is set, this means this is a transaction query
    if (typeof this.trx != 'undefined' && this.trx) {
      // set transaction
      self.query = self.query.transacting(this.trx);
    }

    // wait insert
    let res = await self.query.insert([settings]);
    // push primary to self
    self[self.primary] = res[0];
    delete self.query;
    // return self
    return self;
  } catch (err) {
    // if trx is set
    if (typeof self.trx != 'undefined' && self.trx) {
      // rollback transaction
      self.trx.rollback();
    }
    
    // destroy connection
    this.conn.destroy();
    
    // throw error if we catch something
    throw new DBException(err);
  }
}

/**
 * compose settings from object
 *
 * @return settings <object @json>
 */
async function composeSettings () {
  // get object columns
  let columns = await this.getObjectColumns();
  // init settings
  let settings = {};
  
  // loop through columns
  for (let i in columns) {
    // get value from object
    let val = this[columns[i]];
    // if value is object and has primary
    if (typeof val == 'object' && val != null && typeof val.primary != 'undefined') {
      // get primary value
      val = val[val.primary];
    }
    
    // init helper
    let helper = new Helpers(val);
    // check if value is json
    if (helper.isJson()) {
      // stringify json
      val = JSON.stringify(val);
    }

    // if value is empty use null
    if (val === '') {
      val = null;
    }

    // push value to settings
    settings[columns[i]] = val;
  }

  // return settings
  return settings;
};
