// Config Services
const services = require('./config/services');

// Migration and Seed Config
const config = {
  migrations: {
    directory: './database/migrations'
  },
  seeds: {
    directory: './database/seeds'
  }
};

// Knex Environment Settings
module.exports = {
  development: {
    client: 'mysql',
    connection: services.mysql,
    migrations: config.migrations,
    seeds: config.seeds
  },
  staging: {
    client: 'mysql',
    connection: services.mysql,
    migrations: config.migrations,
    seeds: config.seeds
  },
  production: {
    client: 'mysql',
    connection: services.mysql,
    migrations: config.migrations,
    seeds: config.seeds
  }
};
