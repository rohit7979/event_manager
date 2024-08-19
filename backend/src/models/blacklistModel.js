const {Schema,model} = require('mongoose');

const blacklistSchema = new Schema({
    token: {type: String, required: true},
   
});

const blacklistModel = model('tokenBlacklist', blacklistSchema)

module.exports = blacklistModel;