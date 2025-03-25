const UserModel = require("../database/Models/User");
const PostModel = require("../database/Models/PostModel");
const Comment = require("../database/Models/Comment");

const passport = require("../config/passport");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');



async function register(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).render("register", { error: "Por favor, preencha todos os campos!", message: null });
    }

    if (password !== confirmPassword) {
        return res.status(400).render("register", { error: "As senhas não coincidem!", message: null });
    }

    try {
        const userExists = await UserModel.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).render("register", { error: "Email já cadastrado!", message: null });
        }

        await UserModel.create({ name, email, password });

        return res.status(201).render("register", { error: null, message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        console.error(error);
        return res.status(500).render("register", { error: "Erro ao cadastrar usuário. Tente novamente mais tarde.", message: null });
    }
}




async function login(req, res, next) {

    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.redirect('/login'); // Login inválido
        }

        req.login(user, (err) => {
            if (err) return next(err);

            // Gerar token de lembrar-me
            const rememberToken = crypto.randomBytes(32).toString('hex');

            // Salvar o token no banco de dados
            user.rememberToken = rememberToken;
            user.save();

            // Criar cookie persistente
            res.cookie('remember_me', rememberToken, {
                httpOnly: true,
                secure: false, // Use `true` em produção com HTTPS
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 dias
            });

            return res.redirect('/home');
        });
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
}

async function getProfile(req, res) {
  try {
    const posts = await PostModel.findAll({
      where: { authorId: req.user.id }, // Busca postagens do usuário logado
      include: [{ model: UserModel, as: "author", attributes: ["name"] }], // Inclui o nome do autor
    });

    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const totalComments = posts.reduce(
      (sum, post) => sum + (post.comments ? post.comments.length : 0),
      0
    );

    res.render("profile", {
      user: req.user,
      posts,
      totalLikes,
      totalComments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", { message: "Erro ao carregar o perfil." });
  }
}



module.exports = {
    register,
    login,
    getProfile
};
