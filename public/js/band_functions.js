const addBandForm = document.querySelector(".add-form");
const addBandFormInputs = addBandForm.querySelectorAll(".form-input-row>.add-form-input,.form-input-row>.tooltip>.add-form-input");
const FavoriteToast = document.querySelector(".toast.toast-favorite");

const ShowFavoriteToast = (add)=> {
    FavoriteToast.classList.remove("hidden");
    FavoriteToast.classList.add("shown");
    add ? FavoriteToast.innerHTML = FavoriteToast.innerHTML + " and Added" : null;
    setTimeout(()=>{
        FavoriteToast.classList.add("hidden");
        FavoriteToast.classList.remove("shown");
        add ? FavoriteToast.innerHTML = FavoriteToast.innerHTML.replace(" and Added",""):null;     
    },3000);
}

addBandForm.addEventListener("submit",function(e){
    e.preventDefault();

    let BandObj = {};

    const values = [...addBandFormInputs].map(addBandFormInput=>{
        return addBandFormInput.value;
    });;
    const keys = [...addBandFormInputs].map(addBandFormInput=>{
        return addBandFormInput.getAttribute("name");
    });

    

    keys.forEach((key,indx)=> {
        BandObj[key] = values[indx];
    })

    socket.emit("add band",{BandObj,username});

    $.post("/bands/add",BandObj,(data)=>{console.log(data)});

    [...addBandFormInputs].forEach(addBandFormInput=>{
        return addBandFormInput.value = "";
    });

    
    AddBandModal.classList.add("hidden");
    Body.classList.remove("modal-open");

    createNewCard(BandObj,"favorite");

    ShowFavoriteToast("add");
});

const createNewCard = (BandObj,type)=>{
    const loc = window.location.pathname;
    const cardType = type === "favorite" || loc === "/bands/all" ? "flip" : "expandable";
    const newThumbnail = document.createElement("div");
    newThumbnail.classList.add(`thumbnail_${cardType}`);
    cardType === "expandable" ? newThumbnail.classList.add("shown"):null;
    
    const thumbnail_front = document.createElement("div");
    thumbnail_front.classList.add(`thumbnail_${cardType}_front`);
    thumbnail_front.style.backgroundImage = `url(${BandObj.thumbnail_url})`;
    if(type==="favorite"){
        const thumbnail_favorited = document.createElement("div");
        thumbnail_favorited.classList.add("thumbnail_favorited");
        const icon = document.createElement("span");
        icon.classList.add("mif-checkmark");
        thumbnail_favorited.appendChild(icon);
        thumbnail_front.appendChild(thumbnail_favorited);
    }
    newThumbnail.appendChild(thumbnail_front);

    const thumbnail_back = document.createElement("div");
    thumbnail_back.classList.add(`thumbnail_${cardType}_back`);
    const name = document.createElement("p");
    name.classList.add("thumbnail-name");
    name.textContent = BandObj.name;
    const genre = document.createElement("p");
    genre.classList.add("thumbnail-genre");
    genre.textContent = `${cardType==="flip" ? "Genre: ":""}${BandObj.genre}`;
    const fans = document.createElement("p");
    fans.classList.add("thumbnail-fans");
    fans.textContent = "Number of Fans: 1";
    thumbnail_back.appendChild(name);
    thumbnail_back.appendChild(genre);
    thumbnail_back.appendChild(fans);

    const thumbnail_links = document.createElement("div");
    thumbnail_links.classList.add("thumbnail-links");
    const chatBtn = document.createElement("div");
    chatBtn.classList.add("thumbnail-chat");
    chatBtn.setAttribute("data-name",BandObj.name);
    const icon_chat = document.createElement("span");
    icon_chat.classList.add("mif-bubbles");
    chatBtn.appendChild(icon_chat);
    const addBtn = document.createElement("div");
    addBtn.classList.add("thumbnail-add");
    type === "favorite" ? addBtn.classList.add("favorited"):null;
    const icon_add = document.createElement("span");
    icon_add.classList.add("mif-heart");
    addBtn.appendChild(icon_add);
    const discoverBtn = document.createElement("div");
    discoverBtn.classList.add("thumbnail-discover");
    const icon_discover = document.createElement("span");
    icon_discover.classList.add("mif-headphones");
    discoverBtn.appendChild(icon_discover);
    thumbnail_links.appendChild(chatBtn);
    thumbnail_links.appendChild(addBtn);
    thumbnail_links.appendChild(discoverBtn);
    thumbnail_back.appendChild(thumbnail_links);

    newThumbnail.appendChild(thumbnail_back);

    document.querySelector(`.thumbnail_container${type==="new"&&loc==="/home" ? "--recommendations":""}`).appendChild(newThumbnail);
    
    //get the card that was just added and add an event listener to it
    const addedThumbnail = document.querySelector(`.thumbnail_container${type==="new"&&loc==="/home" ? "--recommendations":""}`).querySelector(`.thumbnail_${cardType}:last-child`);
    //find the favorite button that was added to this thumbnail and add an event listener to it
    const newaddBtn = addedThumbnail.querySelector(".thumbnail-add");
    newaddBtn.addEventListener("click",addToFavorites);    

    //find the chat button that was added to this thumbnail and add an event listener to it
    const newchatBtn = addedThumbnail.querySelector(".thumbnail-chat");
    BandObj.name
    newchatBtn.addEventListener("click",function(){
        const {name} = this.dataset;
        const RoomName = name.replace(" ","_");
        window.location.href=`/group_chat/${RoomName}`;
    });

    //find the discover button that was added to this thumbnail and add an event listener to it
    const newdiscoverBtn = addedThumbnail.querySelector(".thumbnail-discover");

    const GoToBandDiscover = function(){
        const bandName = this.parentNode.querySelector(".thumbnail-chat").dataset.name;
        window.location.href=`/discover/${bandName.replace(" ","_")}`
    };

    newdiscoverBtn.addEventListener("click",GoToBandDiscover);

};

const AddBtns = document.querySelectorAll(".thumbnail-add");

//when button is clicked on existing card to add to favorites - sends data to server which sends data to database
//then creates a toast. if the band thumbnail was found in the recommendations section, then the code also moves the card from recommendations to favorites
function addToFavorites(){
    const {name} = this.querySelector("span").dataset;
    
    $.post("/bands/favorite",
            {name},
            data=>{
                console.log(data);
                //client side analysis of whether the band has already been favorited - this is also performed on the server-side
                if(!this.classList.contains("favorited")){
                    //if the band has not already been favorited by the user, then do the following
                    //add favorited to the favorite button
                    this.classList.add("favorited")
                    //show "favorite" toast
                    ShowFavoriteToast();
                    //change properties of thumbnail
                    const thumbnail_front = this.parentNode.parentNode.previousElementSibling;
                    const favorited = document.createElement("div");
                    //add "sticker" to show that the band has been favorited
                    favorited.classList.add("thumbnail_favorited");
                    const iconFontSpan = document.createElement("span");
                    iconFontSpan.classList.add("mif-checkmark");
                    favorited.appendChild(iconFontSpan);
                    thumbnail_front.appendChild(favorited);
                    const thumbnail_container = this.parentNode.parentNode.parentNode.parentNode;
                    const thumbnail = this.parentNode.parentNode.parentNode;
                    //if card was in recommendations box, do the following
                    if(thumbnail_container.classList.contains("thumbnail_container--recommendations")){
                        thumbnail.classList.remove("shown");
                        setTimeout(()=>{                            
                            thumbnail_container.removeChild(thumbnail);
                            thumbnail.classList.remove("thumbnail_expandable");
                            thumbnail.classList.add("thumbnail_flip");
                            const front_side = thumbnail.querySelector(".thumbnail_expandable_front");
                            front_side.classList.remove("thumbnail_expandable_front");
                            front_side.classList.add("thumbnail_flip_front");
                            const back_side = thumbnail.querySelector(".thumbnail_expandable_back");
                            back_side.classList.remove("thumbnail_expandable_back");
                            back_side.classList.add("thumbnail_flip_back");
                            const fansStat = document.createElement("p");
                            fansStat.classList.add("thumbnail-fans");
                            fansStat.textContent = `Number of Fans: ${data.fans.length+1}`;
                            back_side.appendChild(fansStat);
                            document.querySelector(".thumbnail_container").appendChild(thumbnail);
                            if(!thumbnail_container.querySelector(".thumbnail_expandable")){
                                const Greetings = document.querySelector(".greeting");
                                Greetings.textContent = Greetings.textContent.replace(" Here's some recommendations for you.","");
                            }
                        },300);
                    } else {
                        const FansStat = thumbnail.querySelector(".thumbnail-fans");
                        let numFans = FansStat.textContent.replace("Number of Fans: ","");
                        FansStat.textContent = `Number of Fans: ${parseInt(numFans)+1}`;
                    }
                }
            }
    );
}


[...AddBtns].forEach(AddBtn => {
    AddBtn.addEventListener("click",addToFavorites);
})

const ChatBtns = document.querySelectorAll(".thumbnail-chat");

ChatBtns.forEach(ChatBtn=>{
    ChatBtn.addEventListener("click",function(){
        const {name} = this.dataset;
        const RoomName = name.replace(" ","_");
        window.location.href=`/group_chat/${RoomName}`;
    })
})

//notifies everyone else that enjoys a certain genre other than the person that added the band to the site that the band has been added to the site
//because this person has not added the band, I am not adding the card as a favorite
socket.on(`new_band_${username}`,BandObj=>{
    createNewBandToast(BandObj);
    incrementNotifNumber();
    createNotification(BandObj);
    window.location.pathname === "/bands/all" || window.location.pathname === "/home" ? createNewCard(BandObj,"new"):null;
});

const createNewBandToast = (BandObj)=>{
    const newBandToast = document.createElement("div");
    newBandToast.classList.add("new-band-toast");
    newBandToast.classList.add("toast");
    const icon = document.createElement("i");
    icon.classList.add("fas");
    icon.classList.add("fa-music");
    newBandToast.appendChild(icon);
    const space = document.createTextNode("\u00A0");
    newBandToast.appendChild(space);
    const toastText = document.createElement("span");
    toastText.textContent = `New ${BandObj.genre} band: ${BandObj.name}`;
    newBandToast.appendChild(toastText);
    newBandToast.classList.add("shown");
    document.querySelector("body").appendChild(newBandToast);
    setTimeout(()=>document.querySelector("body").removeChild(newBandToast),3000);    
};

const incrementNotifNumber = () =>{
    const numNotifs = document.querySelector(".notif_numb");
    const number = numNotifs.textContent;
    numNotifs.textContent = parseInt(number) + 1;     
};

const createNotification = BandObj => {

    const notification = document.createElement("li");
    notification.classList.add("notification-card");
    notification.classList.add("notif-card-band");
    notification.setAttribute("data-band",BandObj.name);
    notification.setAttribute("data-type","newBand");
    notification.setAttribute("data-room",BandObj.room);
    
    const header = document.createElement("div");
    header.classList.add("notif-card-band-header");
    const header_content_1 = document.createElement("i");
    header_content_1.classList.add("fas");
    header_content_1.classList.add("fa-music");
    const header_content_2 = document.createElement("i");
    header_content_2.classList.add("fas");
    header_content_2.classList.add("fa-times");
    header.appendChild(header_content_1);
    header.appendChild(header_content_2);
    notification.appendChild(header);

    const notification_content = document.createElement("p");
    notification_content.textContent = `${BandObj.genre} band, ${BandObj.name}, has been added`;
    notification.appendChild(notification_content);

    const actionFooter = document.createElement("div");
    actionFooter.classList.add("notif-card-goTo");
    const actionFooterContent = document.createElement("i");
    actionFooterContent.classList.add("fas");
    actionFooterContent.classList.add("fa-arrow-right");
    actionFooter.appendChild(actionFooterContent);
    notification.appendChild(actionFooter);

    document.querySelector(".notif-menu").appendChild(notification);

};