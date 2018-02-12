const CloseBtns = document.querySelectorAll(".modal-close");
const Tabs = document.querySelectorAll(".tab");


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