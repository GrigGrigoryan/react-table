const mongoose = require('mongoose');

let Users = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    photo_url: {
        type: String,
        default: 'http://www.cs.umd.edu/sites/default/files/default_images/user_icon.png'
    },
    date: {
        type: Date,
        default: Date.now()
    }
});



module.exports = mongoose.model('users', Users);

