const express = require("express");
const authRoute = express.Router();
const userControoler = require("../controllers/userController");
const isAuthenticated = require("../middlewares/auth");
const postController = require("../controllers/postController");
const globalVariables = require("../middlewares/variables");


// Middleware global
authRoute.use(globalVariables);

authRoute.get('/home', isAuthenticated, postController.getAllPosts);

// Rota para o perfil do usuário
authRoute.get('/profile', isAuthenticated, userControoler.getProfile);

// Rota de logout
authRoute.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.clearCookie('remember_me');
        res.redirect('/login');
    });
});



authRoute.post("/comment", isAuthenticated, postController.addComment);


module.exports = authRoute;
