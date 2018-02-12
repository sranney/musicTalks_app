// let chartData=[];

// google.charts.load('current', {packages: ['corechart', 'bar']});
// google.charts.setOnLoadCallback(drawBasic);

// function drawBasic() {

//     var data = google.visualization.arrayToDataTable(chartData);

//     var options = {
//     title: 'Online Users',
//     chartArea: {width: '25%'},
//     hAxis: {
//         title: 'Number Users',
//         minValue: 0
//     },
//     vAxis: {
//         title: 'Room'
//     }
//     };

//     var chart = new google.visualization.BarChart(document.getElementById('chartContainer'));

//     chart.draw(data, options);
// }

const socket = io();
const room = window.location.pathname.indexOf("home")>-1 ? 
                "home" 
            : 
                window.location.pathname === "/bands/all" ? 
                    "allBands" 
                : 
                    window.location.pathname === "/discover" ?
                        "discover"
                    :
                        window.location.pathname.split("/")[2]
            ;

console.log(room);
const ExtraDataInput = document.querySelector("input[type='hidden']");
const username = ExtraDataInput.dataset.user;
const onlineUserSection = document.querySelector(".group_chat-onlinebandUsers");
const allOnlineUserSection = document.querySelector(".onlineUsers_list");

const createOnlineUserCards = (onlineUsers) =>{
    const onlineUsers_cards = document.querySelectorAll(".onlineUser");
    [...onlineUsers_cards].forEach(onlineUser=>onlineUser.parentNode.removeChild(onlineUser));
    for (let onlineUser of onlineUsers){
        const onlineUserCard = document.createElement("div");
        onlineUserCard.classList.add("onlineUser");
        onlineUserCard.textContent = onlineUser.username;
        onlineUserSection.appendChild(onlineUserCard);
    }
};


//for signaling to server that a user has joined a room
socket.emit("room joined",{username,room});

//for when a user changes room, or exits for whatever other reason
socket.on(`leave_room_${room}`,username=>{
    console.log(username);
});

socket.on("site_users",onlineUsers=>{
    const numUsers = onlineUsers.length;
    document.querySelector(".onlineUsers_numb").textContent = numUsers;
    
    const onlineUsers_cards = allOnlineUserSection.querySelectorAll(".onlineUser");
    [...onlineUsers_cards].forEach(onlineUser=>onlineUser.parentNode.removeChild(onlineUser));
    for (let onlineUser of onlineUsers){
        const onlineUserCard = document.createElement("div");
        onlineUserCard.classList.add("onlineUser");
        const username_span = document.createElement("span");
        username_span.classList.add("onlineUser-card-username");
        username_span.textContent = onlineUser.username;
        const room_span = document.createElement("span");
        room_span.classList.add("onlineUser-card-room");
        room_span.textContent = onlineUser.room==="home" || onlineUser.room==="allBands" ? onlineUser.room : onlineUser.room.replace("_", " ");
        
        onlineUserCard.appendChild(username_span);
        onlineUserCard.appendChild(room_span);

        allOnlineUserSection.appendChild(onlineUserCard);
    }
    //sum up all users in specific rooms
    // updateChart(onlineUsers);
})

//for when a user first joins a room - will get the whole list of users in room
socket.on(`room_users_${room}`,onlineUsers=>{
    window.location.pathname.indexOf("group_chat") >-1 ? createOnlineUserCards(onlineUsers) : null;
});

updateChart = (onlineUsers)=>{
    chartData=[];
    chartData.push(['room', 'numUsers']);
    onlineUsers.forEach(onlineUser=>{
        let inChartData = false;
        for (let i = 0; i<chartData.length; i++){
            if(chartData[i][0]===onlineUser.room){
                chartData[i][1] = chartData[i][1]+1;
                inChartData = true;
            }
        }
        if(!inChartData){
            chartData.push([onlineUser.room,1]);
        }
        return chartData;
    });
    drawBasic();
}