const User = require('../model/user');

module.exports.signUpPage = (req, res) => {
    console.log('signup get route');
    res.render('users/signUp.ejs');
};

module.exports.loginPage = (req, res) => {
    console.log(req.path);
    res.render('users/logIn.ejs');
}

module.exports.saveSignIn = async (req, res) => {
    try {
        console.log("/signup post route");
        console.log(req.body);
        let { username, email, password } = req.body;
        const User1 = new User({ email, username });
        const regUser = await User.register(User1, password);
        req.login(regUser, (err) => {
            if (err) {
                return next(err);
            }
            req.session.username = regUser.username;
            req.flash("save", "Welcome to Yoyagio!!");
            let redirectUrl = res.locals.url || "/listings"
            res.redirect(redirectUrl);
        });
    }
    catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect('/signup');
    }

};

module.exports.saveLogIn = async (req, res) => {
    console.log(req.path);
    req.session.username = req.user.username;
    req.flash('save', "Welcome to Yoyagio!!You Logged in successfully!!");
    let redirectUrl = res.locals.url || "/listings"
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('save', 'You have been logged out.');
        res.redirect('/login');
    });
}