const discoverChatBtn = document.querySelector(".discover-bandCard > .discover-bandCard-header > .mif-bubbles");
const discoverFavoriteBtn = document.querySelector(".discover-bandCard > .discover-bandCard-header > .mif-heart");

discoverChatBtn.addEventListener("click",function(){
    let url;
    if(window.location.href.indexOf("discover/")>-1){
        url = window.location.href.replace("discover","group_chat");
    } else {
        let room = document.querySelector(".discoverBand").dataset.band;
        room = room.replace(" ","_");
        url=`${window.location.href.replace("discover","group_chat")}/${room}`;
    }
    window.location.href=url;
}); 

discoverFavoriteBtn.addEventListener("click",function(){
    const path = window.location.pathname;
    const room = path.substr(path.lastIndexOf("/")+1);
    if(!this.classList.contains("favorited")){
        $.post("/bands/favorite",{name:room},(data)=>{
            this.classList.add("favorited");
            ShowFavoriteToast();
        });
    }
});