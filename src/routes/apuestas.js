const express = require('express');
const router = express.Router();

const pool = require('../database')

router.get('/add', (req, res) => {
    res.render('apuestas/add');
});

router.post('/add', async(req, res) => {
    const { dinero, cuota, estado, stake, pais, competicion, partido, pronostico, usuario_id } = req.body;
    const newApuesta = {
        dinero,
        cuota,
        estado,
        stake,
        pais,
        competicion,
        partido,
        pronostico,
        usuario_id
    };
    await pool.query('INSERT INTO apuestas set ?', [newApuesta]);
    //req.flash('success', 'Apuesta creada satisfactoriamente');
    //res.redirect('/apuestas');
    res.send('received');
});



router.get('/', async(req, res) => {
    const apuestas = await pool.query('SELECT * FROM apuestas');
    res.render('apuestas/list', { apuestas });
});


module.exports = router