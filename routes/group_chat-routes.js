const moment = require("moment");
const router = require("express").Router();
const Band = require("../models/band.js");
const User = require("../models/user.js");
const GroupChat = require("../models/groupChat.js");
const authCheck = require("../server_functions/authCheck.js");

router.get("/:room",authCheck,(req,res)=>{
    let {room} = req.params;
    const currentUser = req.user.username;
    const {favoriteBands,notifications} = req.user;
    const numNotifs = notifications.length;
    noNotifications = numNotifs === 0;
    const notifications_forDisplay = notifications.map(notification=>{
        if(notification.emot === "Like"){
            notification.icon = "icofont-emo-slightly-smile";
        } else if(notification.emot === "Angry"){
            notification.icon = "icofont-emo-rage";
        } else if(notification.emot === "Love"){
            notification.icon = "icofont-emo-heart-eyes";
        } else if(notification.emot === "Surprise"){
            notification.icon = "icofont-emo-open-mouth";
        } else if(notification.emot === "Sad"){
            notification.icon = "icofont-emo-crying";
        }
        return notification;
    })
    
    room = room.replace("_"," ");
    const isFan = req.user.favoriteBands.indexOf(room)>-1;
    console.log(isFan);
    //get messages for this room
    GroupChat.findOne({room}).then(chats=>{
        if(chats){
            let messages = chats.chats;
            messages = messages.map(messageObj=>{
                const {message} = messageObj;

                if(message.indexOf("/embed/")>-1 && message.indexOf("youtube.com")>-1){
                    messageObj.isYouTube = true;
                } else if(message.indexOf("/embed/")>-1 && message.indexOf("open.spotify")>-1){
                    messageObj.isSpotify = true;
                }
                return messageObj;
            });
            console.log(messages);
            Band.findOne({name:room}).then(bandData=>{    
                const {cover_url,name,genre,fans,spotify} = bandData;
                const validSpotifyURL = spotify.indexOf("open.spotify.com")>-1;
                const numFans = fans.length;
                res.render("groupChat",
                            {
                                groupChat:true,
                                messages,
                                favoriteBands,
                                notifications_forDisplay,
                                noNotifications,
                                numNotifs,
                                cover_url,
                                currentUser,
                                name,
                                genre,
                                fans,
                                numFans,
                                isFan,
                                spotify,
                                validSpotifyURL
                            });
            }).catch(err=>console.log);
        } else {
            res.redirect("/bands/all");
        }
    })
})

router.post("/send",authCheck,(req,res)=>{
    let {room,value,uuid} = req.body;

    if(value.indexOf("watch?v=")>-1&&value.indexOf("youtube.com")>-1){
        value = value.replace("/watch?v=","/embed/");
    } else if(value.indexOf("youtu.be")>-1){
        value = value.replace("youtu.be/","www.youtube.com/embed/");
    } else if(value.indexOf("open.spotify")>-1 && value.indexOf("embed")===-1){
        value = value.replace("open.spotify.com/","open.spotify.com/embed/");
    }

    const message = value;
    const {username,photo_URL} = req.user;
    const dateTime = moment().format('MMMM Do YYYY, h:mm a');
    room = room.replace("_"," ");
    GroupChat.update({room},{$push:{chats:{message,username,photo_URL,dateTime,uuid}}}).then((chats)=>{
        const room_path = room.replace(" ","_");

    });
})

module.exports = router;