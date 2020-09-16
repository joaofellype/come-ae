const HorarioFuncionamentos = require('../model/HorariosFuncionamentos');
const token = require('../middleware/genereteToken'), restaurante = require("../model/Restaurantes");
module.exports = {
    async createHorario(req, res) {
        let dados = req.body;

          await  HorarioFuncionamentos.create({ segunda: JSON.stringify(dados.segunda), terca: JSON.stringify(dados.terca), quarta: JSON.stringify(dados.quarta), quinta: JSON.stringify(dados.quinta), sexta: JSON.stringify(dados.sexta), sabado: JSON.stringify(dados.sabado), domingo: JSON.stringify(dados.domingo), codrestaurante: req.user.numeroValidacao.codrestaurante }).then(data => {
                res.status(200).json({message:'Horário cadastrado com sucesso'})
            }).catch(error => {


                res.status(400).json({ message: 'Erro ao cadastrar horario ', error: error })
            })
        
    },
    async listarHorario(req, res) {

        const Horario = await HorarioFuncionamentos.findOne({
            attributes: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'],
            where: {
                codrestaurante: req.user.numeroValidacao.codrestaurante

            },
            order:[
                [
                    'createdAt','DESC'
                ]
              ]
        });
        res.json(Horario);
    }

}