const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
//Model
const User = require('./User');



router.get('/admin/users',(req,res) =>{
    User.findAll().then(users =>{
        
        res.render("admin/users/index",{
            users: users
        })
    })
    
});

router.get('/admin/users/create',(req,res) =>{
    res.render('admin/users/create');
})

//CRIANDO USUÁRIO E SENHA
router.post('/users/create',(req,res) =>{
    let email = req.body.email;
    let password = req.body.password;
    let salt = bcrypt.genSaltSync(10); // criando o salt que é necessário para encriptar a senha
    let hash = bcrypt.hashSync(password, salt);

    User.findOne({
        where: {
            email: email
        }}).then(user => {
            if (user == undefined) {
            
                User.create({
                    email: email,
                    password: hash
                }).then(() => {
                    res.redirect("/")
                    /*res.json({email,password}) ==> TESTANDO SE OS DADOS DOS FORMULÁRIOS ESTÃO CHEGANDO NA TELA */
                }).catch((error) => {
                    res.redirect("/")
                })
        }else{
            res.redirect("/admin/users/create")
        }
    })

});

//DELETANDO USUÁRIO

router.post("/users/delete",(req,res) =>{
    let id = req.body.id;

    if(id != undefined){
        if(!isNaN(id)){
            User.destroy({
                where:{
                    id: id
                }
            }).then(() =>{
                res.redirect("/admin/users")
            })
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
})


//UPDATE USUÁRIO
router.get("/admin/users/edit/:id",(req,res)=>{
    let id = req.params.id;
    if(isNaN(id)){
        res.redirect("/admin/users");
    }
    User.findByPk(id)
        .then(user =>{
            if(user != undefined){
                res.render("admin/users/edit",{user:user})
            }else{
                res.redirect("/admin/users");
            }
        }).catch(erro =>{
            res.redirect("/admin/users");
        })
})

//ATUALIZANDO USUÁRIOS

router.post("/users/update", (req,res)=>{
    let id = req.body.id;
    let email = req.body.email;
    let password = req.body.password;
    let salt = bcrypt.genSaltSync(10); // criando o salt que é necessário para encriptar a senha
    let hash = bcrypt.hashSync(password, salt);

    User.update({email:email, password:hash},{
        where: {
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/users")
    })
})




router.get("/login",(req,res)=>{
    res.render("admin/users/login");
});


router.post("/authenticate",(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({
        where:{
            email: email
        }
    }).then(user =>{
        if(user != undefined){// se existe um usuário com esse e-mail
            //validar senha
            let correct = bcrypt.compareSync(password, user.password)// comparando a hash com a hash que está salva no banco de dados
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email,
                    
                }
                /* res.json(req.session.user) */
                res.redirect("/admin/articles")
            }else{
                res.redirect("/login")
            }
        }else{
            res.redirect("/login");
        }
    })
})



router.get("/logout",(req,res)=>{
    req.session.user = undefined;
    res.redirect("/");
})


module.exports = router;



