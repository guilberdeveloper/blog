const UserModel = require("../database/Models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    // Verifica se o usuário está autenticado via sessão
    if (req.isAuthenticated()) {
      return next();
    }

    // Busca o rememberToken nos cookies
    const rememberToken = req.cookies.remember_me;

    if (rememberToken) {
      // Tenta buscar o usuário pelo rememberToken
      const user = await UserModel.findOne({ where: { rememberToken } });

      if (user) {
        // Autentica o usuário manualmente
        req.login(user, (err) => {
          if (err) {
            console.error("Erro ao autenticar usuário via rememberToken:", err);
            return next(err);
          }
          return next();
        });
      } else {
        // Token inválido ou usuário não encontrado
        res.clearCookie("remember_me"); // Limpa o cookie inválido
        return res.redirect("/login");
      }
    } else {
      // Nenhuma autenticação válida encontrada
      return res.redirect("/login");
    }
  } catch (error) {
    console.error("Erro no middleware isAuthenticated:", error);
    return res.status(500).send("Erro interno de autenticação.");
  }
};

module.exports = isAuthenticated;
