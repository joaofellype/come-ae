const usuarios = require('../model/UsuariosRestaurantes');
const cript = require('./criptografia');
const uuid = require('uuid');
const {
    getToken
} = require('../middleware/genereteToken');

module.exports = {


    async createUsuarioRestaurante(req, res) {
        let dados = req.body

        if (dados.campos.senha != dados.campos.confirmSenha) {
            res.status(400).json({
                message: 'As senhas nao conferem'
            });
            return;
        }
        await usuarios.create({
            id: uuid.v4(),
            nomeusuario: dados.campos.nome,
            emailusuario: dados.campos.email,
            senhausuario: cript.hashpassword(dados.campos.senha),
            codrestaurante: req.user.numeroValidacao.codrestaurante,
            perfil: dados.perfil,
            permissao: JSON.stringify(dados.permissao),
            stts: true
        }).then(data => {
            res.status(200).json({
                message: 'Cadastrado com sucesso'
            });
        }).catch(err => {
            console.log(err);
            res.status(400).json({
                message: 'ERRO AO CADASTRAR'
            })
        })
    },
    async listarUsuarios(req, res) {

        let Usuarios = await usuarios.findAll({
            attributes: ['id', 'nomeusuario', 'emailusuario', 'perfil'],
            where: {
                codrestaurante: req.user.numeroValidacao.codrestaurante,
                stts: true
            }
        });

        res.json({
            data: Usuarios
        });
    },
    async listarUsuariosOne(req, res) {

        let Usuarios = await usuarios.findOne({
            attributes: ['nomeusuario', 'permissao', 'perfil', 'id'],
            where: {
                id: req.params.id
            }
        });

        res.json(Usuarios);
    },
    async updateUsuarios(req, res) {
        let dados = req.body
        console.log(dados)
        await usuarios.update({
            nomeusuario: dados.nome,
            perfil: dados.perfil,
            permissao: JSON.stringify(dados.permissao)
        }, {
            where: {
                id: req.params.id
            }
        }).then(data => {
            res.status(200).json({
                message: 'Atualizado com sucesso'
            });
        }).catch(err => {
            console.log(err);
        })
    },
    async deleteUsuario(req, res) {


        await usuarios.update({
            stts: false
        }, {
            where: {
                id: req.params.id
            }
        }).then(data => {
            res.status(200).json({
                message: 'Usuario Deletado com sucesso'
            });

        }).catch(err => {
            res.status(400).json({
                message: 'Erro ao deletar'
            });
        })
    },

    async redefinirSenhaUsuario(req, res) {

        let dados = req.body;
        const now = new Date();

        now.setHours(now.getHours() - 3);
        let dado = getToken(dados.token);
        await usuarios.update({
            senhausuario: cript.hashpassword(dados.senhaNova),
            updatedAt: now
        }, {
            where: {
                id: dado.numeroValidacao.id
            }
        }).then(user => {

            res.status(200).json({
                message: 'Senha redefinida com sucesso'
            });
        }).catch(err => {
            res.status(400).json({
                message: 'Erro ao redefinir a senha!',
                error: err
            });
        })
    }

}