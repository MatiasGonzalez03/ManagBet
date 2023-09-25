const express = require('express');
const router = express.Router();

const pool = require('../database')
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, (req, res) => {
    res.render('estadisticas', {
        navbar: 'navbar.css'
    });
});

module.exports = router