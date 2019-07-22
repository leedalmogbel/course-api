const cors = require('cors');
const settings = require('./../config/settings');

// set whitelist of origin urls
const whitelist = [settings.app_url, settings.admin_url];

// cors options check for valid origin
// based on whitelist
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Request not allowed'));
    }
  }
};

module.exports = cors(corsOptions);