const passport = require ('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require ('../database')
const helpers = require('../lib/helpers')

passport.use('local.signup',new LocalStrategy({
    nicknameField: 'nickname',
    passwordField: 'password',
    passReqToCallback: true
},async (req, nickname, password, done) => {
    const {email} = req.body
    const newUser = {
        nickname,
        password,
        email
    };
    const result = await pool.query('INSERT INTO users SET ? ', newUser);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
  });