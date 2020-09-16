const Pool = require('../controllers/dbconfig')
const cript = require('./criptografia');





async function createAvaliacao(request,response){
    const {codusuario,codrestaurante,avaliacao,notaavaliacao,tokenavaliacao,idpedido,data_criada}=
    now = new Date()
    await Pool.pool.query('INSERT INTO avaliacao (codusuario,codrestaurante,avaliacao,notaavaliacao,tokenavaliacao,idpedido,data_criada) VALUES($1,$2,$3,$4,$5,$6,$7)'[
        codusuario,codrestaurante,avaliacao,notaavaliacao,tokenavaliacao,idpedido,data_criada],(error,response)=>{
            if(error){
                throw error
            }
            response.status(201).send(`User added with ID:`);
        })
}

async function listarAvaliacao (request,response){

    await Pool.pool.query('SELECT idavaliacao, avaliacao  FROM avaliacao',(error,results)=>{
        if(error){
            throw error
        }
        response.status(200).json(results.rows);
    })
}

module.exports={
    createAvaliacao,
    listarAvaliacao
}