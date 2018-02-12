const router = require("express").Router();
const Band = require("../models/band.js");
const User = require("../models/user.js");
const authCheck = require("../server_functions/authCheck.js");

router.get("/",authCheck,(req,res)=>{
    const {username,favoriteBands,notifications} = req.user;
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

    const noFavorites = favoriteBands.length === 0;
        //get any band that has user as a fan
        //if the user has no favorites then show the allbands template and tell them that they have no favorites and to pick some
    noFavorites ?
        Band.find({}).then(bands=>{    
            res.render("allBands",{
                                    user:req.user,
                                    notifications_forDisplay,
                                    noNotifications,
                                    numNotifs,
                                    currentUser:req.user.username,
                                    bands,
                                    allBands:true,
                                    redirected:true})
        })
    :
        Band.find({fans:username}).then(favorites=>{
            //form arrays for genres and names that are already favorited
            const favoriteBands = favorites.map(favorite=>{
                const {name,genre,thumbnail_url,fans} = favorite;
                const numFans = fans.length;
                return {name,genre,thumbnail_url,numFans};
            })
            const genres = favorites.map(favorite=>favorite.genre);
            const names = favorites.map(favorite=>favorite.name);

            //now get recommendations based on genre of music that the user's favorite bands play
            //genres is an array so I am matching to get any bands that are not already favorited
            Band.find({$and: [{genre: {$in: genres}},{name: {$nin:names}}]}).then(recommendations=>{
                const hasRecs = recommendations.length > 0;
                res.render("home",{
                                    user:req.user,
                                    notifications_forDisplay,
                                    noNotifications,
                                    numNotifs,
                                    currentUser:req.user.username,
                                    home:true,
                                    favoriteBands,
                                    recommendations, 
                                    hasRecs
                                }
                            );
            })
        })
    ;
});

module.exports = router;