const express = require("express");
const router = express.Router();
const userControoler = require("../controllers/userController");
const postController = require("../controllers/postController");

const passport = require("../config/passport");
const crypto = require('crypto');


// routes públicas

function isGuest(req, res, next) {
    if (req.isAuthenticated()) {
        // Caso esteja logado, redireciona para o dashboard ou outra área
        return res.redirect('/home');
    }
    return next();
}

// Middleware para redirecionar rotas inexistentes
app.use((req, res, next) => {
    res.redirect('/');
});
  
  

router.get("/", isGuest, async function(req, res) {
    res.render("index", { user: req.user });
});


// Rota de login
router.get("/login", isGuest, function (req, res) {
    res.render("login");
});

router.post("/login", isGuest, userControoler.login);

// Rota de registro
router.get("/register", isGuest, function (req, res) {
    res.render("register");
});

router.post("/register", isGuest, userControoler.register);



module.exports = router;




module.exports = router;
