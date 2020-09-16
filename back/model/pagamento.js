const Pool = require('../controllers/dbconfig').Pool;

async function createPagamento(request, response){
    const {valor,codusuario,codrestaurante,idtipopagamento,idpedido} = request.body
    const now = new Date()
    await Pool.pool.query('INSERT INTO pagamento (valor, codusuario, codrestaurante,idTipopagamento,idPedido,data_criada) VALUES ($1, $2,$3,$4,$5,$6)', [valor,codusuario,codrestaurante,idtipopagamento,idpedido, now], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send('sucesso')
    })
}
module.exports={
  createPagamento
 }