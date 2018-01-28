'use strict';
// config of mongodb for using as session store
const mongoose = require('mongoose');
import Config from './env/Env';

// bluebird promises
mongoose.Promise = require('bluebird');

const envCfg = new Config(process.env.NODE_ENV);
// MongoDB
export default async () => {
    let db: any;
    try {
        db = await envCfg.dbConnect('todo');
    }
    catch (e) {
        console.log(e);
    }
    return db;
};