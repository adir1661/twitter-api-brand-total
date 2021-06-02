const mongoose = require('mongoose'); 
const commentSchema  = mongoose.Schema({
    postId:{ type: String, index: true, unique:true, required:true },
    isPost:Boolean,
    converstionId:String,
    text:String,
    createdAt: Date,
    likes:Number,
    quotes:Number,
    replies:Number,
    retweets:Number,
    user: {
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
    },
});
module.exports = mongoose.model('Comment',commentSchema );