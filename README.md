# Meta-API

Nodejs is used for the api
Expressjs is the framework we used for the nodejs its the most used framework for nodejs

To install, clone from this [repo](https://github.com/soycaringal/meta-api.git)

then npm install on you terminal under the root directory


## bin

Mostly used to handle HTTP and post listening

## boostrap

boostrap directory handles whitelisting/cors, environment handling,error handling, middlewares and routes

## config

declaring paths for easy and neat accessing directories,
services has the setup for databases credentials mostly and some of related accessing data, you can also declare on settings for environment and some info like authentications, auth ids and so on

## database

database dir is for migrations and seeders as we use knex js ( a sql query builder ). for more info check their site [knexjs](http://knexjs.org/)

## lib

using lib dir for helpers for global use of a function

## modules

modules directory where it handles the core of the project consist of:

index
Model - is used for fetching and handling validations 
Service - inherits Model but more commonly use creating, updates, and deleting data

## public

public can store local images, csv, or any file that ca be use for the project

## routes

routes is dedicated for every feature from module fetching items depends on the route user to visit

## app.js

all is initialized for nodejs
