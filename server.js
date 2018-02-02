const fs = require("fs");//for getting img file names
const pictures = fs.readdirSync("./public/assets/images");


//express app
const express = require("express");
const app = express();



//handlebars
const exphbs = require("express-handlebars");

app.use(express.static("./public"));

//set up server to listen on port
const port = process.env.PORT || 5000;
app.listen(port);

app.engine("handlebars", 
	exphbs({ 
		defaultLayout: "main",
		partialsDir:[__dirname+"/views/partials"]
	 }));//make the main.handlebars be the layout template
app.set("view engine","handlebars");//set the express view engine as handlebars


let chosenPics = [];
let remainingPics = [];
//I want a random order of the pictures to occur so that when the page is refreshed the images are in different locations and the images are different on each load
//I don't want repeat pictures to occur so this function will find a new image out of the collection of pictures to include every time that I render this page and if the image is already in the images-to-be-rendered array, it will pick a new one
const addPictureToArr = (picture)=> {
    if(chosenPics.indexOf(picture)==-1){//if the image chosen is not part of the array for to be rendered pictures
        chosenPics.push(picture);
        remainingPics = pictures.filter(picture=>{
            return chosenPics.indexOf(picture)===-1;
        })
    } else {//image already in the array, choose another image
        addPictureToArr(remainingPics[Math.floor(Math.random()*pictures.length)]);
    }
}

app.get("/",(req,res)=>{
    chosenPics=[];//reset this back to an empty array every time this is triggered

    //run this function 150 times to get 150 unique pictures in the chosenPics array 
    for (var i = 0 ; i < 150; i++){
        addPictureToArr(pictures[Math.floor(Math.random()*pictures.length)]);
    }
    //render the login content, with the chosenPics passed for the background images
    res.render("login",{IMGs:chosenPics});
})
