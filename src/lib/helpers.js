const bcrypt = require('bcryptjs');
const helpers = {};
const handlebars = require('handlebars');

helpers.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async(password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log(e)
    }
};

handlebars.registerHelper('formatDate', function(date) {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
});

handlebars.registerHelper('calculaGanancia', function(cuota, dinero, estado) {
    if (estado === 'Fallada') {
        return 'Perdida: ' + dinero;
    } else {
        return 'Ganancia: ' + (cuota * dinero - dinero).toFixed(0);
    }
});

handlebars.registerHelper('estadoColor', function(estado) {
    if (estado === 'Fallada') {
        return 'border-danger';
    } else if (estado === 'Acertada') {
        return 'border-primary';
    } else if (estado === 'Pendiente') {
        return 'border-secondary';
    } else {
        return ''; // Puedes agregar un caso por defecto o dejarlo en blanco si no se especifica ningún estado
    }
});

module.exports = helpers;