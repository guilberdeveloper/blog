const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("../database/Models/User"); // Ajuste o caminho para seu modelo de usuário
const bcrypt = require("bcryptjs");

// Configuração da estratégia local
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Campo usado como identificador (email no caso)
      passwordField: "password", // Campo da senha
    },
    async (email, password, done) => {
      try {
        // Verifica se o usuário existe
        const user = await UserModel.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: "Usuário não encontrado!" });
        }

        // Compara a senha inserida com o hash armazenado
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Senha incorreta!" });
        }

        // Autenticação bem-sucedida
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialização e desserialização do usuário
passport.serializeUser((user, done) => {
  done(null, user.id); // Salva apenas o ID na sessão
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
