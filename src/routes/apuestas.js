const express = require('express');
const router = express.Router();

const pool = require('../database')
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('apuestas/add', {
        style: 'list.css',
        navbar: 'navbar.css'
    });
});

router.post('/add', isLoggedIn, async(req, res) => {
    const { dinero, cuota, estado, stake, competicion, partido, pronostico, fecha, usuario_id } = req.body;
    const newApuesta = {
        dinero,
        cuota,
        estado,
        stake,
        competicion,
        partido,
        pronostico,
        fecha,
        usuario_id: req.user.id
    };
    await pool.query('INSERT INTO apuestas set ?', [newApuesta]);
    req.flash('success', 'Apuesta creada exitosamente');
    res.redirect('/apuestas');
});


router.get('/', isLoggedIn, async(req, res) => {
    try {
        const usuario_id = req.user.id;
        let query = 'SELECT * FROM apuestas WHERE usuario_id = ?';
        const queryParams = [usuario_id];

        const { estado, competicion, partido, fechaInicio, fechaFin } = req.query;

        if (estado) {
            query += ' AND estado = ?';
            queryParams.push(estado);
        }

        if (competicion) {
            query += ' AND competicion = ?';
            queryParams.push(competicion);
        }
        if (partido) {
            query += ' AND partido = ?';
            queryParams.push(partido);
        }

        if (fechaInicio && fechaFin) {
            query += ' AND fecha BETWEEN ? AND ?';
            queryParams.push(fechaInicio, fechaFin);
        }

        const apuestas = await pool.query(query, queryParams);

        res.render('apuestas/list', {
            apuestas,
            style: 'list.css',
            navbar: 'navbar.css'
        });
    } catch (error) {
        console.error('Error al obtener las apuestas:', error);
        res.status(500).send('Error interno del servidor');
    }
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
        style: 'list.css',
        navbar: 'navbar.css'
    });
});

router.post('/edit/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    const { dinero, cuota, estado, stake, competicion, partido, pronostico, fecha } = req.body;
    const newApuesta = {
        dinero,
        cuota,
        estado,
        stake,
        competicion,
        partido,
        pronostico,
        fecha,
    };
    await pool.query('UPDATE apuestas set ? WHERE id = ?', [newApuesta, id]);
    req.flash('success', 'Apuesta modificada exitosamente');
    res.redirect('/apuestas');
});



module.exports = router