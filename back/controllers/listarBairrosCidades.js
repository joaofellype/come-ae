const cidade = require('../model/Cidades');
const bairro = require('../model/Bairros');


module.exports={

    async listarCidades(req,res){

        let cidades = await cidade.findAll({include:[{association:'estado',where:{estado:req.params.uf}}],attributes:['cidade','id']});

        res.json(cidades);
    },
    async listarBairros(req,res){

        let bairros = await bairro.findAll({include:[{association:'cidade',where:{cidade:req.params.cidade}}],attributes:['bairro','id']});

        res.json(bairros)
    }
}
