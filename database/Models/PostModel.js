const {Sequelize , DataTypes} = require("sequelize");
const db = require("../db");
const bcrypt = require("bcryptjs");
const User = require("./User");

const Post = db.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  authorId: { // Relaciona com o ID do usuário
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  comments: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  tableName: "posts",
  timestamps: true,
});


// Define as associações entre os modelos
Post.belongsTo(User, { foreignKey: "authorId", as: "author" }); // Associa Post ao User
User.hasMany(Post, { foreignKey: "authorId", as: "posts" }); // User pode ter muitos Posts

Post.sync({ force: false });

module.exports = Post;
