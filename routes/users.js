const mongoose = require("mongoose");
const passport = require("passport");

// models
let User = require("./../models/User");

module.exports = {
    register: (req, res) => {
        res.render("pages/users/register");
    },

    doRegister: (req, res) => {
        User.register(
            new User({
                username: req.body.username,
                email: req.body.email
            }),
            req.body.password,
            (err, user) => {
                if (err) {
                    return res.render("pages/users/register", { error_message: err.message });
                }

                passport.authenticate("local")(req, res, () => {
                    req.session.save(function(err) {
                        if (err) return next(err);
                        req.flash('success_message','You have registered, Now please login');
                        res.redirect("/api/users/login");
                    });
                });
            }
        );
    },

    login: (req, res) => {
        res.render("pages/users/login", { user: req.user });
    },

    doLogin: (req, res, next) => {
        passport.authenticate('local')(req, res, function (response) {
            res.redirect('/');
        });

        /* passport.authenticate("local",  (err, user, info) => {
            if (err) return next(err);

            if (!user) {
                req.flash('error_message', info.message);
                return res.redirect("/api/users/login");
            }

            req.flash('success_message', 'You are now Logged in!!');
            res.redirect("/");
        }); */
    },

    logout: (req, res) => {
        req.logout();
        req.flash('success_message', 'You are logged out');
        res.redirect("/api/users/login");
    }
};
