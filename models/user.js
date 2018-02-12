const mongoose = require("mongoose");
//define table structure with constraints for User collection
const userModel = mongoose.Schema({
    username: {type: String},//the username is formulated as the user's email up to @gmail.com - SomeGuy@gmail gets SomeGuy as the username
    email: {type: String},//email of user in google
    displayName: {type: String},//formal name of user in google profile
    googleId: {type:String},//id of user in google account
    photo_URL: {type:String},//url for user photo - will typically be google photo
    favoriteBands: {type: Array,default:[]},//simply the name of the band
    friends: {type:Array,default:[]},//username for the other user who you are friends with
    sentRequests: {type:Array,default:[]},//outstanding friend requests
    notifications: {type:Array,default:[]}//notifications from other users regarding received messages, friend requests, confirmed friend requests and in group chat, responses to your messages
})

//create the User model on the JS side that contains how to communicate to mongodb what collection and what data is being passed
const User= mongoose.model("User",userModel);

//export this model so it can be used elsewhere
module.exports = User;