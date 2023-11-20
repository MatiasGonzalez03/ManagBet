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


module.exports = helpers;