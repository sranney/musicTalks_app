//I want the images to always be square and fill up the whole screen
//I am making it so that the size of the image collage container (".album-collage") will always be larger than the screen so that the images can fill up the edges
//also, in order for this to work on any devices, not just the standard laptop where the width is larger than the height, I have to check whether the width is larger than the height
//if screen has larger height than width, then I set the ".album-collage" to be a square that is based on the height
//album covers are usually square, so I want the height and the width to be the same, so I also set each of the img containers to be based on viewport size, but also in the same direction as the collage container ".album-collage"
// that is what collage_dim_cal does, it adjusts the size of the ".album-collage" and each ".album-collage-img"
//to be responsive to dimensions of the screen
const window_width = window.innerWidth;
const window_height = window.innerHeight;
const collageContainer = document.querySelector(".album-collage");
const imgContainers = document.querySelectorAll(".album-collage-img");

const collage_dim_cal = () => {

    if(window_width>window_height){
        collageContainer.style.width="110vw";
        collageContainer.style.height="110vw";
        [...imgContainers].forEach(imgContainer=>{
            imgContainer.style.width="11vw";
            imgContainer.style.height="11vw";
        });
    } else {
        collageContainer.style.width="110vh";
        collageContainer.style.height="110vh";
        [...imgContainers].forEach(imgContainer=>{
            imgContainer.style.width="11vh";
            imgContainer.style.height="11vh";
        });        
    }

}
//I want collage_dim_cal to run at first when the page is loaded so that the pictures and collage container are set correctly
collage_dim_cal();
//I also want it to run when the window dimensions are resized
window.addEventListener("resize",collage_dim_cal);
