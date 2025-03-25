const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { Sequelize } = require("sequelize");
require('dotenv').config();


const dbName = process.env.MYSQL_DATABASE;
const userDb = process.env.MYSQLUSER;
const passDB = process.env.MYSQLPASSWORD;
const hostdb = process.env.MYSQLHOST;
const dialectDB = process.env.DIALECT_DB;




// utilizando a opção 3 de conexão do sequelize

 const db = new Sequelize(`${dbName}`, `${userDb}`, `${passDB}`, {
    host: `${hostdb}`,
    dialect: `${dialectDB}`
});


// Sincronizando a tabela de sessões
db.sync();

module.exports = db; 