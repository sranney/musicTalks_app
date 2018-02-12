const mongoose = require("mongoose");
//define table structure with constraints for Band collection
const bandModel = mongoose.Schema({
    spotify: {type:String},//url for spotify playlist
    cover_url: {type:String},//url for band thumbnail photo
    thumbnail_url: {type:String},//url for band cover photo
    fans: {type: Array,default:[]},//simply the usernames of fans
    name: {type:String},//name of band
    genre: {type:String}//genre of band
})

//create the Band model on the JS side that contains how to communicate to mongodb what collection and what data is being passed
const Band= mongoose.model("Band",bandModel);

//export this model so it can be used elsewhere
module.exports = Band;