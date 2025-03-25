const { Sequelize, DataTypes } = require("sequelize");
const db = require("../db");
const User = require("./User");
const Post = require("./PostModel");

const Comment = db.define("Comment", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false, // O conteúdo do comentário não pode ser vazio
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Relacionado ao post
  },
  commenterId: { // Relacionado ao usuário que fez o comentário
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "comments",
  timestamps: true,
});

// Associações
Comment.belongsTo(User, { foreignKey: "commenterId", as: "commenter" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

Post.hasMany(Comment, { foreignKey: "postId", as: "postComments" });

module.exports = Comment;
