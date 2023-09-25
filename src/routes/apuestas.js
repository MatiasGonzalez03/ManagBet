const express = require('express');
const router = express.Router();

const pool = require('../database')
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('apuestas/add', {
        navbar: 'navbar.css'
    });
});

router.post('/add', isLoggedIn, async(req, res) => {
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
        usuario_id: req.user.id
    };
    await pool.query('INSERT INTO apuestas set ?', [newApuesta]);
    req.flash('success', 'Apuesta creada exitosamente');
    res.redirect('/apuestas');
});


router.get('/', isLoggedIn, async(req, res) => {
    const apuestas = await pool.query('SELECT * FROM apuestas WHERE usuario_id = ?', [req.user.id]);
    res.render('apuestas/list', {
        apuestas,
        navbar: 'navbar.css'
    });
});

router.get('/delete/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM apuestas WHERE ID = ?', [id]);
    req.flash('success', 'Apuesta eliminada exitosamente');
    res.redirect('/apuestas');
});

router.get('/edit/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    const apuestas = await pool.query('SELECT * FROM apuestas WHERE id = ?', [id]);
    console.log(apuestas);
    res.render('apuestas/edit', {
        apuestas: apuestas[0],
        navbar: 'navbar.css'
    });
});

router.post('/edit/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
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
    await pool.query('UPDATE apuestas set ? WHERE id = ?', [newApuesta, id]);
    req.flash('success', 'Apuesta modificada exitosamente');
    res.redirect('/apuestas');
});

module.exports = router