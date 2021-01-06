var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '210.94.194.71',
    user: 'root',
    password: 'donghyo',
    database: 'temp2',
    port: 3306
});

module.exports = connection;