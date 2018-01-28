import "reflect-metadata";
import {createConnection} from "typeorm";
import * as Koa from "koa";
import * as Router from "koa-router";
import logger = require('koa-logger');
import convert = require('koa-convert');
import cors = require('koa-cors');
import json = require('koa-json');
import serve = require('koa-better-serve');
import * as koaCsrf from 'koa-csrf';

import {AppRoutes} from "./routes/routes";
import Config from './config/env/Env';
import appConfig from './config/app.config';

// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
createConnection().then(async connection => {

    // create koa app
    const app = new Koa();
    const router = new Router();
    app.use(convert(logger()));

    // cors requests
    app.use(convert(cors()));
    // transfer json
    app.use(convert(json()));

    //config app - set different modules and preferences
    let envCfg = new Config(process.env.NODE_ENV);
    appConfig(app, envCfg);

    // register all application routes
    AppRoutes.forEach(route => router[route.method](route.path, route.action));

    // run app
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.use(serve(__dirname + '/assets', '/assets'));

    // add the CSRF middleware
    app.use(new koaCsrf({
        invalidSessionSecretMessage: 'Invalid session secret',
        invalidSessionSecretStatusCode: 403,
        invalidTokenMessage: 'Invalid CSRF token',
        invalidTokenStatusCode: 403,
        excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
        disableQuery: false
    }));

    app.listen(envCfg.appPort);

    console.log(`Koa application is up and running on port ${envCfg.appPort}`);

}).catch(error => console.log("TypeORM connection error: ", error));