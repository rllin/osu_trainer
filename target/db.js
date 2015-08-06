var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//db = mongoose.connect('mongodb://localhost/target_second');
dbTarg = mongoose.createConnection('mongodb://127.0.0.1/target_second');
dbStop = mongoose.createConnection('mongodb://127.0.0.1/stopgo');

dbTarg.on("open", function(ref) {console.log("Connected to mongo server Target collection.");});
dbTarg.on("error", function(err) {console.log("Could not connect to mongo server Target collection!");});
dbStop.on("open", function(ref) {console.log("Connected to mongo server Stop collection.");});
dbStop.on("error", function(err) {console.log("Could not connect to mongo server Stop collection!");});

var Target = new Schema({
    timestamp: {type: String, required: true},
    email: {type: String, required: true},
    state: {type: String, required: true},
    content: {type: String, required: true}
});
var TargetModel = dbTarg.model('Target', Target);
//var TargetModel = mongoose.model('Target', Target);

var Stop = new Schema({
    timestamp: {type: String, required: true},
    email: {type: String, required: true},
    state: {type: String, required: true},
    content: {type: Object, required: true}
});
var StopModel = dbStop.model('Stop', Stop);

module.exports.TargetModel = TargetModel;
module.exports.StopModel = StopModel;

