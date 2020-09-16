const localStrategy = require('passport-local').Strategy
const crip = require('../controllers/criptografia');
const uuid = require('uuid');
const modelRestaurante  = require('../model/UsuariosRestaurantes');
const generateToken = require("../middleware/genereteToken");


module.exports = function (passport) {
    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'senha'
    },

        async (email, senha, done) => {
          const user =await  modelRestaurante.findOne({where:{emailusuario:email}}).catch(function(err){
              return done(err)
          });
       
     
        if(!user){
         
            return done(null,false,'Essa conta não existe');
        }
        if(!crip.comparePassword(user.senhausuario,senha)){
            res.status(400).json({message:'Senha errada'})
            return done(null, false, {
                message: 'Senha Errada'
            });
        }
       

        return done(null, user);
         
        }))
    passport.serializeUser((user, done) => {

        done(null, user.id)
    })

    passport.deserializeUser(async (idusuario, done) => {

        const user =await  modelRestaurante.findOne({attributes:['id','nomeusuario','emailusuario','codrestaurante'], where:{id:idusuario}}).catch(function(err){
            return done(err)
        });
        
        if(!user){

            return done(null,false,'Essa conta não existe');
        }
        
        const dados={nomeusuario:user.nomeusuario,email:user.emailusuario,codrestaurante:user.codrestaurante,token:generateToken.geraNovoToken({nomeusuario:user.emailusuario})};
        
        done(null, dados)

    });

}