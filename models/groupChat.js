const mongoose = require("mongoose");
//define table structure with constraints for Band collection
const groupChatModel = mongoose.Schema({
    room: {type:String},//url for spotify playlist
    chats: {type:Array,default:[]},//url for band thumbnail photo
})

//create the Band model on the JS side that contains how to communicate to mongodb what collection and what data is being passed
const GroupChat = mongoose.model("groupChat",groupChatModel);

//export this model so it can be used elsewhere
module.exports = GroupChat;