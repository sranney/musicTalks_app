const discoverBtns = document.querySelectorAll(".thumbnail-discover");

const GoToBandDiscover = function(){
    const bandName = this.parentNode.parentNode.querySelector(".thumbnail-name").textContent;
    window.location.href=`/discover/${bandName.replace(" ","_")}`
};

[...discoverBtns].forEach(btn=>btn.addEventListener("click",GoToBandDiscover));