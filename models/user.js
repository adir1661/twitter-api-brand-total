const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    userId: { type: String, unique: true, index: true, required:true },
    website: String,
    image: String,
    description: String,
    name: String,
    screenName: String,
});

module.exports = mongoose.model('User', userSchema);