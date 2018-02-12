const express = require("express");
const authRoutes = require("./routes/auth-routes");
const homeRoutes = require("./routes/home-routes");
const bandRoutes = require("./routes/band-routes");
const notifRoutes = require("./routes/notification-routes");
const discoverRoutes = require("./routes/discover-routes");
const groupChatRoutes = require("./routes/group_chat-routes");
const app = express();
const passportSetup = require("./config/passport-setup.js");
const mongoose = require("mongoose");
const mongoose_connect = process.env.MONGODB_URI || "mongodb://localhost/music_talks_app";
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const socketIO = require("socket.io");
const moment = require("moment");
const User = require("./models/user");
const Band = require("./models/band");
const GroupChat = require("./models/groupChat");

//setup view engine
app.engine("handlebars", 
exphbs({ 
    defaultLayout: "main",
    partialsDir:[__dirname+"/views/partials"]
 }));//make the main.handlebars be the layout template
app.set("view engine","handlebars");//set the express view engine as handlebars

app.use(express.static("./public"));

//request parser middleware
app.use(bodyParser.urlencoded({extended:true}));

//cookies!
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["irisisthebestdog"]
}))

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
mongoose.connect(mongoose_connect,()=>{
    console.log("successfully connected to mongodb");
})

//set up routes
app.use("/auth",authRoutes);
app.use("/home",homeRoutes);
app.use("/bands",bandRoutes);
app.use("/group_chat",groupChatRoutes);
app.use("/notifs",notifRoutes);
app.use("/discover",discoverRoutes);

const pictures = require("./server_functions/img_list.js");

let chosenPics = [];
let remainingPics = [];
//I want a random order of the pictures to occur so that when the page is refreshed the images are in different locations and the images are different on each load
//I don't want repeat pictures to occur so this function will find a new image out of the collection of pictures to include every time that I render this page and if the image is already in the images-to-be-rendered array, it will pick a new one
const addPictureToArr = (picture)=> {
    if(chosenPics.indexOf(picture)==-1){//if the image chosen is not part of the array for to be rendered pictures
        chosenPics.push(picture);
        remainingPics = pictures.filter(picture=>{
            return chosenPics.indexOf(picture)===-1;
        })
    } else {//image already in the array, choose another image
        addPictureToArr(remainingPics[Math.floor(Math.random()*pictures.length)]);
    }
}

app.get("/",(req,res)=>{
    chosenPics=[];//reset this back to an empty array every time this is triggered

    //run this function 150 times to get 150 unique pictures in the chosenPics array 
    for (var i = 0 ; i < 170; i++){
        addPictureToArr(pictures[Math.floor(Math.random()*pictures.length)]);
    }

    //render the login content, with the chosenPics passed for the background images
    res.render("login",{IMGs:chosenPics,login:true});    
})

const server = require("http").createServer(app);
const io = socketIO(server);//setting up socket io on the above created server

let onlineUsersArr = [];
let typers = [];

io.on("connection",(socket)=>{

    //"room joined", "disconnect" and "logout" events are for handling online users
    //room joined is emitted from client every time that the user joins a different room
	socket.on("room joined",roomData=>{
        console.log(roomData);
        const socketId = socket.id;
        // console.log(`socketId: ${socketId}`);
        const {username,room} = roomData;
        let userData = onlineUsersArr.filter(userObj=>userObj.username===username);
        if(userData.length>0){
            userData = userData[0];
            if (userData.room !== room){
                io.emit(`leave_room_${userData.room}`,username);
                onlineUsersArr = onlineUsersArr.filter(userObj=>userObj.username!==username);
                onlineUsersArr.push({socketId,username,room});
            }
        } else {
            onlineUsersArr.push({socketId,username,room});
        }
        const onlineUsersArr_specificRoom = onlineUsersArr.filter(userObj=>userObj.room === room);
        io.emit(`room_users_${room}`,onlineUsersArr_specificRoom);
        io.emit(`site_users`,onlineUsersArr);
        // console.log(onlineUsersArr_specificRoom);    
	})

    //need a way to keep track of ALL connected sockets and who they belong to - should be a one-to-one relationship
    //but sometimes sockets can take some time to disconnect or they don't disconnect - it is not easy to determine when this will occur
    //because sockets should disconnect on every page refresh or closing of the browser but sometimes page refreshes do not yield this
    //creating an array labeled connectedSockets that will just connect users and all the sockets that are present for them
    //key will be socket and username will be value
    //on socket disconnects, will remove that socket from the array and will count the number of sockets that are left for the user associated with that socket
    //if there are 0 sockets left, will get room that that user was connected to and will emit a message to that room that the user has disconnected
    //and finally will remove the user from the onlineUsers object array
    
    ////////////////////////////////////////////////////DISCONNECTED SOCKETS - - - REMOVE DISCONNECTED SOCKETS////////////////////////////////////////////////////
    socket.on("disconnect", () => {
        
        const socketId = socket.id;
        //find the object in array onlineUsersArr that is associated with the socket that has disconnected
        //the data returned from the filter function is always in the form of an array, but each socket will be unique and will thus always return an array of length 1
        //so I'm pulling the object out of the array here as well, by stating that I want index 0
        const disconnectedUser = onlineUsersArr.filter(onlineUser => onlineUser.socketId === socketId)[0];
        //disconnectedUser contains socketId, username and room
        //I want to get the room to notify the room that the user was in that the user has disconnected and the username to specify who exactly left the room
        //truthy/falsy check
        if(disconnectedUser){
            const {room,username} = disconnectedUser;
            onlineUsersArr = onlineUsersArr.filter(onlineUser=>onlineUser.socketId !== socketId);
            io.emit(`leave_room_${room}`,username);
            const onlineUsersArr_specificRoom = onlineUsersArr.filter(userObj=>userObj.room === room);
            io.emit(`room_users_${room}`,onlineUsersArr_specificRoom);
            setTimeout(()=>io.emit(`site_users`,onlineUsersArr),500); 
        }
	})

    //group messages for musician chat rooms
    socket.on("new group message",grpMsg=>{
        console.log(grpMsg);
        let {room,value,user,uuid} = grpMsg;
        const dateTime = moment().format('MMMM Do YYYY, h:mm a');

        if(value.indexOf("watch?v=")>-1&&value.indexOf("youtube.com")>-1){
            value = value.replace("/watch?v=","/embed/");
        } else if(value.indexOf("youtu.be")>-1){
            value = value.replace("youtu.be/","www.youtube.com/embed/");
        } else if(value.indexOf("open.spotify")>-1 && value.indexOf("embed")===-1){
            value = value.replace("open.spotify.com/","open.spotify.com/embed/");
        }

        User.findOne({username:user}).then(userData=>{
            const {photo_URL} = userData;
            io.emit(`new_message_${room}`,{photo_URL,dateTime,value,user,uuid});
        })
    });

    //listening for typing events on the 
    socket.on("typing started",typerObj=>{
        const {room,user} = typerObj;
        console.log(`${user} is typing in room ${room}`)
        typers.push(typerObj);
        const roomTypers = typers.filter(typer=>typer.room===room);
        io.emit(`typers_${room}`,roomTypers.length);
    });

    socket.on("typing stopped",typerObj=>{
        const {room,user} = typerObj;
        console.log(`${user} stopped typing in room ${room}`);
        typers = typers.filter(typer=>typer.user!==user);
        const roomTypers = typers.filter(typer=>typer.room===room);
        io.emit(`typers_${room}`,roomTypers.length);
    });

    socket.on("react",emotObj=>{
        console.log(emotObj);
        const {room,msg_uuid,emot,reacter,sender,message} = emotObj;
        const message_abbr = message.length > 25 ? `${message.substr(0,25)}...` : message;
        const notification = `${reacter} responded to your message "${message_abbr}" in room '${room}'`;
        const room_db = room.replace("_"," ");
        const senderData = onlineUsersArr.filter(onlineUser=>onlineUser.username ===sender)[0];
        const sendasNotification = senderData.room !== room;
        const uuid = `${sender}-notification-${Date.now()}`; 
        const dateTime = moment().format('MMMM Do YYYY, h:mm a');  
        GroupChat.findOne({room:room_db}).then(roomMsgs=>{
            const {chats} = roomMsgs;
            let msgData = chats.map(chat=>{
                
                if(chat.uuid===msg_uuid){
                    if(chat.hasOwnProperty(emot)){
                        chat[emot] = chat[emot]+1;
                    } else {
                        chat[emot] = 1; 
                    }
                }
                return chat;
            });
            GroupChat.update({room:room_db},{$set:{chats:msgData}}).then(chats=>{
                io.emit(`react-${room}`,emotObj);
                const dateTime = moment().format('MMMM Do YYYY, h:mm a');
                sender !== reacter ? io.emit(`reaction_notification_${sender}`,{notification,room,emot,dateTime,sendasNotification,uuid}) : null;
            })
        });
        if(sendasNotification){
            console.log("setting notification in db - - - - ",sender);
            User.update({username:sender},{$push:{notifications:{notification,room,emot,dateTime,sendasNotification,uuid}}}).then(modData=>{
                console.log(modData);
            })
        }
    });

    socket.on("add band",addedBandInfo=>{
        const {BandObj,username} = addedBandInfo;
        let {genre} = BandObj;
        genre = `${genre.substr(0,1).toUpperCase()}${genre.substr(1)}`;
        Band.find({genre}).then(bands=>{
            //get unique users
            let distinctUsers = [];
            for(let i = 0 ; i<bands.length ; i++){
                for (let j = 0 ; j<bands[i].fans.length ; j++){
                    if(distinctUsers.indexOf(bands[i].fans[j])===-1 && bands[i].fans[j]!==username){
                        distinctUsers.push(bands[i].fans[j]);
                    }
                }
            }
            
            distinctUsers.forEach(user=>{
                const notification = {
                    type: "New Band Notification",
                    notification: `${BandObj.genre} Band, ${BandObj.name}, has been added`,
                    band: BandObj.name,
                    genre: BandObj.genre,
                    room: BandObj.name.replace(" ","_")
                };
                User.update({username: user},{$push:{notifications:notification}}).then(data=>{
                    io.emit(`new_band_${user}`,BandObj);
                });
            });
        });
    });
    
})

server.listen(process.env.PORT||5000);