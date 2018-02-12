module.exports = (profile)=>{
    const {displayName,emails,photos,id} = profile
    const email = emails[0].value;
    const username = email.substr(0,email.indexOf("@"));
    const photo_URL = photos[0].value;
    const googleId = id;
    return {displayName,email,username,photo_URL,googleId};
}