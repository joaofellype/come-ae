const Pool = require('../controllers/dbconfig')

async function createHistoricoPagamento(request, response){
    const {codpagamento} = request.body
    const now = new Date()
    await Pool.pool.query('INSERT INTO historicopagamento (codpagamento,data_criada) VALUES ($1, $2)', [codpagamento, now], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send('sucesso')
    })
}

async function ListarHistoricoPagamento(request,response){
  
  await Pool.pool.query('SELECT idhistoricopagamento FROM historicoPagamento',(error,results)=>{
      if(error){
          throw error
      }
      response.status(200).json(results.rows);
  })
}


async function buscarRestaurante(request,response){
  const{busca} = request.body;
  await Pool.pool.query('select idhistoricopagamento from historicoPagamento where idHistoricoPagamento like %$1'[busca],(error,results)=>{
      if(error){
          throw error;
      }
      response.status(200).json(results.row);
  } )
}

module.exports={
  createHistoricoPagamento,
  buscarRestaurante,
  listarHistoricoPagamento
}