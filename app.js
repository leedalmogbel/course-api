// Path Alias
require('module-alias/register');

// Dependencies
let express = require('express');
let app = express();

// Boostrap
const env = require('@bootstrap/env');
const error = require('@bootstrap/error');
const middleware = require('@bootstrap/middleware');
const route = require('@bootstrap/route');

// Env
env(app, express);
// 2. Middleware
middleware(app, express);
// 3. Route
route(app, express);
// 4. Error
error(app, express);

module.exports = app;
