const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
    const config = {
        method: 'GET',
        url: 'https://v3.football.api-sports.io/predictions?fixture=111',
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

module.exports = router;