// Dependencies
const createError = require('http-errors');

/**
 * Bootstrap Error
 * 
 * @param {Object} app 
 * @param {Object} express 
 */
module.exports = (app, express) => {
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set status code
    res.status(err.status || 500);

    // init new response object
    let response = {
      error: true
    };

    // add error message
    if ('message' in err && err.message) {
      response.message = err.message;
    }

    // add validations
    if ('validations' in err && err.validations) {
      response.validations = [];

      // format validation message
      for (let i in err.validations) {
        let field = err.validations[i];
        field.msg = err.validations[i].message;

        // push validation field
        response.validations.push(field);
      }
    }

    // send error object
    res.send(response);
  });
};