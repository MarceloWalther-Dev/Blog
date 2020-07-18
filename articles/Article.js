const Sequelize = require("sequelize");
const Category = require("../categories/Category")
                                                            //carregando conexão com o banco
const connection = require("../database/database");

const Article = connection.define('articles',{
    title:{
        type:Sequelize.STRING,
        allowNull: false
    },slug:{
        type: Sequelize.STRING,
        allowNull : false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});
                                                           // relacionamento BD
Category.hasMany(Article);                                // uma categoria tem muitos artigos
Article.belongsTo(Category);                             // meu artigo pertence a uma categoria.

//Article.sync({force: true}); força a criação da tabela toda vez que iniciar

module.exports = Article;