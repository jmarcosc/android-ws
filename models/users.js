module.exports = function (app) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var user = Schema({
        email: { type: String, required: true },
        password: { type: String, required: true },
    });
    return mongoose.model('users', user);
};