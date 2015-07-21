var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/target');

var Target = new Schema({
    email: {type: String, required: true},
    age: {type: String, required: true},
    gender: {type: String, required: true},
    rank: {type: String, required: true},
    content: {type: String, required: true}
});

var TargetModel = mongoose.model('Target', Target);

module.exports.TargetModel = TargetModel;

