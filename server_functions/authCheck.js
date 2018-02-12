//middleware with the purpose of redirecting a user that is not logged in back to home page
const authCheck = (req,res,next) => {
    if(!req.user){//req.user will not be defined if the user has not been authenticated by passport
        res.redirect("/");//bring back home
    } else {
        next();//run next function, showing the home page
    }
}

module.exports = authCheck;