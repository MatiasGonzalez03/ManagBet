const express = require('express');
const router = express.Router();

const pool = require('../database')
const { isLoggedIn } = require('../lib/auth');
/*
router.get('/', isLoggedIn, (req, res) => {
    res.render('estadisticas', {
        navbar: 'navbar.css'
    });
});
*/
router.get('/', isLoggedIn, async(req, res) => {
    try {
        const usuario_id = req.user.id;
        const totalApuestas = await pool.query('SELECT COUNT(*) AS total FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const sumaDineroApostado = await pool.query('SELECT SUM(dinero) AS suma FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const promedioDineroApostado = await pool.query('SELECT AVG(dinero) AS promedio FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const apuestaMasAlta = await pool.query('SELECT MAX(dinero) AS maximo FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const apuestaMasBaja = await pool.query('SELECT MIN(dinero) AS minimo FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const gananciaTotal = await pool.query('SELECT SUM(CASE WHEN estado = \'Acertada\' THEN (dinero * cuota) ELSE 0 END) AS ganancia FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const perdidaTotal = await pool.query('SELECT SUM(CASE WHEN estado = \'Fallada\' THEN (dinero * cuota) ELSE 0 END) AS perdida FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const gananciaPerdida = 0;
        const cantidadFallidas = await pool.query('SELECT COUNT(*) AS fallidas FROM apuestas WHERE estado = \'Fallada\' AND usuario_id = ?', [usuario_id]);
        const cantidadAcertadas = await pool.query('SELECT COUNT(*) AS acertadas FROM apuestas WHERE estado = \'Acertada\' AND usuario_id = ?', [usuario_id]);
        const cantidadPendientes = await pool.query('SELECT COUNT(*) AS pendientes FROM apuestas WHERE estado = \'Pendiente\' AND usuario_id = ?', [usuario_id]);

        res.render('estadisticas', {
            totalApuestas: totalApuestas[0].total,
            sumaDineroApostado: sumaDineroApostado[0].suma,
            promedioDineroApostado: promedioDineroApostado[0].promedio,
            apuestaMasAlta: apuestaMasAlta[0].maximo,
            apuestaMasBaja: apuestaMasBaja[0].minimo,
            gananciaTotal: gananciaTotal[0].ganancia,
            perdidaTotal: perdidaTotal[0].perdida,
            gananciaPerdida: gananciaTotal[0].ganancia - perdidaTotal[0].perdida,
            cantidadFallidas: cantidadFallidas[0].fallidas,
            cantidadAcertadas: cantidadAcertadas[0].acertadas,
            cantidadPendientes: cantidadPendientes[0].pendientes,
            navbar: 'navbar.css'
        });
    } catch (error) {
        console.error('Error al obtener las apuestas:', error);
        res.status(500).send('Error interno del servidor');
    }
});
``


module.exports = router