const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup', {
        style: 'login.css',
        navbar: 'navbar.css'
    });
})

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin', {
        style: 'login.css',
        navbar: 'navbar.css'
    });
})

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
            successRedirect: '/profile',
            failureRedirect: '/signin',
            failureFlash: true
        })
        (req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {
        style: 'perfil.css',
        navbar: 'navbar.css'
    });

});

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router