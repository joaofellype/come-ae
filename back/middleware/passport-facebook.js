const FacebookStrategy=require('passport-facebook').Strategy;
const passport = require('passport');
const usuario = require("../model/UsuariosFacebooks");
require('dotenv').config();
passport.use(new FacebookStrategy({

    clientID: process.env.CLIENTID,
    clientSecret:process.env.CLIENTSECRET,
    callbackURL:process.env.CALLBACKURL

},
    function(acessToken,refreshToken,profile,done){

        process.nextTick( async function(){
           let Usuario =await usuario.findOne({where:{id:profile.id}});
         
           
                if(!Usuario){
                    
                  await  usuario.create({id:profile.id,token:acessToken,nome:profile.displayName}).then(user=>{

                        return done(null,user)
                    }).catch(err=>{
                        throw err; 
                    })
                
                }else{


                    return done(null,Usuario);
                }
            }); 
        }));

        passport.serializeUser(function(user,done){
            console.log(user)
            done(null,user.id)
        });
        passport.deserializeUser(async function(id,done){

           
           const Usuario =await  usuario.findOne({attributes:['id','nome'], where:{id:id}},function(err,user){
                console.log(user)
               return  done(err)
            });
            if(!Usuario){
                return done(null,false,'Essa conta não existe');
            }
             done(null,Usuario)
        })
    



