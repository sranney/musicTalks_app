const MsgBox = document.querySelector(".group_chat-messages");
const MsgForm = document.querySelector(".group_chat-form");
const MsgInput = document.querySelector(".group-chat-form-input");
const MsgHolders = document.querySelectorAll(".message-holder");

//for listening for new messages for a particular room and for creating a new message holder for new messages
function reaction_mod(emotions) {
    const ReactDiv = document.createElement("div");
    ReactDiv.classList.add("message-react");

    emotions.forEach(emotion=>{
        const tooltip = document.createElement("a");
        tooltip.classList.add("tooltip");
        const emot = document.createElement("i");
        emot.classList.add("icofont");
        emot.classList.add(emotion.icon);
        emot.setAttribute("data-emotion",emotion.emot);
        const tooltip_content = document.createElement("div");
        tooltip_content.textContent = emotion.emot;
        tooltip_content.classList.add("tooltip-content");
        tooltip.appendChild(emot);
        tooltip.appendChild(tooltip_content);
        ReactDiv.appendChild(tooltip);    
    });

    return ReactDiv;
}

socket.on(`new_message_${room}`,msg=>{
    const {photo_URL,dateTime, name, value, user,uuid} = msg;

    let messageType;

    if(value.indexOf("/embed/")>-1 && value.indexOf("youtube.com")>-1){
        messageType = "yt";
    } else if(value.indexOf("/embed/")>-1 && value.indexOf("open.spotify")>-1){
        messageType = "spot";
    }    

    const MsgHolder = document.createElement("div");
    MsgHolder.classList.add("message-holder");
    MsgHolder.setAttribute("data-uuid",uuid)
    const Img = document.createElement("div");
    Img.style.backgroundImage = `url(${photo_URL})`;
    Img.classList.add("message-photo");
    MsgHolder.appendChild(Img);
    const Title = document.createElement("div");
    Title.classList.add("message-title");
    const UserP = document.createElement("p");
    UserP.classList.add("message-sender");
    const DateP = document.createElement("p");
    DateP.classList.add("message-date");
    UserP.textContent = user;
    DateP.textContent = dateTime;
    Title.appendChild(UserP);
    Title.appendChild(DateP);
    MsgHolder.appendChild(Title);
    
    let MsgContent;
    if(!messageType){
        MsgContent = document.createElement("p");
        MsgContent.classList.add("message-text");
        MsgContent.textContent = value;
    } else if(messageType === "yt"){
        MsgContent = document.createElement("iframe");
        MsgContent.classList.add("YouTubeVid");
        MsgContent.setAttribute("src",value);
        MsgContent.setAttribute("frameborder","0");
        MsgContent.setAttribute("allow","autoplay; encrypted-media");
        MsgContent.setAttribute("allowfullscreen","");
    } else if(messageType === "spot"){
        MsgContent = document.createElement("iframe");
        MsgContent.classList.add("SpotifyPlayList");
        MsgContent.setAttribute("src",value);
        MsgContent.setAttribute("frameborder","0");
        MsgContent.setAttribute("allowtransparency","true");
        MsgContent.setAttribute("allow","autoplay; encrypted-media");
        MsgContent.setAttribute("allowfullscreen","");
    }

    MsgHolder.appendChild(MsgContent);


    const ReactDiv = reaction_mod([
                                    {icon:"icofont-emo-slightly-smile",emot:"Like"},
                                    {icon:"icofont-emo-rage",emot:"Angry"},
                                    {icon:"icofont-emo-heart-eyes",emot:"Love"},
                                    {icon:"icofont-emo-open-mouth",emot:"Surprise"},
                                    {icon:"icofont-emo-crying",emot:"Sad"}
                                ]);
    MsgHolder.appendChild(ReactDiv);
    const recordedEmotions = document.createElement("div")
    recordedEmotions.classList.add("reactions");
    MsgHolder.appendChild(recordedEmotions);
    MsgBox.appendChild(MsgHolder);
    const newMsgHolder = MsgBox.querySelector(".message-holder:last-child");
    const reactBtns = newMsgHolder.querySelectorAll(".tooltip [class^='icofont icofont-emo']");
    console.log(reactBtns);
    [...reactBtns].forEach(reactBtn=>reactBtn.addEventListener("click",emotClicked));
    MsgHolder.scrollTo();
})

MsgForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const dateTimeSerial = Date.now();

    const {value} = MsgInput;
    const {user} = ExtraDataInput.dataset;
    const uuid = `${room}-${user}-${dateTimeSerial}`;
    //to save message in database
    $.post("/group_chat/send",{room,value,uuid});
    socket.emit("new group message",{room,value,user,uuid});
    MsgInput.value = "";
})



function appendMessage(msg){
    var message = Mustache.render(template,{//use mustache rendering
        text:video,
        sender:data.from,
        userImage: data.image
    });
    $("#messages").append(message);//append new messages to the message section
};

const favoriteButton = document.querySelector(".group-chat-resources-btn>.mif-heart");

favoriteButton.addEventListener("click",function(){
    $.post("/bands/favorite",{name:room},(data)=>{
        this.parentNode.classList.add("favorited");
    });
});