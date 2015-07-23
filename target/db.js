var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/target');

var Target = new Schema({
    timestamp: {type: String, required: true},
    email: {type: String, required: true},
    state: {type: String, required: true},
    content: {type: String, required: true}
});

var TargetModel = mongoose.model('Target', Target);

module.exports.TargetModel = TargetModel;

