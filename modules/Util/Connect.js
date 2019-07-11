const config = require('./../../knexfile');
const knex = require('knex');

let conn = null;

module.exports = class Connect {
  constructor (env) {
    if (conn == null) {
      // store to connection to private variable
      conn = typeof env == 'undefined' || !env ? knex(config[require('./../../config/settings').env]) : knex(env);
    }

    this.query = null;
  }

  get connection () {
    return conn;
  }

  static reset () {
    this.query = null;
  }
}
