
function globalVariables(req, res, next) {
    res.locals.user = req.user || null; // Adiciona o usuário autenticado, ou `null` se não houver um
    next();
}

module.exports = globalVariables;
