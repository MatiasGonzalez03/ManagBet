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
        const apuestaMasAlta = await pool.query('SELECT id, MAX(dinero + 0) AS maximo FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const apuestaMasBaja = await pool.query('SELECT id, MIN(dinero + 0) AS minimo FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const gananciaTotal = await pool.query('SELECT SUM(CASE WHEN estado = \'Acertada\' THEN (dinero * cuota  - dinero) ELSE 0 END) AS ganancia FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const perdidaTotal = await pool.query('SELECT SUM(CASE WHEN estado = \'Fallada\' THEN (dinero) ELSE 0 END) AS perdida FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const gananciaPerdida = 0;
        const cantidadFallidas = await pool.query('SELECT COUNT(*) AS fallidas FROM apuestas WHERE estado = \'Fallada\' AND usuario_id = ?', [usuario_id]);
        const cantidadAcertadas = await pool.query('SELECT COUNT(*) AS acertadas FROM apuestas WHERE estado = \'Acertada\' AND usuario_id = ?', [usuario_id]);
        const cantidadPendientes = await pool.query('SELECT COUNT(*) AS pendientes FROM apuestas WHERE estado = \'Pendiente\' AND usuario_id = ?', [usuario_id]);

        const idApuestaMasAlta = await pool.query('SELECT id FROM apuestas WHERE dinero = ?', [apuestaMasAlta[0].maximo]);
        const idApuestaMasBaja = await pool.query('SELECT id FROM apuestas WHERE dinero = ?', [apuestaMasBaja[0].minimo]);

        const mayorGanancia = await pool.query('SELECT id, (dinero * cuota - dinero) AS ganancia FROM apuestas WHERE estado = \'Acertada\' AND usuario_id = ? ORDER BY ganancia DESC LIMIT 1', [usuario_id]);
        const mayorPerdida = await pool.query('SELECT id, MAX(dinero + 0) AS perdida FROM apuestas WHERE estado = \'Fallada\' AND usuario_id = ?', [usuario_id]);
        /*
                const idMayorGanancia = await pool.query('SELECT id FROM apuestas WHERE (dinero * cuota - dinero) = ?', [mayorGanancia[0].ganancia]);
                const idMayorPerdida = await pool.query('SELECT id FROM apuestas WHERE MAX(dinero) AND = ?', [mayorPerdida[0].perdida]);
        */
        const idMayorGanancia = mayorGanancia;
        const idMayorPerdida = mayorPerdida;
        res.render('estadisticas', {

            mayorGanancia: mayorGanancia[0].ganancia.toFixed(0),
            idMayorGanancia: idMayorGanancia[0].id,
            idMayorPerdida: idMayorPerdida[0].id,
            mayorPerdida: mayorPerdida[0].perdida.toFixed(0),
            totalApuestas: totalApuestas[0].total,
            sumaDineroApostado: sumaDineroApostado[0].suma,
            promedioDineroApostado: promedioDineroApostado[0].promedio,
            apuestaMasAlta: apuestaMasAlta[0].maximo,
            idApuestaMasAlta: idApuestaMasAlta[0].id,
            idApuestaMasBaja: idApuestaMasBaja[0].id,
            apuestaMasBaja: apuestaMasBaja[0].minimo,
            gananciaTotal: gananciaTotal[0].ganancia.toFixed(0),
            perdidaTotal: perdidaTotal[0].perdida.toFixed(0),
            gananciaPerdida: gananciaTotal[0].ganancia.toFixed(0) - perdidaTotal[0].perdida.toFixed(0),
            cantidadFallidas: cantidadFallidas[0].fallidas,
            cantidadAcertadas: cantidadAcertadas[0].acertadas,
            cantidadPendientes: cantidadPendientes[0].pendientes,
            style: 'estadistica.css',
            navbar: 'navbar.css'
        });
    } catch (error) {
        console.error('Error al obtener las apuestas:', error);
        res.status(500).send('Error interno del servidor');
    }
});
``


module.exports = router