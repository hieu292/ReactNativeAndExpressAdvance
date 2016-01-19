var mongoose = require('mongoose');
var config = require('../../config');

var Schema = mongoose.Schema;


var taskSchema = new Schema({
    nameTask: {type: String,required: true},
    completed: {type: Boolean, required: true, default: false}
});


module.exports = mongoose.model('Task', taskSchema);
