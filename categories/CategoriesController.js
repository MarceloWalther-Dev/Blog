const express = require('express');
const router = express.Router();
const Category = require("./Category")
const slugify = require("slugify")




router.get('/admin/categories/new', (req,res)=>{
    res.render("admin/categories/new");
});



//SALVANDO AS CATEGORIAS
router.post("/categories/save",(req,res)=>{
    let title = req.body.title;
    if(title != undefined){
        Category.create({   //salvando no banco de dados
            title: title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect("/admin/categories")
        })
    }else{
        res.redirect("/admin/categories/new");
    }

    // colocar no action do formulário essa rota /categories/save
})



//BUSCANDO AS CATEGORIAS NO BANCO DE DADOS E RENDERIZANDO NA VIEW INDEX
router.get("/admin/categories",(req,res)=>{
    Category.findAll().then(categories =>{
        res.render("admin/categories/index",{categories: categories});

    })
})




//DELETANDO 
router.post("/categories/delete", (req,res)=>{
    let id = req.body.id;

    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where:  {
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/categories")
            })
        }else{
            res.redirect("/admin/categories")
        }
    }else{
        res.redirect("/admin/categories")
    }
})

//EDITANDO AS CATEGORIAS
router.get("/admin/categories/edit/:id", (req,res)=>{
    let id = req.params.id;
        if(isNaN(id)){ // necessário fazer essa validação pq o sequelize aceita colocar 10aygsdgysgg e o certo seria somente o numero 10
            res.redirect("/admin/categories");
        }
    Category.findByPk(id)// findByPk é uma método de pesquisar mais rápido no banco de dados
        .then(category =>{
            if(category != undefined){
                res.render("admin/categories/edit",{category:category})
            }else{
                res.redirect("/admin/categories");
            }
        }).catch(erro =>{
            console.log(erro)
            res.redirect("/admin/categories");
        }) 
})


//ATUALIZANDO CATEGORIES
router.post("/categories/update", (req,res)=>{
    let id = req.body.id;
    let title = req.body.title;

    Category.update({title: title, slug: slugify(title)},{
        where: {
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/categories");
    })
})





module.exports = router;