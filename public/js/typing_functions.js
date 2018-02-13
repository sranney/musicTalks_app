const typers = document.querySelector(".peopleTyping>.number");

let currentTyping = false;
let typingCheckTime;
const {user} = ExtraDataInput.dataset;

//function for setting currentTyping to true and sets a timer for setting it back to false

const TypingDetected = ()=>{
    //on every key up, update this value to be now
    typingCheckTime = Date.now();
    //only want to check once per time spent typing, not on every key up event
    if(!currentTyping){
        currentTyping = true;
        socket.emit("typing started",{room,user});
        //start incremental checks on typing - will check every 400 milliseconds
        //check will determine if the time at the time of the check is greater than 400 milliseconds larger than the last detected key up
        //in other words, has 400 milliseconds passed since the last keyup
        //this is an acceptable range for determining whether the user has stopped typing
        const clearID = setInterval(()=>{
            if(Date.now() > typingCheckTime+400){
                socket.emit("typing stopped",{room,user});
                currentTyping = false;
                clearInterval(clearID);
            }
        },400);        
    }
}

MsgInput.addEventListener("keydown",TypingDetected);

socket.on(`typers_${room}`,numTypers =>{
    typers.textContent = numTypers;
})