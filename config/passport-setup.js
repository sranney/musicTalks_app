const {ClientID,ClientSecret} = process.env.GoogleClientID || require("../../secrets/google_cred_musictalksapp.js");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user.js");
const ProfileParser = require("../server_functions/ProfileParser.js");

passport.serializeUser((user,done)=>{
    console.log("serialize user function called");
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null, user);
    })
});

passport.use(
    new GoogleStrategy(
        {//options for google strategy
            callbackURL:"/auth/redirect",
            //authenticate use of the api by passing the generated api key and secret
            clientID: ClientID,
            clientSecret: ClientSecret         
        },
        (accessToken,refreshToken,profile,done)=>{
            console.log("passport callback function called");
        //passport callback function
            User.findOne({googleId: profile.id}).then((currentUser)=>{
                console.log("inside first db query");
                if(currentUser){
                    console.log("user is",currentUser);
                    done(null,currentUser);
                } else {
                    const UserData = ProfileParser(profile);
                    console.log(UserData);
                    new User(UserData)
                        .save().then(newUser=>{
                            console.log("new user created: ",newUser);
                            done(null,newUser);
                        });
                }
            }).catch(err=>console.log(err));

        }
    ))