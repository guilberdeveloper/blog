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

const db = new Sequelize(process.env.MYSQLDATABASE,
    process.env.MYSQLUSER,
    process.env.MYSQLPASSWORD,
    {
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT,
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false,
        },
        connectTimeout: 60000, // Tempo limite aumentado para 60 segundos
      },
      pool: {
        max: 5, // Número máximo de conexões no pool
        min: 0, // Número mínimo de conexões no pool
        acquire: 30000, // Tempo máximo para adquirir uma conexão (em ms)
        idle: 10000, // Tempo máximo que uma conexão pode ficar ociosa antes de ser liberada (em ms)
      },
    }
  );


// Sincronizando a tabela de sessões
db.sync();

module.exports = db; 