// end settings
// mongo settings if required (FOR SESSIONS STORE)
const port = 3000;
const dbURI = 'mongodb://localhost:27017';
const mongoose = require('mongoose');

export default class Config {
    public HOST = 'http://127.0.0.1';
    public appPort = port;
    dbURI = dbURI;

    constructor(env) {
        this.HOST = 'http://35.196.161.18';
        this.dbURI = dbURI;
        this.appPort = env == 'production' ? 80 : port;
    }

    // monggo for session store
    dbConnect(dbToBeConnected) {
        console.log('connecting to MongoDB...' + this.dbURI + '/' + dbToBeConnected);
        let db = null;
        db = mongoose.connection.openUri(this.dbURI + dbToBeConnected, {
            useMongoClient: true
        }).then(
            (err, db) => {
                console.log('Connected to mongo server. ');
                return db;
            });
    }
}
