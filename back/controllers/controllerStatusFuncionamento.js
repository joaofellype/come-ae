const statusFuncionamento = require('../model/StatusFuncionamentos');
const restaurante = require('../model/Restaurantes');

module.exports={

    async createStatus(req,res){

        let dados = req.body;
        console.log(dados.statusfuncionamento)

        let funcionamento = await statusFuncionamento.findOne({where:{codrestaurante:req.user.numeroValidacao.codrestaurante}});
        if(funcionamento){
            await statusFuncionamento.update({statusfuncionamento:dados.statusfuncionamento,codrestaurante:req.user.numeroValidacao.codrestaurante},{where:{id:funcionamento.id}}).then(data=>{
                 restaurante.update({codfuncionamento:data.id},{where:{id:req.user.numeroValidacao.codrestaurante}}).catch(err=>{
                   res.status(200).json({message:'Atuaçlizado com sucesso'})
                })
            }).catch(err=>{
                res.status(400).json({message:'Erro ao atualizar'})
    
            })
        }else{
            await statusFuncionamento.create({statusfuncionamento:dados.statusfuncionamento,codrestaurante:req.user.numeroValidacao.codrestaurante}).then(data=>{
                 restaurante.update({codfuncionamento:data.id},{where:{id:req.user.numeroValidacao.codrestaurante}}).catch(err=>{
                    res.status(200).json({message:'Atuaçlizado com sucesso'})
                })
            }).catch(err=>{
                res.status(400).json({message:'Erro'})
            })
        }
       

    },
    async listarFuncionamento(id){

        let funcionamento = await statusFuncionamento.findOne({attributes:['statusfuncionamento'],where:{codrestaurante:id}}).catch(err=>{
            console.log(err);
        })

        return funcionamento;
    },   
     async listarFuncionamentoRestaurante(req,res){

        let funcionamento = await statusFuncionamento.findOne({attributes:['statusfuncionamento'],where:{codrestaurante:req.user.numeroValidacao.codrestaurante}}).catch(err=>{
            console.log(err);
        })
        console.log(funcionamento)
        res.json(funcionamento) ;
    }
}                                                                                

