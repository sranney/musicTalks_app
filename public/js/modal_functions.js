const CloseBtns = document.querySelectorAll(".modal-close");
const Tabs = document.querySelectorAll(".tab");

const FormTooltips = document.querySelectorAll(".tooltip>.add-form-input~.tooltip-content");
const FormTooltips_input = document.querySelectorAll(".tooltip>.add-form-input");
const InstrGifModal = document.querySelector(".gif-container");
const GifCloseBtn = document.querySelector(".gif-container>.close-gif");

function CloseModal() {
    console.log(this.dataset);
    if(this.dataset.modal==="search"){
        //defined in navigation_functions.js, this is the search modal and I'm closing it here by adding the hidden class to it
        SearchModal.classList.add("hidden");
    } else if(this.dataset.modal==="addBand"){
        //defined in navigation_functions.js, this is the add band modal and I'm closing it here by adding the hidden class to it
        AddBandModal.classList.add("hidden");        
    }
    Body.classList.remove("modal-open")
}

[...CloseBtns].forEach(CloseBtn=>{
    CloseBtn.addEventListener("click",CloseModal);    
});


function switchForm() {
    if(!this.classList.contains("active")){
        this.classList.add("active");
        document.querySelector(`#${this.dataset.form}`).classList.add("active");
    }
    [...Tabs].forEach(Tab=>{
        Tab!=this ? Tab.classList.remove("active"):null;
        Tab!=this ? document.querySelector(`#${Tab.dataset.form}`).classList.remove("active"):null;
    })
}

[...Tabs].forEach(Tab=>{
    Tab.addEventListener("click",switchForm);
});

function toggleInstructionalGIF() {

    const instructionsFor = this.dataset.instr;
    if(instructionsFor==="spotify"){
        InstrGifModal.style.display="block";
        InstrGifModal.style.backgroundImage = `url("../assets/gif_instr/Spotify.gif")`;
    } else if(instructionsFor==="cover"){
        InstrGifModal.style.display="block";
        InstrGifModal.style.backgroundImage = `url("../assets/gif_instr/CoverPhoto.gif")`;
    } else if(instructionsFor==="thumbnail"){
        InstrGifModal.style.display="block";
        InstrGifModal.style.backgroundImage = `url("../assets/gif_instr/Thumbnail.gif")`;
    }

};

function showTooltip() {
    console.log("here");
    this.nextElementSibling.style.display = "block";
    this.nextElementSibling.style.opacity = "1";
}

function hideTooltip() {
    console.log("here");
    setTimeout(()=>{
        this.nextElementSibling.style.display = "none";
        this.nextElementSibling.style.opacity = "0";
    },500);
}

[...FormTooltips_input].forEach(input=>input.addEventListener("blur",hideTooltip));

[...FormTooltips_input].forEach(input=>input.addEventListener("focus",showTooltip));

[...FormTooltips].forEach(tooltip=>tooltip.addEventListener("click",toggleInstructionalGIF));

GifCloseBtn.addEventListener("click",()=>InstrGifModal.style.display="none");