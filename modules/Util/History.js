const Mod    = require('@module/History');
const jwt      = require('jsonwebtoken');
const settings = require('@config/settings');

module.exports = class History {
  /**
   * Get Logs
   */
  static log (message = '', req) {
    let data = {};

    // parse jwt
    const user = jwt.verify(req.query.__token, settings.secret);

    data.history_log = message;
    data.history_remote_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // get clients ip
    data.history_user = user.userId;
    data.history_meta = {};

    return Mod.Model
      .service()
      .createHistory(data);
  }

}