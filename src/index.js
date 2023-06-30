const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { engine } = require('express-handlebars');

// initializations
const app = express();

//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

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