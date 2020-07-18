const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles',adminAuth,(req,res)=>{
    Article.findAll({
        include:[{model: Category}] // join
    }).then(articles =>{
        
        res.render("admin/articles/index", {articles: articles})
    })
});

router.get("/admin/articles/new",adminAuth,(req,res)=>{
    Category.findAll().then(categories =>{
        res.render("admin/articles/new",{categories: categories})
    })
});

//CRIANDO

router.post("/articles/save",adminAuth, (req,res)=>{
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;


    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect("/admin/articles")
    })
})




// DELETE

router.post("/articles/delete",adminAuth, (req,res)=>{
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/articles");
            });
        }else{
            res.redirect("/admin/articles");
        }
    }else{
        res.redirect("/admin/articles")
    }
})





// EDIT
router.get("/admin/articles/edit/:id",adminAuth, (req,res)=>{
    let id = req.params.id;
    Article.findByPk(id).then(article =>{
        if(article !=undefined){
            Category.findAll().then(categories =>{
                res.render("admin/articles/edit",{categories:categories, article:article});

            });
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        console.log(err)
        res.redirect("/")})
})

// ATUALIZANDO
router.post("/article/update",adminAuth, (req,res)=>{
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

Article.update({title: title, body: body, categoryID: category, slug:slugify(title)},{
        where: {
            id:id
        }
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch((err) =>{
        console.log(err)
        res.redirect("/");
    })
})




//LÓGICA DA PAGINAÇÃO
router.get("/articles/page/:num", (req,res)=>{
    let page = req.params.num;
    let offset = 0;
    if(isNaN(page) || page == 1 || page > 1 && page < 2){               // pego a pagina que está sendo setada e verifico e após a verificação passo para a busca no model Article o numero da pagina
        offset = 0;
    }else{
        offset = (parseInt(page)-1) *4;
    }
    Article.findAndCountAll({
        limit:4, // quantidade exibida na pagina
        offset: offset,// pagina
        order:[
            ['id', 'DESC']
         ] 
    }).then(articles => {     // paginação

        let next;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        let result = {
            next : next,
            articles:articles,
            page: parseInt(page)
        }

        Category.findAll().then(categories=>{
            res.render("admin/articles/page", {categories: categories, result: result})
        })

        /* res.json(result); */
    })
})






module.exports = router;