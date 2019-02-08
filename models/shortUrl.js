//Require mongoose
const mongoose = require('mongoose');

//Template/structure/model of document for shortUrl
//creates a timestamp of when it was created
const Schema = mongoose.Schema;
const urlSchema = new Schema({
    originalUrl: String,
    shorterUrl: String
}, {timestamps: true});

//model(tableName, structure)
const ModelClass = mongoose.model('shortUrl', urlSchema);

//allows us to access this in our node app.js
module.exports = ModelClass;