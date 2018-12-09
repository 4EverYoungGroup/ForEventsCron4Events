'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;

//DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) 
//is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;

conn.on('error', err => {
    console.log('Error!', err);
    process.exit(1);
});
conn.once('open',() => {
    console.log(`Conectado a MongoDB en ${mongoose.connection.name}`);
})

mongoose.connect('mongodb://localhost/forEvents', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);


module.exports = conn;