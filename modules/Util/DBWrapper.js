const Connect = require('./Connect');
const Helpers = require('./Helpers');

let trxConn = null;
let conn = null;
module.exports = class DBWrapper {
  constructor () {
    // everytime we init a model
    // we should reset connection
    Connect.reset();
    
    // set new connection
    conn = new Connect();

    // initialize query
    this.query = this.conn(this.table);
  }
  
  /**
   * get object primary
   */
  get primary () {
    // default primary is id
    return `${this.singular}_id`;
  }
  
  /**
   * get knex transaction
   *
   */
  get trx () {
    return trxConn;
  }
  
  /**
   * get database connection
   *
   */
  get conn () {
    return conn.connection;
  }
  
  /**
   * get object table
   */
  get table () {
    return this.plural;
  }

  /**
   * returns singular model name
   */
  get singular () {
    // models are named in singular form
    // so return lowercased model name
    return this.modelName.toLowerCase();
  }

  /**
   * returns model name
   */
  get modelName () {
    return this.constructor.name;
  }

  /**
   * return plural model name
   */
  get plural () {
    // get model name first
    let model = this.singular;
    // check last models last letter
    switch (model[model.length - 1])
    {
      // case y
      case 'y': // replace `y` with `ies`
      return `${model.substring(0, model.length - 1)}ies`;
      break;
      // case s
      case 's': // replace `s` with `es`
      return `${model.substring(0, model.length - 1)}es`;
      break;
      default: // else,  return as is
      return `${model}s`;
      
    }
  }

  /**
   * set transaction id
   *
   */
  transacting (trx) {
    trxConn = trx;
    return this;
  }
  
  /**
   * Start - WHERE wrappers
   * ------------------------------------------------------------------------------------
   */
  where(...args) {
    this.query.where(...args);
    
    return this;
  }
  
  whereNot(...args) {
    this.query.whereNot(...args);
    return this;
  }

  whereIn(...args) {
    this.query.whereIn(...args);
    return this;
  }
  
  whereNotIn(...args) {
    this.query.whereNotIn(...args);
    return this;
  }
  
  whereNull(...args) {
    this.query.whereNull(...args);
    return this;
  }

  whereNotNull(...args) {
    this.query.whereNotNull(...args);
    return this;
  }
  
  whereExists(...args) {
    this.query.whereExists(...args);
    return this;
  }
  
  whereNotExists(...args) {
    this.query.whereNotExists(...args);
    return this;
  }

  whereBetween(...args) {
    this.query.whereBetween(...args);
    return this;
  }
  
  whereNotBetween(...args) {
    this.query.whereNotBetween(...args);
    return this;
  }
  
  whereRaw(...args) {
    this.query.whereRaw(...args);
    return this;
  }

  orWhere(...args) {
    this.query.orWhere(...args);
    return this;
  }

  andWhere(...args) {
    this.query.andWhere(...args);
    return this;
  }
  
  /**
   * End - WHERE wrappers
   * ------------------------------------------------------------------------------------
   */

  /**
   * Start - JOINS wrappers
   *------------------------------------------------------------------------------------
   */
  innerJoin(...args) {
    this.query.innerJoin(...args);
    return this;
  }
  
  leftJoin(...args) {
    this.query.leftJoin(...args);
    return this;
  }

  leftOuterJoin(...args) {
    this.query.leftOuterJoin(...args);
    return this;
  }
  
  rightJoin(...args) {
    this.query.rightJoin(...args);
    return this;
  }
  
  rightOuterJoin(...args) {
    this.query.rightOuterJoin(...args);
    return this;
  }
  
  fullOuterJoin(...args) {
    this.query.fullOuterJoin(...args);
    return this;
  }
  
  crossJoin(...args) {
    this.query.crossJoin(...args);
    return this;
  }
  
  joinRaw(...args) {
    this.query.joinRaw(...args);
    return this;
  }
  
  /**
   * End - JOINS wrappers
   *------------------------------------------------------------------------------------
   */
  
  /**
   * Start - ON wrappers
   *------------------------------------------------------------------------------------
   */
  onIn(...args) {
    this.query.onIn(...args);
    return this;
  }
  
  onNotIn(...args) {
    this.query.onNotIn(...args);
    return this;
  }
  
  onNull(...args) {
    this.query.onNull(...args);
    return this;
  }
  
  onNotNull(...args) {
    this.query.onNotNull(...args);
    return this;
  }
  
  onExists(...args) {
    this.query.onExists(...args);
    return this;
  }
  
  onNotExists(...args) {
    this.query.onNotExists(...args);
    return this;
  }
  
  onBetween(...args) {
    this.query.onBetween(...args);
    return this;
  }
  
  onNotBetween(...args) {
    this.query.onNotBetween(...args);
    return this;
  }
  
  /**
   * End - ON wrappers
   *------------------------------------------------------------------------------------
   */
  
  /**
   * Start - Having wrappers
   *------------------------------------------------------------------------------------
   */
  having(...args) {
    this.query.having(...args);
    return this;
  }
  
  havingIn(...args) {
    this.query.havingIn(...args);
    return this;
  }
  
  havingNotIn(...args) {
    this.query.havingNotIn(...args);
    return this;
  }
  
  havingNull(...args) {
    this.query.havingNull(...args);
    return this;
  }
  
  havingNotNull(...args) {
    this.query.havingNotNull(...args);
    return this;
  }
  
  havingExists(...args) {
    this.query.havingExists(...args);
    return this;
  }
  
  havingNotExists(...args) {
    this.query.havingNotExists(...args);
    return this;
  }
  
  havingBetween(...args) {
    this.query.havingBetween(...args);
    return this;
  }
  
  havingNotBetween(...args) {
    this.query.havingNotBetween(...args);
    return this;
  }
  
  havingRaw(...args) {
    this.query.havingRaw(...args);
    return this;
  }
  
  /**
   * End - Having wrappers
   *------------------------------------------------------------------------------------
   */

  /**
   * Start - Miscellaneous wrappers
   *------------------------------------------------------------------------------------
   */
  distinct(...args) {
    this.query.distinct(...args);
    return this;
  }
  
  groupBy(...args) {
    this.query.groupBy(...args);
    return this;
  }
  
  groupByRaw(...args) {
    this.query.groupByRaw(...args);
    return this;
  }

  orderBy(...args) {
    this.query.orderBy(...args);
    return this;
  }

  orderByRaw(...args) {
    this.query.orderByRaw(...args);
    return this;
  }

  offset(...args) {
    this.query.offset(...args);
    return this;
  }

  limit(...args) {
    this.query.limit(...args);
    return this;
  }

  union(...args) {
    this.query.union(...args);
    return this;
  }

  unionAll(...args) {
    this.query.unionAll(...args);
    return this;
  }

  returning(...args) {
    this.query.returning(...args);
    return this;
  }
  
  select(...args) {
    this.query.select(...args);
    return this;
  }
  
  as(...args) {
    this.query.as(...args);
    return this;
  }
  
  columns(...args) {
    this.query.columns(...args);
    return this;
  }
  
  from(...args) {
    this.query.from(...args);
    return this;
  }

  into(...args) {
    this.query.into(...args);
    return this;
  }
  
  width(...args) {
    this.query.width(...args);
    return this;
  }
  
  widthRecursive(...args) {
    this.query.widthRecursive(...args);
    return this;
  }
  
  columnInfo(...args) {
    return this.query.columnInfo(...args);
  }
  
  count(...args) {
    return this.query.count(...args);
  }

  countDistinct(...args) {
    return this.query.countDistinct(...args);
  }

  destroy(...args) {
    return this.conn.destroy(...args);
  }
}
