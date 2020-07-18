const Sequelize = require("sequelize");
//carregando conexão com o banco
const connection = require("../database/database");

const Category = connection.define('categories',{
    title:{
        type:Sequelize.STRING,
        allowNull: false
    },slug:{
        type: Sequelize.STRING,
        allowNull : false
    }

});


//Category.sync({force: true}); força a criação da tabela toda vez que iniciar

module.exports = Category;