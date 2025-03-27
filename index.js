const express = require("express");
const app = express();
const port = 3000;
const path = require("node:path");
const session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require("./config/passport.js");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
require('dotenv').config();
const cors = require("cors");

// Configuração do cookie-parser
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false})); // configuração do body-parser
app.use(bodyParser.json()); // permite ler dados de usuários via json
app.use(cors());
const db = require("./database/db.js");

// routes
const publicRoutes = require("./routes/routes.js");
const authRoute = require("./routes/authRoutes.js");
const postRoutes = require("./routes/postRoutes.js");


// adicionando e configurando o template de visualização front
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// configuração do passport , session express 
// Configuração de sessões com Sequelize
app.use(session({
    secret: process.env.SECRET_SESSION , 
    store: new SequelizeStore({ db: db}),
    resave: false, 
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24} // válido por  1 dia
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));



// routes publicas 
app.use(publicRoutes);
app.use(authRoute);
app.use(postRoutes);


try {
    db.authenticate();
    console.log("Connexão feita com banco de dados");

    app.listen(port, function(){
        console.log("Servidor rodando na porta " + port);
    })
} catch (error) {
    console.error("Não foi possível se conectar com o banco ", error);
}