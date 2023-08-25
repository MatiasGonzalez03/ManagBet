const passport = require ('passport');
const Strategy = require ('passport-local').Strategy;

passport.use('local.signup',new LocalStrategy({
    nicknameField: 'nickname',
    emailField: 'email',
    passwordField: 'password',


}))