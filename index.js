const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require('./database/database');

//controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./user/UsersController");

//Models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User");

//view engine
app.set('view engine', 'ejs');


//SESSIONS
app.use(session({
    secret: "qualquercoisa",// pode ser colocado qualquer coisa bem aleatória, é para aumentar a segurança das sessões 
    cookie: {
        maxAge: 3000000
    },
}))

//body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Database
connection
        .authenticate()
        .then(()=>{
            console.log("Conectado com sucesso ao banco de dados");
        }).catch(erro=>{
            console.log(erro);
        });
        
        
//static
app.use(express.static('public'))


//rotas

app.use("/",categoriesController)
app.use("/",articlesController)
app.use("/",usersController)


/* //TESTE SESSIONS EXPRESS SESSION
app.get("/session", (req, res) => {

    req.session.treinamento = "Formação NOde.js"
    req.session.ano = 2019
    req.session.email = "marcelo@gmail.com"
    req.session.user = {
        userName: "marcelo",
        email: "marcelo@gmail.com",
        id: 32
    }
    res.send("sessao gerada")
});

app.get("/leitura", (req, res) => {

    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user

    })
});
 */







app.get("/", (req,res)=>{
    Article.findAll({
        order:[
           ['id', 'DESC']
        ],
        limit: 4 
    }).then(articles =>{
        Category.findAll().then(categories =>{
            
            res.render("index",{articles:articles, categories:categories});        
        })
    });
});


app.get("/:slug",(req,res)=>{
    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article=>{
        if(article!= undefined){
            Category.findAll().then(categories=>{
                res.render("article",{article:article, categories:categories});

            })
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        console.log(err)
        res.redirect("/");
    })

});

app.get("/category/:slug", (req, res) =>{
    let slug = req.params.slug;
    Category.findOne({
        where: { 
            slug: slug
        }, include: [{model:Article}]
    }).then(category =>{
        if(category!=undefined){
            Category.findAll().then(categories =>{
                res.render("index",{articles: category.articles, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(err =>{
        console.log(err)
        res.redirect("/");
    })
})





app.listen(8080,()=>{
    console.log("servidor está rodando");
})