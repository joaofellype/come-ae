const areas = require('../model/LocalidadesRestaurantes');
const Restaurante = require('../model/Restaurantes');
const endereco = require('../model/Enderecos');
const bairro = require('../model/Bairros');
const queue = require('../../Queue/Queue');

module.exports = {
    async createArea(req, res) {
    
        let dados = req.body;
        let bairros = dados.campos;
        //mariliamoreira12345@gmail.com
    let area = await areas.findOne({attributes:['codrestaurante'],where:{codrestaurante:req.user.numeroValidacao.codrestaurante}});
        let user = bairros
    if(area){
        res.status(200).json({message:'cadastrado'});

        await queue.editarAreasEntrega.add({user});

                return;

    }else{
        res.status(200).json({message:'cadastrado'});
        await queue.AreasEntrega.add({user});
    }

    

    

    },
    async listarArea(req, res) {

      let areasBairros = await areas.findAll({attributes:['id','bairro','stts','valor'], where:{codrestaurante:req.user.numeroValidacao.codrestaurante}
          });

         if(areasBairros.length <=0){
            let bairros = await bairro.findAll({ include: [{ association: 'cidade', where: { cidade: 'São Luís' } }], attributes: ['bairro','id','stts'] });
            res.json({ data: bairros });
             return;
          }else{
              res.json({data:areasBairros});
          }
       


        //const area =  await areas.findOne({where:{codrestaurante:req.user.numeroValidacao.codrestaurante}});


    },
    async listarBairros(req, res) {


        const area = await areas.findOne({ attributes: ['area'], where: { codrestaurante: req.user.numeroValidacao.codrestaurante } });


        res.json(area);

    },

    async listarValorArea(req, res) {

        let valor = await areas.findOne({ where: { codrestaurante: req.params.codrestaurante } });

        res.json(valor);
    }
}


