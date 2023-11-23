const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        style: 'index.css',
        navbar: 'navbar.css'
    })
})

module.exports = router;
