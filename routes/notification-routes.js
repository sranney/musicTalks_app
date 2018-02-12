const router = require("express").Router();
const Band = require("../models/band.js");
const User = require("../models/user.js");
const GroupChat = require("../models/groupChat.js");
const authCheck = require("../server_functions/authCheck.js");

router.post("/emot/close",(req,res)=>{
    const {username,uuid} = req.body;
    User.findOne({username}).then(userObj=>{
        let {notifications} = userObj;

        notifications = notifications.filter(notification=>notification.uuid!==uuid);
        User.update({username:username},{$set:{notifications}}).then(result=>{
            console.log(result)
            res.send("notification closed");
        });
    });
});

router.post("/band/close",(req,res)=>{
    const {username,band} = req.body;
    User.findOne({username}).then(userObj=>{
        let {notifications} = userObj;

        notifications = notifications.filter(notification=>{
            if(notification.band){
                return notification.band !== band;
            } else {
                return true;
            }
        });
        User.update({username:username},{$set:{notifications}}).then(result=>{
            console.log(result)
            res.send("notification closed");
        });
    });
});

module.exports = router;