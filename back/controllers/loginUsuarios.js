const cript = require("./criptografia");

const Usuario = require('../model/Usuarios')
const Token = require('../middleware/genereteToken');
const restaurante = require("../model/Restaurantes");
const UsuariosRestaurannte = require('../model/UsuariosRestaurantes');
require('dotenv').config();


module.exports = {

    async login(req, res, next) {

        const {
            email,
            senha
        } = req.body;
        let criptValidateUsuario;
        let criptValidateRes;
        let usuario = await Usuario.findOne({
            attributes: ['nomeusuario', 'emailusuario', 'senhausuario', 'codendereco', 'id'],
            where: {
                emailusuario: email
            }
        });

        let usuarioRestaurante = await UsuariosRestaurannte.findOne({
            attributes: ['nomeusuario', 'emailusuario', 'senhausuario', 'codrestaurante', 'id','permissao'],
            where: {
                emailusuario: email
            }
        });
     

        if (!usuario && !usuarioRestaurante) {

            res.status(400).json({
                message: 'Usuario Inexistente'
            })
        }

        if (usuario) {

            criptValidateUsuario = cript.comparePassword(usuario.senhausuario, senha);
            if (!criptValidateUsuario) {
                res.status(400).json({
                    message: 'Email ou senha incorreto'
                });
                return;
            } else {

                var user = {
                    nomeUsuario: usuario.nomeusuario,
                    emailUsuario: usuario.emailusuario,
                    codendereco: usuario.codendereco,
                    id: usuario.id
                }
                let token = 'Bearer ' + Token.geraNovoToken(user);
                res.status(200).json({
                    message: 'Login realizado com sucesso',
                    login: 'Usuario',
                    token: token,
                    nomeusuario: usuario.nomeusuario
                });
                return;
            }
        }

        if (usuarioRestaurante) {
            let Restaurante = await restaurante.findOne({
                attributes: ['nomefantasia'],
                where: {
                    codusuario: usuarioRestaurante.id
                }
            });
                console.log(Restaurante)
            criptValidateRes = cript.comparePassword(usuarioRestaurante.senhausuario, senha);

            if (!criptValidateRes) {

                res.status(400).json({
                    message: 'Email ou senha incorreto'
                });
                return;
            }else{
                var user = {
                    nomeusuario: usuarioRestaurante.nomeusuario,
                    emailusuario: usuarioRestaurante.emailusuario,
                    codendereco: usuarioRestaurante.codendereco,
                    nomefantasia: Restaurante.nomefantasia,
                    codrestaurante: usuarioRestaurante.codrestaurante,
                    permissao:usuarioRestaurante.permissao,
                    id: usuarioRestaurante.id
                }
                let token = 'Bearer ' + Token.geraNovoToken(user);
                res.status(200).json({
                    message: 'Login realizado com sucesso',
                    login: 'Restaurante',
                    token: token,
                    permissao:user.permissao
                   
                });
                return;
            }

        }


    }
}