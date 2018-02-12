const SocialBtns = document.querySelectorAll(".navigation-social-item");
const UtilityBtns = document.querySelectorAll(".navigation-utilities-item");
const onlineUsersBtn = SocialBtns[0];
const profileBtn = SocialBtns[1];
const notificationsBtn = SocialBtns[2];
const LogOut = SocialBtns[3];
const allBands = UtilityBtns[0];
const SearchBtn = UtilityBtns[1];
const AddBandBtn = UtilityBtns[2];
const DiscoverBtn = UtilityBtns[3];
const SearchModal = document.querySelector("#search_modal");
const AddBandModal = document.querySelector("#addBand_modal");
const Body = document.querySelector("body");
const Logo = document.querySelector(".navigation-logo");

const notificationsMenu = document.querySelector("#notifications_side_nav");
const notificationsMenu_content = document.querySelector("#notifications_side_nav>.side-nav-content");

const onlineUsersMenu = document.querySelector("#onlineUsers_side_nav");
const onlineUsersMenu_content = document.querySelector("#onlineUsers_side_nav>.side-nav-content");

//open search modal
SearchBtn.addEventListener("click",()=>{
    SearchModal.classList.remove("hidden");
    Body.classList.add("modal-open");
});

//open add band modal
AddBandBtn.addEventListener("click",()=>{
    AddBandModal.classList.remove("hidden");
    Body.classList.add("modal-open");
});

Logo.addEventListener("click",()=>{
    window.location.href="/home";
})

onlineUsersBtn.addEventListener("click",()=>{
    document.querySelector("body").classList.add("sideNav-open");
    onlineUsersMenu.classList.remove("hidden");
    setTimeout(()=>{
        onlineUsersMenu_content.classList.remove("hidden");
    },50);
})

LogOut.addEventListener("click",()=>{
    const {user} = ExtraDataInput.dataset;
    socket.emit("logout",user);
    window.location.href="/auth/logout";
})

notificationsBtn.addEventListener("click",()=>{
    document.querySelector("body").classList.add("sideNav-open");
    notificationsMenu.classList.remove("hidden");
    setTimeout(()=>{
        notificationsMenu_content.classList.remove("hidden");
    },50);
})

allBands.addEventListener("click",()=>{
    window.location.href="/bands/all";
})

DiscoverBtn.addEventListener("click",()=>{
    window.location.href="/discover";
})