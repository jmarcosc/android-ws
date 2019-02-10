module.exports = function (app) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var car = Schema({
        model: { type: String, required: true },
        fuel: { type: String, required: true },
        engine: { type: String, required: true },
        price: { type: String, required: true }
    });
    return mongoose.model('cars', car);
};