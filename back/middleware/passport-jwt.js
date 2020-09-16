const localStrategy = require('passport-local').Strategy;
const cript = require('../controllers/criptografia');
const passportJWT = require('passport-jwt'),
    passport = require('passport'),
    Usuario = require('../model/UsuariosRestaurantes'),
    Restaurante = require('../model/Restaurantes');
opcoesJWT = {},
    ExtractJwt = passportJWT.ExtractJwt,
    JwtStrategy = passportJWT.Strategy;

require('dotenv').config();

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: "senha"
}, async (email, senha, done) => {

    let usuario = await Usuario.findOne({
        attributes: ['nomeusuario','permissao', 'emailusuario', 'senhausuario', 'id', 'codrestaurante'],
        where: {
            emailusuario: email,
            status: true
        }
    });

    if (!usuario) {
        return done(null, false, {
            message: "Essa conta não existe"
        });
    }
    let restaurante = await Restaurante.findOne({ attributes: ['nomefantasia'], where: { id: usuario.codrestaurante } });

    const validate = cript.comparePassword(usuario.senhausuario, senha);

    if (validate) {
        var user = {
            nomeUsuario: usuario.nomeusuario,
            emailUsuario: usuario.emailusuario,
            id: usuario.id,
            codrestaurante: usuario.codrestaurante,
            nomefantasia: restaurante.nomefantasia,
            permissao: usuario.permissao
        };

        return done(null, user);
    } else {

        return done(null, false, {
            message: 'Senha Incorreta'
        });

    }

}));

var cookieExtractor = function (req) {
    var token = null;
    console.log(req)
    if (req && req.cookies) {
        token = req.cookies.token;
    }
    return token;
};
opcoesJWT.jwtFromRequest = (ExtractJwt.fromAuthHeaderAsBearerToken() == null) ? cookieExtractor(req) : ExtractJwt.fromAuthHeaderAsBearerToken();
opcoesJWT.secretOrKey = process.env.KEY_TOKEN;
//Configuração JSON Webtoken
passport.use(new JwtStrategy(opcoesJWT, function (jwt_payload, next) {


    Usuario.findOne({
        attributes: ['nomeusuario', 'emailusuario', 'id','permissao'], where: {
            id: jwt_payload.numeroValidacao.codusuario
        }
    }).then(user => {
        console.log(user)
        return next(false, user)
    }).catch(err => {
        return next(err, false);
    });

}
))

