const mysql = require('mysql');

const connectionConfig = {
    connectionLimit : process.env.CONNECTION_LIMIT,
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
}

const connectionPool = mysql.createPool(connectionConfig);

module.exports = connectionPool;