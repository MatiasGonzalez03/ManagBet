const express = require('express')
const morgan = require('morgan')
const path = require('path');

// initializations
const app = express();

//settings
app.set('port', process.env.PORT || 4000);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// global variables
app.use((req, res, next) => {
    next();
})


//routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/apuestas', require('./routes/apuestas'));

// public
app.use(express.static(path.join(__dirname, 'public')));

// starting server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})