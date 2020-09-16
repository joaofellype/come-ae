const Pool = require('../controllers/dbconfig').Pool;




const cadastrarEstado =(request,response)=>{
    const{nomeestado}
    const now = new Date();
    Pool.pool.query('INSERT INTO estado VALUES(nomeestado,data_criada',[nomeestado,now],(error,results)=>{
        if(error){
            throw error;
        }
        response.status(201).send(`User added with ID:`);
    })
}