const express = require('express');
const axios = require('axios');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');


router.get('/', isLoggedIn, (req, res) => {
    res.render('ia', {
        style: 'ia.css',
        navbar: 'navbar.css'
    });
});

router.get('/prediccion', isLoggedIn, (req, res) => {

    const { dataId } = req.query;
    if (!dataId) {
        return res.status(400).send('Error: Se requiere el parámetro dataId');
    }

    const config = {
        method: 'GET',
        url: `https://v3.football.api-sports.io/predictions?fixture=${dataId}`,
        headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': '38e8ba34878d246542100c8d6bd93204'
        }
    };
    axios(config)
        .then(function(response) {
            const apiData = response.data;
            console.log(apiData);
            res.render('prediccion', {
                apiData,
                style: 'prediccion.css',
                navbar: 'navbar.css'
            });
        })
        .catch(function(error) {
            console.error('Error al realizar la solicitud a la API:', error);
            return res.status(500).send('Error al obtener datos de la API');
        });
});


module.exports = router;

/*
router.get('/', (req, res) => {
    const config = {
        method: 'GET',
        url: 'https://v3.football.api-sports.io/predictions?fixture=${dataId}',
        headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': '38e8ba34878d246542100c8d6bd93204'
        }
    };

    axios(config)
        .then(function(response) {
            const apiData = response.data;
            console.log(apiData);
            res.render('ia', {
                apiData,
                navbar: 'navbar.css'
            });
        })
        .catch(function(error) {
            console.error('Error al realizar la solicitud a la API:', error);
            return res.status(500).send('Error al obtener datos de la API');
        });
});
*/