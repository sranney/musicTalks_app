var searchTerm = document.querySelector(".discoverBand").dataset.band;

const sendToGroupChat = function(){
    let room = document.querySelector(".discoverBand").dataset.band;
    room = room.replace(" ","_");
    const dateTimeSerial = Date.now();
    const value = this.parentNode.dataset.src;
    const {user} = ExtraDataInput.dataset;
    const uuid = `${room}-${user}-${dateTimeSerial}`;
    //to save message in database
    $.post("/group_chat/send",{room,value,uuid});
    socket.emit("new group message",{room,value,user,uuid});

};

if(searchTerm.length>0){
    searchTerm = searchTerm.replace(/ /g,"+");
    $.ajax({url:`https://www.googleapis.com/youtube/v3/search?key=AIzaSyC7P1MHFpLE-KA0r-evQqb7DwI-CjizfOw&topicId=/m/04rlf&part=snippet&type=video&videoEmbeddable=true&q=(${searchTerm})`,
        method:"GET"})
        .done(function(data){
            data.items.forEach(youtubeObj=>{
                if(youtubeObj.id.videoId!=undefined){
                    var videoHolder = document.createElement("div");
                    videoHolder.classList.add("videoHolder");
                    const description = youtubeObj.snippet.description;
                    const videoId = youtubeObj.id.videoId;
                    const videoPlayer = document.createElement("iframe");
                    const videoURL = `https://www.youtube.com/embed/${videoId}`;
                    videoHolder.setAttribute("data-src",videoURL);
                    videoPlayer.setAttribute("src",videoURL);
                    videoPlayer.setAttribute("frameborder","0");
                    videoPlayer.setAttribute("allowfullscreen","");
                    videoHolder.appendChild(videoPlayer);
                    const addToGrpChtBtn = document.createElement("button");
                    addToGrpChtBtn.classList.add("addToGroupChat");
                    const btnIcon = document.createElement("i");
                    btnIcon.classList.add("mif-bubbles");
                    addToGrpChtBtn.appendChild(btnIcon);
                    videoHolder.appendChild(addToGrpChtBtn);
                    document.querySelector(".youtube_vids").appendChild(videoHolder);
                }
            });
        const youtubeVidBtns = document.querySelectorAll(".addToGroupChat");
        [...youtubeVidBtns].forEach(btn=>btn.addEventListener("click",sendToGroupChat));
    });
};