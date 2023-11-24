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

        const mayorGanancia = await pool.query('SELECT id, (CASE WHEN estado = \'Acertada\' THEN (dinero * cuota - dinero) ELSE 0 END) AS ganancia FROM apuestas WHERE usuario_id = ? ORDER BY ganancia DESC LIMIT 1', [usuario_id]);
        const mayorPerdida = await pool.query('SELECT id, (CASE WHEN estado = \'Fallada\' THEN (dinero) ELSE 0 END) AS perdida FROM apuestas WHERE usuario_id = ? ORDER BY perdida DESC LIMIT 1', [usuario_id]);
        const idMayorGanancia = mayorGanancia;
        const idMayorPerdida = mayorPerdida;
        const menorGanancia = await pool.query('SELECT id, (CASE WHEN estado = \'Acertada\' THEN (dinero * cuota - dinero) ELSE 0 END) AS ganancia FROM apuestas WHERE usuario_id = ? AND estado = \'Acertada\' ORDER BY ganancia ASC LIMIT 1', [usuario_id]);
        const menorPerdida = await pool.query('SELECT id, (CASE WHEN estado = \'Fallada\' THEN (dinero) ELSE 0 END) AS perdida FROM apuestas WHERE usuario_id = ? AND estado = \'Fallada\' ORDER BY perdida ASC LIMIT 1', [usuario_id]);

        //const menorPerdida = await pool.query('SELECT id, (CASE WHEN estado = \'Fallada\' THEN (dinero) ELSE 0 END) AS perdida FROM apuestas WHERE usuario_id = ? ORDER BY perdida LIMIT 1', [usuario_id]);
        //const menorGanancia = await pool.query('SELECT id, (CASE WHEN estado = \'Acertada\' THEN (dinero * cuota - dinero) ELSE 0 END) AS ganancia FROM apuestas WHERE usuario_id = ? ORDER BY ganancia LIMIT 1', [usuario_id]);
        const idMenorGanancia = menorGanancia;
        const idMenorPerdida = menorPerdida;


        const mayorArriesgada = await pool.query('SELECT id, cuota, dinero, (CASE WHEN estado = \'Acertada\'  THEN (dinero + 0) ELSE 0 END) AS apuesta FROM apuestas WHERE usuario_id = ? AND estado = \'Acertada\' ORDER BY cuota DESC LIMIT 1', [usuario_id])
        const idMayorArriesgada = mayorArriesgada;

        const mayorArriesgadaPerdida = await pool.query('SELECT id, cuota, dinero, (CASE WHEN estado = \'Fallada\'  THEN (dinero + 0) ELSE 0 END) AS apuesta FROM apuestas WHERE usuario_id = ? AND estado = \'Fallada\' ORDER BY cuota DESC LIMIT 1', [usuario_id])
        const idMayorArriesgadaPerdida = mayorArriesgadaPerdida;


        const totalApuestasPorcentaje = cantidadFallidas[0].fallidas + cantidadAcertadas[0].acertadas;
        const porcentajeFallidas = (cantidadFallidas[0].fallidas / totalApuestasPorcentaje) * 100;
        const porcentajeAcertadas = (cantidadAcertadas[0].acertadas / totalApuestasPorcentaje) * 100;

        const totalDineroApostado = gananciaTotal[0].ganancias + perdidaTotal[0].perdidas;
        const porcentajeGanancia = (gananciaTotal[0].ganancias / totalDineroApostado) * 100;
        const porcentajePerdida = (perdidaTotal[0].perdidas / totalDineroApostado) * 100;
        /*
                if (totalApuestas[0].total === 0) {
                    return res.render('estadisticas', {
                        style: 'estadistica.css',
                        navbar: 'navbar.css'
                    });
                } 
                */
        if (cantidadFallidas[0].fallidas === 0 || cantidadAcertadas[0].acertadas === 0) {
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
                sumaDineroApostado: sumaDineroApostado[0].suma.toFixed(0),
                promedioDineroApostado: promedioDineroApostado[0].promedio.toFixed(0),
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
                menorGanancia: menorGanancia[0].ganancia.toFixed(0),
                menorPerdida: menorPerdida[0].perdida.toFixed(0),
                idMenorGanancia: idMenorGanancia[0].id,
                idMenorPerdida: idMenorPerdida[0].id,
                mayorArriesgada: mayorArriesgada[0].apuesta.toFixed(0),
                idMayorArriesgada: idMayorArriesgada[0].id,
                mayorArriesgadaPerdida: mayorArriesgadaPerdida[0].apuesta.toFixed(0),
                idMayorArriesgadaPerdida: idMayorArriesgadaPerdida[0].id,
                porcentajeFallidas,
                porcentajeAcertadas,
                porcentajeGanancia: porcentajeGanancia.toFixed(0),
                porcentajePerdida: porcentajePerdida.toFixed(0),
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