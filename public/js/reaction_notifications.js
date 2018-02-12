const adjustNotifToasts = ()=>{
    let notification_toasts = document.querySelectorAll(".notification_toast");

    const num_toasts = notification_toasts.length;
    if(num_toasts===4){
        document.querySelector("body").removeChild(notification_toasts[0]);
        notification_toasts = document.querySelectorAll(".notification_toast");
        num_toasts--;
    }

    [...notification_toasts].forEach((notification_toast,idx)=>{
        notification_toast.classList.add("collapsed");
        if(idx===0){
            if(num_toasts===1){
                notification_toast.style.top=(25+19+5)+"vh";
            } else if (num_toasts === 2){
                notification_toast.style.top=(25+19+15+5)+"vh";
            } else if (num_toasts === 3){
                notification_toast.style.top=(25+19+15+15+5)+"vh";
            }
        } else if(idx===1){
            if (num_toasts === 2){
                notification_toast.style.top=(25+19+5)+"vh";
            } else if (num_toasts === 3){
                notification_toast.style.top=(25+19+15+5)+"vh";
            }                
        } else if(idx===2){
            notification_toast.style.top=(25+19+5)+"vh";
        }
       
    })
}

const determineIcon = (emot)=>{
    if(emot==="Like"){
        return "icofont-emo-slightly-smile";
    } else if (emot==="Angry"){
        return "icofont-emo-rage";
    } else if (emot==="Love"){
        return "icofont-emo-heart-eyes";
    } else if (emot==="Surprise"){
        return "icofont-emo-open-mouth";
    } else if (emot==="Sad"){
        return "icofont-emo-crying";
    }
}

const createNotifToast = (notification,dateTime,emot,icon)=>{
    const notification_toast = document.createElement("div");
    notification_toast.classList.add("notification_toast");
    const notification_text = document.createElement("p");
    notification_text.textContent = notification;
    notification_toast.appendChild(notification_text);
    const notification_dateTime = document.createElement("p");
    notification_dateTime.textContent = dateTime;
    notification_dateTime.classList.add("notification_dateTime");
    notification_toast.appendChild(notification_dateTime);    
    const notification_header = document.createElement("div");
    notification_header.classList.add("notification_toast-header");
    notification_header.textContent = `Reaction: ${emot}`;
    const separator = document.createElement("hr");
    const notification_icon = document.createElement("i");
    notification_icon.classList.add("icofont");
    notification_icon.classList.add(icon);
    notification_toast.appendChild(separator);
    notification_toast.appendChild(notification_icon);
    notification_toast.appendChild(notification_header);
    return notification_toast;
}

const createEmotNotif = (notification,room,emot,dateTime,sendasNotification,uuid)=>{

    const emotNotifCard = document.createElement("li");
    emotNotifCard.classList.add("notification-card");
    emotNotifCard.classList.add("notif-card-emot");
    emotNotifCard.setAttribute("data-uuid",uuid);
    emotNotifCard.setAttribute("data-type","emot");
    emotNotifCard.setAttribute("data-room","room");

    const dateTimeContainer = document.createElement("div");
    dateTimeContainer.classList.add("notif-card-dateTime");
    dateTimeContainer.textContent = dateTime;
    emotNotifCard.appendChild(dateTimeContainer);

    const header = document.createElement("div");
    header.classList.add("notif-card-emot-header");
    const icon = document.createElement("i");
    icon.classList.add("icofont");
    icon.classList.add(determineIcon(emot));
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas");
    closeIcon.classList.add("fa-times");
    header.appendChild(icon);
    header.appendChild(closeIcon);
    emotNotifCard.appendChild(header);

    const notificationContent = document.createElement("p");
    notificationContent.textContent = notification;
    emotNotifCard.appendChild(notificationContent);

    const action = document.createElement("div");
    action.classList.add("notif-card-goTo");
    const actionIcon = document.createElement("i");
    actionIcon.classList.add("fas");
    actionIcon.classList.add("fa-arrow-right");
    action.appendChild(actionIcon);
    emotNotifCard.appendChild(action);
    document.querySelector(".notif-menu").appendChild(emotNotifCard);

}

socket.on(`reaction_notification_${username}`,notificationInfo=>{
    console.log("here");
    const numNotifs = document.querySelector(".notif_numb");
    const number = numNotifs.textContent;
    numNotifs.textContent = parseInt(number) + 1;
    adjustNotifToasts();
    
    let {notification,room,emot,dateTime,sendasNotification,uuid} = notificationInfo;
    room = room.replace("_"," ");
    const icon = determineIcon(emot);

    const notification_toast = createNotifToast(notification,dateTime,emot,icon);

    document.querySelector("body").appendChild(notification_toast);

    createEmotNotif(notification,room,emot,dateTime,sendasNotification,uuid);
    

    setTimeout(()=>{
        document.querySelector("body").removeChild(notification_toast);
    },5000);
})