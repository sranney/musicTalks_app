const emotBtns = document.querySelectorAll(".tooltip [class^='icofont icofont-emo']");

//the uuids are unique for each of the messages - they are formed as room-username-datetime that it was sent down to millisecond

function emotClicked(event){
    //the emotion buttons are a few children elements deep from the container for the whole message and the uuid is at that level
    //so I need to go up a few parentNodes to get the uuid
    const thisMsgHolder = this.parentNode.parentNode.parentNode
    const msg_uuid = thisMsgHolder.dataset.uuid;
    const sender = thisMsgHolder.querySelector(".message-title .message-sender").textContent;
    const emotion = this.dataset.emotion;
    const messageEl = thisMsgHolder.querySelector(".message-text")
    const message = messageEl ? messageEl.textContent : "media message";
    const reacter = username;

    //emit to client information about the button click
    //room is set in a different js file - specifically the room_manager file
    socket.emit("react",{room,msg_uuid,emot:emotion,reacter,sender,message});
}

[...emotBtns].forEach(btn=>btn.addEventListener("click",emotClicked));

// document.querySelectorAll(".tooltip [class^='icofont icofont-emo']").addEventListener("click",emotClicked);

const formEmotItem = emot => {
    const EmotObj = {
                        Like:"icofont-emo-slightly-smile",
                        Angry:"icofont-emo-rage",
                        Love:"icofont-emo-heart-eyes",
                        Surprise:"icofont-emo-open-mouth",
                        Sad:"icofont-emo-crying"
                    };
    const parentSpan = document.createElement("span");
    parentSpan.classList.add("reaction");
    parentSpan.classList.add(`reaction-${emot}`);
    const icon = document.createElement("i");
    icon.classList.add("icofont");
    icon.classList.add(EmotObj[emot]);
    icon.setAttribute("data-emotion",emot);
    const times = document.createElement("i");
    times.classList.add("fas");
    times.classList.add("fa-times");
    const number = document.createElement("span");
    number.classList.add("number");
    number.textContent = 1;
    parentSpan.appendChild(icon);
    parentSpan.appendChild(document.createTextNode (" "));
    parentSpan.appendChild(times);
    parentSpan.appendChild(document.createTextNode (" "));
    parentSpan.appendChild(number);
    return parentSpan;
}

const updateEmotItem = (emot,reactions,MsgHolder) =>{
    let emotionUpdated = false;
    [...reactions].forEach(reaction=>{
        if(reaction.classList.contains(`reaction-${emot}`)){
            const number = reaction.querySelector(".number").textContent;
            reaction.querySelector(".number").textContent = parseInt(number)+1;
            emotionUpdated = true;
        }
    });
    if(!emotionUpdated){
        const reactionsContainer = MsgHolder.querySelector(".reactions");        
        const emotItem = formEmotItem(emot);
        reactionsContainer.appendChild(emotItem);        
    } else {
        return true;
    }
}

//socket listener for picking up reactions for each of the individual rooms that are passed to client from server
//this is the response to one of the button clicks above which send information from the client to the server
//
socket.on(`react-${room}`,emotObj=>{

    const {room,msg_uuid,emot} = emotObj;
    const MsgHolders = document.querySelectorAll(".message-holder");
    [...MsgHolders].forEach(MsgHolder => {
        if(MsgHolder.dataset.uuid === msg_uuid){
            const reactionsContainer = MsgHolder.querySelector(".reactions");
            const reactions = reactionsContainer.querySelectorAll(".reaction");
            if(reactions.length===0){
                const emotItem = formEmotItem(emot);
                reactionsContainer.appendChild(emotItem);
            } else {
                updateEmotItem(emot,reactions,MsgHolder);
            }
        }
    })
})

