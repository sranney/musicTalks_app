//for getting img file names
const fs = require("fs");
const pictures = fs.readdirSync("./public/assets/images");//get file names
pictures.filter(pic=>pic!=="/");

module.exports = pictures;