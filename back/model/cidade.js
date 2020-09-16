const Pool = require('../controllers/dbconfig').Pool;
const cript = require('./criptografia');


const cadastrarCidade =(request,response)=>{
    const{nomecidade,idestado}
    now = new Date();
    Pool.pool.query('INSERT INTO cidade(nomecidade,idestado,data_criada)VALUES($1,$2,$3)',[nomecidade,idestado,now],(error,results)=>{
        if(error){
            throw error;
        }
        response.status(201).send(`Sucesso`);
    })
}