const router = require("express").Router();
const passport = require("passport");

//auth login
router.get("/login",(req,res)=>{
    res.render("login");
})

router.get("/logout",(req,res)=>{
    //handling with passport
    req.logout();
    res.redirect("/");
})

//auth with google
router.get("/",passport.authenticate("google",{
    scope:["profile","email"]
}))

router.get("/redirect",passport.authenticate("google"),(req,res)=>{
    console.log("success");
    // res.send(req.user);
    res.redirect("/home");
});

module.exports = router;