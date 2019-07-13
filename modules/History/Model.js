const Helpers = require('../Util/Helpers');
const DB = require('../Util/DB');

module.exports = class History extends DB {
  /**
   * Search history
   * 
   * @param {object} data
   */
  searchHistory (data = {}) {
    let filter = {};
    let range = 10;
    let start = 0;
    let order = {};

    // add filters
    if ('filters' in data
      && data.filters
      && Object.keys(data.filters).length > 0) {

      this.where(data.filters);
    }

    // add limit
    if ('range' in data && data.range) {
      range = parseInt(data.range);
    }

    // get q for data
    if ('q' in data) {
      data.q.history_search = '%' + data.q.history_search + '%';
      this.andWhere(function () {
        this.where('history_log', 'like', data.q.history_search)
          .orWhere('history_remote_ip', 'like', data.q.history_search)
          .orWhere('history_user', 'like', data.q.history_search)
      })
    }

    // add offset
    if ('start' in data && data.start) {
      start = parseInt(data.start);
    }

    // for pagination
    this
      .limit(range)
      .offset(start);

    // get all
    return this
  }
}