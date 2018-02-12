const Band = require("../models/band.js");
const GroupChat = require("../models/groupChat.js");
const User = require("../models/user.js");

const moment = require("moment");

module.exports = (socket,io,onlineUsersArr,connectedSockets)=>{

    console.log("*************************************\n*************************************\n*************************************\n*************************************\n");    
    console.log("initial state of online users array\n",onlineUsersArr)
    console.log("*************************************\n*************************************\n*************************************\n*************************************\n");

    //"room joined", "disconnect" and "logout" events are for handling online users
    //room joined is emitted from client every time that the user joins a different room
	socket.on("room joined",roomData=>{
        console.log("*************************************\n*************************************\n*************************************\n*************************************\n");
        console.log("online users array before join room function ran");
        console.log(onlineUsersArr);
        console.log("*************************************\n*************************************\n*************************************\n*************************************\n");
        const socketId = socket.id;
        // console.log(`socketId: ${socketId}`);
        const {username,room} = roomData;
        console.log("room",room);
        console.log("*************************************\n*************************************\n*************************************\n*************************************\n");
        let userData = onlineUsersArr.filter(userObj=>userObj.username===username);
        if(userData.length>0){
            userData = userData[0];
            console.log("*************************************\n*************************************\n*************************************\n*************************************\n");
            console.log("userData",userData);
            console.log("*************************************\n*************************************\n*************************************\n*************************************\n");
            if (userData.room !== room){
                console.log("room change detected");
                io.emit(`leave_room_${userData.room}`,username);
                onlineUsersArr = onlineUsersArr.filter(userObj=>userObj.username!==username);
                onlineUsersArr.push({socketId,username,room});
                console.log("*************************************\n*************************************\n*************************************\n*************************************\n");
                console.log("online users array before join room function ran");
                console.log(onlineUsersArr);
                console.log("*************************************\n*************************************\n*************************************\n*************************************\n");                
            } else {
                console.log("*************************************\n*************************************\n*************************************\n*************************************\n");
                console.log("no difference detected");
                console.log("*************************************\n*************************************\n*************************************\n*************************************\n");
                console.log(onlineUsersArr);
                console.log("*************************************\n*************************************\n*************************************\n*************************************\n");
            }
        } else {
            console.log("no user with username here");
            onlineUsersArr.push({socketId,username,room});
            console.log("*************************************\n*************************************\n*************************************\n*************************************\n");
            console.log("online users array before join room function ran");
            console.log(onlineUsersArr);
            console.log("*************************************\n*************************************\n*************************************\n*************************************\n");
        }
        const onlineUsersArr_specificRoom = onlineUsersArr.filter(userObj=>userObj.room === room);
        io.emit(`room_users_${room}`,onlineUsersArr_specificRoom); 
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
        console.log("**********************************\n*****************************************\n*****************************************");
        console.log("disconnected socket");
        console.log(disconnectedUser);
        console.log("**********************************\n*****************************************\n*****************************************");
        //disconnectedUser contains socketId, username and room
        //I want to get the room to notify the room that the user was in that the user has disconnected and the username to specify who exactly left the room
        //truthy/falsy check
        if(disconnectedUser){
            console.log("**********************************\n*****************************************\n*****************************************");
            console.log("online users array before disconnect",onlineUsersArr);
            console.log("**********************************\n*****************************************\n*****************************************");
            const {room,username} = disconnectedUser;
            onlineUsersArr = onlineUsersArr.filter(onlineUser=>onlineUser.socketId !== socketId);
            console.log("**********************************\n*****************************************\n*****************************************");
            console.log("online users array after disconnect",onlineUsersArr);
            console.log("**********************************\n*****************************************\n*****************************************");
            io.emit(`leave_room_${room}`,username);
            const onlineUsersArr_specificRoom = onlineUsersArr.filter(userObj=>userObj.room === room);
            io.emit(`room_users_${room}`,onlineUsersArr_specificRoom); 
        }
	})

	// //when a user clicks the logout button, an emit is sent from client to server
	// socket.on("logout",user => {

	// 	onlineUsersArr = onlineUsersArr.filter(user=>{
	// 		return user.email !==email;
	// 	})
	// 	const onlineUsers_userdata = onlineUsersArr.map(user=>{
	// 		const {username,email} = user;
	// 		return {username,email};
	// 	})
	// 	io.emit( "user connected" , onlineUsers_userdata );	

	// })    

    //group messages for musician chat rooms
    socket.on("new group message",grpMsg=>{
        console.log(grpMsg);
        let {room,value,user} = grpMsg;
        const dateTime = moment().format('MMMM Do YYYY, h:mm a');
        User.findOne({username:user}).then(userData=>{
            const {photo_URL} = userData;
            io.emit(`new_message_${room}`,{photo_URL,dateTime,value,user});
        })
    });

}