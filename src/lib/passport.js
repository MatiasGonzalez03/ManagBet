const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database')
const helpers = require('../lib/helpers')

passport.use('local.signin', new LocalStrategy({
    usernameField: 'nickname',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, nickname, password, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE nickname = ?', [nickname]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenido' + user.nickname));
        } else {
            done(null, false, req.flash('message', 'La contraseña que has introducido es incorrecta'))
        }
    } else {
        return done(null, false, req.flash('message', 'El nombre de usuario que has introducido no existe'));
    }
}));


passport.use('local.signup', new LocalStrategy({
    usernameField: 'nickname',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, nickname, password, done) => {
    const { email } = req.body
    const newUser = {
        nickname,
        password,
        email
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO usuarios SET ? ', [newUser]);
    console.log(result)
    newUser.id = result.insertId;
    return done(null, newUser);
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    done(null, rows[0]);
});