'use strict';
import convert = require('koa-convert');
import session = require('koa-session');
// import MongoStore = require('koa-generic-session-mongo');
import * as bodyParser from "koa-bodyparser";
import passport = require('koa-passport');
import auth from './auth/auth';

export default (app, envCfg) => {

    // if you want use session instead of jwt
    // app.keys = ['secret-todo-one', 'secret-todo-two'];
    // required for passport session
    // app.use(convert(session({
    //     store: new MongoStore({
    //         url: `${envCfg.dbURI}/passport`,
    //         collection: 'sessions'
    //     })
    // }, app)));

    app.use(bodyParser());
    app.use(passport.initialize());
    app.use(passport.session());

    //activate auth configuration
    auth();

};