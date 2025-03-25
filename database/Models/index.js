const User = require("./UserModel");
const Post = require("./PostModel");

// Configurar as associações
Post.belongsTo(User, { foreignKey: "authorId", as: "author" });
User.hasMany(Post, { foreignKey: "authorId", as: "posts" });

module.exports = { User, Post };
