// Routers
const index = require('@routes/index');
const auth = require('@routes/auth');
const category = require('@routes/category');
const page = require('@routes/page');
const product = require('@routes/product');
const promotion = require('@routes/promotion');
const template = require('@routes/template');
const history = require('@routes/history');
const user = require('@routes/user');
const brand = require('@routes/brand');

/**
 * Bootstrap Route
 *
 * @param {Object} app
 * @param {Object} express
 */
module.exports = (app, express) => {
  app.use('/', index);
  app.use('/auth', auth);
  app.use('/category', category);
  app.use('/page', page);
  app.use('/product', product);
  app.use('/promotion', promotion);
  app.use('/template', template);
  app.use('/history', history);
  app.use('/user', user);
  app.use('/brand', brand);
};