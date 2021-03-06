const mongoose = require('mongoose');
const { Schema } = mongoose;

const memeSchema = new Schema({
    id : String,
    name: {type: String, required: true},
    url: {type: String, required: true},
    caption: {type: String, required: true},
    time_stamp: {type: Number, required: true, index: true}
});

module.exports = memeSchema;