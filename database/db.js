const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { Sequelize } = require("sequelize");
require('dotenv').config();


const dbName = process.env.DB_NAME;
const userDb = process.env.USER_DB;
const passDB = process.env.PASS_DB;
const hostdb = process.env.HOST_DB;
const dialectDB = process.env.DIALECT_DB;




// utilizando a opção 3 de conexão do sequelize

 const db = new Sequelize(`${dbName}`, `${userDb}`, `${passDB}`, {
    host: `${hostdb}`,
    dialect: `${dialectDB}`
});


// Sincronizando a tabela de sessões
db.sync();

module.exports = db; 