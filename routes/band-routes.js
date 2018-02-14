const router = require("express").Router();
const Band = require("../models/band.js");
const User = require("../models/user.js");
const GroupChat = require("../models/groupChat.js");
const authCheck = require("../server_functions/authCheck.js");

const markFavorites = (dataArr,username) => {
    return dataArr.map(band=>{
        const {fans,name,genre,spotify,cover_url,thumbnail_url} = band;
        const fanOf = fans.indexOf(username)!==-1;
        const band_mod = {fans,name,genre,spotify,cover_url,thumbnail_url,fanOf};
        return band_mod;
    })
}

router.post("/add",authCheck,(req,res)=>{
    let {username} = req.user;

    let BandObj = req.body;


    Band.findOne({name:BandObj.name}).then(result=>{
        console.log(result);
        if(!result){
            if(BandObj.spotify.indexOf("embed")===-1){
                BandObj.spotify = BandObj.spotify.replace("open.spotify.com","open.spotify.com/embed");
            }
            BandObj.fans = [username];
            const {genre} = BandObj;
            BandObj.genre = `${genre.substr(0,1).toUpperCase()}${genre.substr(1)}`;
            const {name} = BandObj
            User.update({username},{$push:{favoriteBands:BandObj.name}}).then((data)=>{
                console.log(data);
                new GroupChat({room:name})
                .save().then(GroupChatRoom=>{
                    new Band(BandObj)
                    .save().then(newBand=>{
                        console.log("new band created: ",newBand);
                    });
                });
            });
        }
    })
})

router.get("/all",authCheck,(req,res)=>{
    const {username,notifications} = req.user;
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
    });    
    const currentUser = username;
    Band.find({}).then((bands)=>{
        bands = markFavorites(bands,currentUser);
        res.render("allBands",{user:req.user,
                                noNotifications,
                                notifications_forDisplay,
                                numNotifs,
                                currentUser,
                                bands,
                                allBands:true
                            });
    })
})

router.get("/search",authCheck,(req,res)=>{
    res.redirect("/home");
})

router.post("/search",authCheck,(req,res)=>{
    const {username,notifications} = req.user;
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
    });    
    const currentUser = username;
    console.log(req.body);
    const {body} = req;

    //making the search case insensitive
    const query = "genre" in body ? 
        //req.body contains name of band
        {
            genre: {$regex: new RegExp(`^${body.genre}$`,"i")}
        }
    :
        {
            name: {$regex: new RegExp(`^${body.name}$`,"i")}
        }
    ;

    Band.find(query).then((bands)=>{
        res.render("search",{
                                user:req.user,
                                currentUser,
                                numNotifs,
                                noNotifications,
                                notifications_forDisplay,
                                bands,
                                search:true});
    })
})

router.post("/favorite",authCheck,(req,res)=>{
    const {username} = req.user;
    let {name} = req.body;
    name = name.indexOf("_")>-1 ? name.replace("_"," ") : name;
    User.update({username},{$addToSet:{favoriteBands:name}}).then((data)=>{
        console.log(data);
        Band.update({name},{$addToSet:{fans:username}}).then((data2)=>{
            console.log(data2);
            res.send("band added to favorites");
        });
    });
})

module.exports = router;