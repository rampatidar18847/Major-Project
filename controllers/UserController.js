const user = require('../models/user.js');
const ErrorExpress = require("../utils/ErrorExpress.js");

module.exports.newuser = (req, res) =>
{
    res.render("./users/signup");
};

module.exports.saveuser = async(req, res) =>
{
    try{
        let{ username, email, password } = req.body;
    let newuser = new user({username, email});
    let registeruser = await user.register(newuser, password);
    req.login(registeruser, (err)=>
    {
        if(err)
        {
            return next(err);
        }
        req.flash("success","User registered successfully");
        res.redirect("./listings");
    })
    
    }catch(err)
    {
        req.flash("error", err.message);
        res.redirect("./users/signup");
    }

};

module.exports.loginuser = (req, res) => 
{
    res.render('./users/login');
};

module.exports.saveloginuser = (req, res) =>
{
    req.flash("success", "Welcome to Wanderlust :) ");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutuser = (req, res) =>
{
    req.logout((err)=>
    {
        if(err)
        {
            return next(err);
        }
    });
    req.flash("success", "logged out successfully");
    res.redirect("./listings");
};

