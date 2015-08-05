var mongoose = require('mongoose');
var Schema = mongoose.Schema;

conn_targ = mongoose.createConnection('mongodb://localhost/target');
conn_stopgo = mongoose.createConnection('mongodb://localhost/stopgo');

var Target = new Schema({
    timestamp: {type: String, required: true},
    email: {type: String, required: true},
    state: {type: String, required: true},
    content: {type: String, required: true}
});
var TargetModel = mongoose.model('Target', Target);

var Stop = new Schema({
    timestamp: {type: String, required: true},
    email: {type: String, required: true},
    state: {type: String, required: true},
    content: {type: String, required: true}
});
var StopModel = mongoose.model('Stop', Stop);

module.exports.TargetModel = TargetModel;
module.exports.StopModel = StopModel;

