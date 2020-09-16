const adicionais = require('../model/Adicionais');

const token = require('../middleware/genereteToken')
module.exports = {

  async CadastrarAdicionais(req, res) {
    let dados = req.body.campos,
      errors;
    console.log(dados)
    req.assert(dados.nome, 'Nome Complemento Vazio').isEmpty();
 
    errors = req.validationErrors();
    if (errors) {
      res.status(400).json({
        acao: 'ERRO',
        validacao: errors
      });
    } else {
    

    await  adicionais.create({
        nome: dados.nome,
        descricao: dados.desc,
        valor: parseFloat(dados.valor.replace(',','.')),
        codgrupo: dados.grupo,
        codrestaurante:req.user.numeroValidacao.codrestaurante,
        codcriador: req.user.numeroValidacao.id  
      }).then(function(data){
        res.status(200).json({message:'Cadastrado com Sucesso'});
      }).catch(function(error){
        console.log(error )
          res.status(400).json({message:'Erro ao cadastrar'});

      });
      
    }
  },
  async listarAdicionais(req,res){
    console.log('skdksjd')
    const adicionais1 = await adicionais.findAll({attributes:['nome','id'],  where:{codrestaurante:req.user.numeroValidacao.codrestaurante,codgrupo:req.params.id}});
    console.log(adicionais1 )
    if(adicionais1==null){
        res.status(400).json({message:'Nenhum adicionais foi encontrada'});

    }else{
        res.json({data:adicionais1});
    }
},

async allAdicionais(req,res){
  const dados = await adicionais.findAll({include:{association:'grupo'}, where:{id:req.params.id}});
  console.log(dados)
  if(!dados){
    console.log('Não a daddos');
    res.status(400).json({message: 'Não a daddos'})
  }else{
    res.json(dados)
  }
},
async complementos(req,res){
  const dados = await adicionais.findAll({include:{association:'grupo', where:{id:req.params.id}}});
  console.log(dados)
  if(!dados){
    console.log('Não a daddos');
    res.status(400).json({message: 'Não a daddos'})
  }else{
    res.json(dados)
  }
},
async UpdateAdicionais(req,res){
    let id = req.params.id;
    let dados = req.body.campos;
    let errors;
    const now = new Date();
    console.log(dados)
    now.setHours(now.getHours() - 3);
    req.assert(dados.nomeComple, 'Nome Produto Vazio').isEmpty();
    errors = req.validationErrors();
    if (errors) {
      res.status(400).json({
        acao: 'ERRO',
        validacao: errors
      });
    }else{

        await adicionais.update({nome:dados.nomeComple,descricao:dados.descComple,valor: parseFloat(dados.valorComple.replace(',','.')),codupdate:req.user.numeroValidacao.id,updatedAt:now},{where:{
        id:id}}).then(function (data){
                res.status(200).json({message:'Atualizado com sucesso'});
        }).catch(function(error){
          console.log(error)
            res.status(400).json({message:'Erro ao Atualizar'});
        });  
    }
},
async DeleteAdicionais(req,res){
    let id = req.params.id;
    await adicionais.destroy({ where: { id: id} }).then(function(data){
        res.status(200).json({message:'Deletado com sucesso'});
    }).catch(function(error){
        res.status(400).json({message:'Erro ao deletar'});
    })
}

}