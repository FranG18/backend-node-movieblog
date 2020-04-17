const mongoose=require('mongoose');

const Schema=mongoose.Schema;

var commentSchema=new Schema({
    movie:String,
    content:String,
    user:String,
});

module.exports=mongoose.model('Comment',commentSchema);