const User = require("../models/user");

module.exports.renderSignupForm  =  (req, res) => {
    res.render("users/signup.ejs");
  }

module.exports.signup =async (req, res) => {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{if(err){
      return next(err);
    }
    req.flash("success", "Welcome to wanderlust");
    res.redirect("/listings");
  })
   }

   module.exports.login =  (req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.loginForm = async (req, res) => {
    req.flash("success", "Welcome to wanderlust you are now logged In!");
    res.redirect("/listings");
  }

  module.exports.logoutForm =  (req, res,next) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      req.flash("succcess", "you are logged out now!!!");
      res.redirect("/listings");
    });
  }