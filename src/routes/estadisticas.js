const express = require('express');
const router = express.Router();

const pool = require('../database')
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async(req, res) => {
    try {
        const usuario_id = req.user.id;
        const totalApuestas = await pool.query('SELECT COUNT(*) AS total FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const cantidadFallidas = await pool.query('SELECT COUNT(*) AS fallidas FROM apuestas WHERE estado = \'Fallada\' AND usuario_id = ?', [usuario_id]);
        const cantidadAcertadas = await pool.query('SELECT COUNT(*) AS acertadas FROM apuestas WHERE estado = \'Acertada\' AND usuario_id = ?', [usuario_id]);
        const cantidadPendientes = await pool.query('SELECT COUNT(*) AS pendientes FROM apuestas WHERE estado = \'Pendiente\' AND usuario_id = ?', [usuario_id]);

        const sumaDineroApostado = await pool.query('SELECT SUM(dinero) AS suma FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const promedioDineroApostado = await pool.query('SELECT AVG(dinero) AS promedio FROM apuestas WHERE usuario_id = ?', [usuario_id]);

        const apuestaMasAlta = await pool.query('SELECT id, MAX(dinero + 0) AS maximo FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const apuestaMasBaja = await pool.query('SELECT id, MIN(dinero + 0) AS minimo FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const idApuestaMasAlta = await pool.query('SELECT id FROM apuestas WHERE dinero = ?', [apuestaMasAlta[0].maximo]);
        const idApuestaMasBaja = await pool.query('SELECT id FROM apuestas WHERE dinero = ?', [apuestaMasBaja[0].minimo]);

        const gananciaTotal = await pool.query('SELECT SUM(CASE WHEN estado = \'Acertada\' THEN (dinero * cuota  - dinero) ELSE 0 END) AS ganancias FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const perdidaTotal = await pool.query('SELECT SUM(CASE WHEN estado = \'Fallada\' THEN (dinero) ELSE 0 END) AS perdidas FROM apuestas WHERE usuario_id = ?', [usuario_id]);
        const gananciaPerdida = 0;

        //const mayorGanancia = await pool.query('SELECT id, (dinero * cuota - dinero) AS ganancia FROM apuestas WHERE estado = \'Acertada\' AND usuario_id = ? ORDER BY ganancia DESC LIMIT 1', [usuario_id]);
        //const mayorPerdida = await pool.query('SELECT id, MAX(dinero + 0) AS perdida FROM apuestas WHERE estado = \'Fallada\' AND usuario_id = ?', [usuario_id]);

        //const mayorGanancia = await pool.query('SELECT id, (dinero * cuota - dinero) AS ganancia FROM apuestas WHERE estado = \'Acertada\' AND usuario_id = ? ORDER BY ganancia DESC LIMIT 1', [usuario_id]);
        //const mayorPerdida = await pool.query('SELECT id, MAX(dinero + 0) AS perdida FROM apuestas WHERE estado = \'Fallada\' AND usuario_id = ?', [usuario_id]);
        const mayorGanancia = await pool.query('SELECT id, (CASE WHEN estado = \'Acertada\' THEN (dinero * cuota - dinero) ELSE 0 END) AS ganancia FROM apuestas WHERE usuario_id = ? ORDER BY ganancia DESC LIMIT 1', [usuario_id]);
        const mayorPerdida = await pool.query('SELECT id, (CASE WHEN estado = \'Fallada\' THEN (dinero) ELSE 0 END) AS perdida FROM apuestas WHERE usuario_id = ? ORDER BY perdida DESC LIMIT 1', [usuario_id]);
        //const mayorGanancia = await pool.query('SELECT id, IFNULL((dinero * cuota - dinero), 0) AS ganancia FROM apuestas WHERE estado = \'Acertada\' AND usuario_id = ? ORDER BY ganancia DESC LIMIT 1', [usuario_id]);

        /*
                const idMayorGanancia = await pool.query('SELECT id FROM apuestas WHERE (dinero * cuota - dinero) = ?', [mayorGanancia[0].ganancia]);
                const idMayorPerdida = await  pool.query('SELECT id FROM apuestas WHERE MAX(dinero) AND = ?', [mayorPerdida[0].perdida]);
        */
        const idMayorGanancia = mayorGanancia;
        const idMayorPerdida = mayorPerdida;



        /* ACIERTOS                 FALLOS
        totalganancia               totalperdida
        apuestamayorganancia        apuestamayorperdida
        apuestamasarriesgada        apuestamasarriesgada

        */

        if (totalApuestas[0].total === 0) {
            return res.render('estadisticas', {
                style: 'estadistica.css',
                navbar: 'navbar.css'
            });
        } else {
            res.render('estadisticas', {
                totalApuestas: totalApuestas[0].total,
                cantidadFallidas: cantidadFallidas[0].fallidas,
                cantidadAcertadas: cantidadAcertadas[0].acertadas,
                cantidadPendientes: cantidadPendientes[0].pendientes,
                sumaDineroApostado: sumaDineroApostado[0].suma,
                promedioDineroApostado: promedioDineroApostado[0].promedio,
                apuestaMasAlta: apuestaMasAlta[0].maximo,
                idApuestaMasAlta: idApuestaMasAlta[0].id,
                idApuestaMasBaja: idApuestaMasBaja[0].id,
                apuestaMasBaja: apuestaMasBaja[0].minimo,
                gananciaTotal: gananciaTotal[0].ganancias.toFixed(0),
                perdidaTotal: perdidaTotal[0].perdidas.toFixed(0),
                gananciaPerdida: gananciaTotal[0].ganancias.toFixed(0) - perdidaTotal[0].perdidas.toFixed(0),
                mayorGanancia: mayorGanancia[0].ganancia.toFixed(0),
                idMayorGanancia: idMayorGanancia[0].id,
                idMayorPerdida: idMayorPerdida[0].id,
                mayorPerdida: mayorPerdida[0].perdida.toFixed(0),
                style: 'estadistica.css',
                navbar: 'navbar.css'
            });
        }

    } catch (error) {
        console.error('Error al obtener las apuestas:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router