const express = require('express');
const router = express.Router();

const pool = require('../database')

router.get('/add', (req, res) => {
    res.render('apuestas/add');
});


router.get('/', async(req, res) => {
    const apuestas = await pool.query('SELECT * FROM apuestas');
    console.log(apuestas);
    res.send('apuestas:')
});


module.exports = router