const {Sequelize , DataTypes} = require("sequelize");
const db = require("../db");
const bcrypt = require("bcryptjs");


const UserModel = db.define("users", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, // Verifica se o nome não está vazio
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Valida o formato do email
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100], // Exige senha com no mínimo 6 caracteres
        },
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Define como falso por padrão
    },
    rememberToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    timestamps: true, // Adiciona campos createdAt e updatedAt automaticamente
    hooks: {
        beforeCreate: async (user) => {
            // Realiza o hash da senha antes de criar o usuário
            const saltRounds = 10;

            user.password = await bcrypt.hash(user.password, saltRounds);
        },
        beforeUpdate: async (user) => {
            // Hash se a senha for alterada
            if (user.changed("password")) {
                const saltRounds = 10;

                user.password = await bcrypt.hash(user.password, saltRounds);
            }
        }
    }
});





// Método para comparar senhas (pode ser usado no login)
UserModel.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };


UserModel.sync({ force: false });

module.exports = UserModel;