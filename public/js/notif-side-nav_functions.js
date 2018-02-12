const sideNavClose = document.querySelectorAll(".side-nav-close");
const CardList = document.querySelector(".notif-menu");
const numNotifs = document.querySelector(".notif_numb");

closeSideNav = function(){
    const sideNavOverlay = this.parentNode.parentNode;
    const sideNavContent = this.parentNode;
    sideNavContent.classList.add("hidden");
    setTimeout(()=>{
        sideNavOverlay.classList.add("hidden");
        document.querySelector("body").classList.remove("sideNav-open");
    },2500)
};

[...sideNavClose].forEach(sideNavClose=>sideNavClose.addEventListener("click",closeSideNav));

const EmotCardCloseBtns = document.querySelectorAll(".notif-card-emot-header>.fas");
const EmotCardGoToBtns = document.querySelectorAll(".notif-card-emot>.notif-card-goTo");

closeEmotNotification = function(){
    const emotCard = this.parentNode.parentNode;
    const {uuid} = emotCard.dataset;
    $.post("/notifs/emot/close",{uuid,username});
    emotCard.style.transform = "scale(0.01)";
    const numberOfNotifs = numNotifs.textContent;
    numNotifs.textContent = parseInt(numberOfNotifs) - 1;
    setTimeout(()=>CardList.removeChild(emotCard),300);
};

goToNotification_Emot = function(){
    const emotCard = this.parentNode;
    const {uuid,room} = emotCard.dataset;
    $.post("/notifs/emot/close",{uuid,username},()=>{
        emotCard.style.transform = "scale(0.01)";
        const numberOfNotifs = numNotifs.textContent;
        numNotifs.textContent = parseInt(numberOfNotifs) - 1;
        window.location.href = `/group_chat/${room}`;        
    });

};

[...EmotCardCloseBtns].forEach(CloseBtn=>CloseBtn.addEventListener("click",closeEmotNotification));

[...EmotCardGoToBtns].forEach(GoTOBtn=>GoTOBtn.addEventListener("click",goToNotification_Emot));

const BandCardCloseBtns = document.querySelectorAll(".notif-card-band-header>.fas.fa-times");
const BandGoToBtns = document.querySelectorAll(".notif-card-band>.notif-card-goTo");

closeBandNotification = function(){
    const bandCard = this.parentNode.parentNode;
    const {band} = bandCard.dataset;
    console.log(band);
    $.post("/notifs/band/close",{band,username});
    bandCard.style.transform = "scale(0.01)";
    const numberOfNotifs = numNotifs.textContent;
    numNotifs.textContent = parseInt(numberOfNotifs) - 1;
    setTimeout(()=>CardList.removeChild(bandCard),300);
};

goToNotification_Band = function(){
    const bandCard = this.parentNode;
    const {band,room} = bandCard.dataset;
    $.post("/notifs/band/close",{band,username},()=>{
        bandCard.style.transform = "scale(0.01)";
        const numberOfNotifs = numNotifs.textContent;
        numNotifs.textContent = parseInt(numberOfNotifs) - 1;
        window.location.href = `/group_chat/${room}`;        
    });
};

[...BandCardCloseBtns].forEach(CloseBtn=>CloseBtn.addEventListener("click",closeBandNotification));
[...BandGoToBtns].forEach(GoToBtn=>GoToBtn.addEventListener("click",goToNotification_Band));