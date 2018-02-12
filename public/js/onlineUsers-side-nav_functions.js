const toggleViewBtns = document.querySelectorAll(".view_toggle>.view_toggle-btn");

const toggleView = function(){
    const view = this.getAttribute("id");
    const status = this.dataset.toggle;
    if(status==="hidden" && view==="List"){
        this.setAttribute("data-toggle","shown");
        document.querySelector("#Chart").setAttribute("data-toggle","hidden");
        document.querySelector(".onlineUsers_list").classList.remove("hidden");
        document.querySelector(".onlineUsers_charts").classList.add("hidden");
    } else if(status==="hidden" && view==="Chart"){
        this.setAttribute("data-toggle","shown");
        document.querySelector("#List").setAttribute("data-toggle","hidden");
        document.querySelector(".onlineUsers_list").classList.add("hidden");
        document.querySelector(".onlineUsers_charts").classList.remove("hidden");        
    }
};

[...toggleViewBtns].forEach(toggleViewBtn=>toggleViewBtn.addEventListener("click",toggleView));