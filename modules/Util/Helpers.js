const BaseUtil = require('./Base');
const md5 = require('md5');
const slugify = require('slugify');

/**
 * @author Clark Galgo <clark@dev-engine.net>
 * Base Util
 */
module.exports = class Helpers extends BaseUtil {
  /**
   * @param val <string|integer|float>
   */
  constructor (val) {
    super(val);
  }

  /**
   * Check if value is float
   */
  isFloat (val) {
    this.val = val || this.val;
    if (!this.isNumeric()) {
      return false;
    }
    
    return Number(parseFloat(this.val)) === parseFloat(this.val) && parseFloat(this.val) % 1 !== 0;
  }

  /**
   * Check if value is integer
   */
  isInt (val) {
    this.val = val || this.val;
    if (!this.isNumeric(this.val)) {
      return false;
    }
    
    return Number(parseInt(this.val)) === +parseInt(this.val) && parseInt(this.val) % 1 === 0;
  }

  /**
   * Check value if valid number
   */
  isNumeric (val) {
    this.val = val || this.val;
    return this.val.toString().match(/^((\d)+\.(\d+)|\d+)$/) ? true : false;
  }

  /**
   * Capitalize first letter
   */
  ucwords (val) {
    this.val = val || this.val;
    
    // check if value is a string
    if (typeof this.val !== 'string') {
      throw Error('Value is not a string');
    }

    return this.val.toLowerCase().replace(/\b[a-z]/g, function(letter) {
      return letter.toUpperCase();
    });
  }

  /**
   * is json
   */
  isJson (val) {
    this.val = val || this.val;
    // if value is object	
    if (typeof this.val == 'object') {	
      // stringify it first	
      val = JSON.stringify(this.val);	
    }

    // try to parse it
    try {
      JSON.parse(val);
    } catch (e) {
      // if error,
      // value is not json and return false
      return false;
    }

    // value is json
    return true;
  }

  /**	
   * check if valid json string	
   */	
  isJsonString (val) {	
    this.val = val || this.val;	

    try {	
      JSON.parse(this.val);	
    } catch (e) {	
      return false;	
    }	

    return true;	
  }

  isValidTimeStamp (val) {
    this.val = val || this.val;
    // regex timestamp
    return this.val.match(/^\d\d\d\d\-\d\d\-\d\d \d\d\:\d\d\:\d\d$/);
  }

  /**
   * date format time stamp
   */
  static timeStampNow () {
    // init date
    var d = new Date();
    // get date
    var dd = d.getDate();
    // get month
    var mm = d.getMonth() + 1;
    // get full year
    var yyyy = d.getFullYear();

    // get seconds
    var ss = d.getSeconds();
    // get minutes
    var min = d.getMinutes();
    // get hour
    var hh = d.getHours();

    // add 0 if value is less than 10
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    if (ss < 10) {
      ss = '0' + ss;
    }

    if (min < 10) {
      min = '0' + min;
    }
  
    if (hh < 10) {
      hh = '0' + hh;
    }
  
    // return timestamp format
    return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
  }

  /**
   * check if email is valid
   */
  static isValidEmail (email) {
    // regex for email format
    return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) ? true : false;
  }

  /**
   * is set
   */
  static isset (str) {
    if (!str || typeof str == 'undefined') {
      return false;
    }

    return true;
  }

  /**
   * check if field is not empty return boolean
   */
  static isStringNotEmpty (str) {
    if (str == '' || str.trim() === '') {
      return false;
    }
    return true;
  }
  
  /**
   * generate slug based of string
   * 
   * @param val <string>
   */
  static slugify (val) {
    this.val = val || this.val;

    // return generated slug
    return slugify(this.val, {
      lower: true
    });
  }

  /**
   * typecast object data values
   * 
   * @param val <string>
   */
  typeCastData (data) {
    // iterate through data values
    for (let i in data) {
      if (data[i] !== '') {
        // parse float
        if (this.isFloat(data[i])) {
          data[i] = parseFloat(data[i]);
        }
        
        // parse int
        if (this.isInt(data[i])) {
          data[i] = parseInt(data[i]);
        }

        // parse json
        if (this.isJsonString(data[i])) {
          data[i] = JSON.parse(data[i]);
        // if empty object
        } else if (data[i] === '{}') {
          data[i] = {};

        // if empty array
        } else if (data[i] === '[]') {
          data[i] = [];
        }
      }
    }

    return data;
  }
}
