const express = require('express');
const router = express.Router();

router.get('/authentication', (req, res) => {
    res.send('Hello World2')
})

module.exports = router