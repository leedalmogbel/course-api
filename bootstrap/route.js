// Routers
const index = require('@routes/index');
const auth = require('@routes/auth');
const history = require('@routes/history');
const user = require('@routes/user');
const course = require('@routes/course');
const quiz = require('@routes/quiz');
const badge = require('@routes/badge');
const message = require('@routes/message');
const reference = require('@routes/reference');
const product = require('@routes/product');
const post = require('@routes/post');
const survey = require('@routes/survey');
const episode = require('@routes/episode');

/**
 * Bootstrap Route
 *
 * @param {Object} app
 * @param {Object} express
 */
module.exports = (app, express) => {
  app.use('/', index);
  app.use('/auth', auth);
  app.use('/history', history);
  app.use('/user', user);
  app.use('/course', course);
  app.use('/quiz', quiz);
  app.use('/badge', badge);
  app.use('/message', message);
  app.use('/reference', reference);
  app.use('/product', product);
  app.use('/post', post);
  app.use('/survey', survey);
  app.use('/episode', episode);
};