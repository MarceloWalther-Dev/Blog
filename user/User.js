const Sequelize = require("sequelize");
//carregando conexão com o banco
const connection = require("../database/database");

const User = connection.define('users',{
    email:{
        type:Sequelize.STRING,
        allowNull: false
    },password:{
        type: Sequelize.STRING,
        allowNull : false
    }

});


/* User.sync({force: true});   força a criação da tabela toda vez que iniciar */

module.exports = User;