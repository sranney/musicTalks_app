const router = require("express").Router();
const Band = require("../models/band.js");
const authCheck = require("../server_functions/authCheck.js");
const wikipedia = require("node-wikipedia");

const getWikiAndRender = (band,req,res,currentUser,noNotifications,notifications_forDisplay,numNotifs,specific)=>{

    wikipedia.page.data(band.name,{content:true},function(response){
        console.log(response);
        let externalLinks = response.externallinks;
        externalLinks = externalLinks.map((link,indx)=>{

            if(link.substr(link.length-1)=="/"){
                return link.substr(0,link.length-1);
            }
            return link;
        })
        externalLinks = externalLinks.filter((link,indx)=>{
            return externalLinks.indexOf(link)===indx;      
        });
        externalLinks = externalLinks.map((link)=>{
            if(link.length>50){
                return {link:link,display:`${link.substr(0,50)}...`};
            } else {
                return {link:link,display:link};
            }
        });

        var body = response.text["*"];
        var bio = body.replace(body.substr(0,body.indexOf("<p")),"").replace(/<.*?>/g,"");
        bio = bio.replace(bio.substr(bio.indexOf("Contents")),"").trim();
        bio = bio.replace("\n","<br>");
        
        const validSpotifyURL = band.spotify.indexOf("open.spotify.com")>-1;
        const isFan = req.user.favoriteBands.indexOf(band.name)>-1;
        res.render("discover",{
                                band,
                                validSpotifyURL,
                                isFan,
                                externalLinks,
                                bio,
                                discover:true,
                                currentUser,
                                noNotifications,
                                notifications_forDisplay,
                                numNotifs,
                                specific                          
                            }
                );
    });
}

const getInfoTogether = (req,res,band)=>{
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
    if(!band){
        Band.find({}).then(bands=>{
            const band = bands[Math.floor(Math.random()*bands.length)];
            getWikiAndRender(band,req,res,currentUser,noNotifications,notifications_forDisplay,numNotifs,false);
        })
    } else {
        Band.findOne({name:band}).then(bandObj=>{
            getWikiAndRender(bandObj,req,res,currentUser,noNotifications,notifications_forDisplay,numNotifs,true);
        });
    }
}

router.get("/",authCheck,(req,res)=>{
    getInfoTogether(req,res);
});

router.get("/:bandName",authCheck,(req,res)=>{
    console.log("here");
    const bandName = req.params.bandName;
    const band = bandName.replace("_"," ");
    getInfoTogether(req,res,band,true);
});

module.exports = router;