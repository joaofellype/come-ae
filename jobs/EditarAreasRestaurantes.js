

const Pedido = require('../back/model/Pedidos');
const Sequelize = require("sequelize");
const db = require('../config/database');


const sequelize = new Sequelize(db);
module.exports={
    key:'editarEntrega',
    async handle({data}){
        const {user} = data;
        for (let i = 0; i < user.length; i++) {
           
            let status = user[i].status;
            let valor = user[i].valor;
            if (status == 'true') {
                status = true;
            }if(status=='false'){
                status = false
            }
            if(valor ==''){
                valor =0
            }

            await sequelize.query('UPDATE  "LocalidadesRestaurantes" SET bairro=?,cidade=?,uf=?,stts=?,codrestaurante=?,valor=? WHERE id =?',{
                replacements:[user[i].nomebairro,'São Luís','MA',user[i].status,user[i].codrestaurante, parseFloat(valor),user[i].id],type: Sequelize.QueryTypes.UPDATE
            })
        
        }
    }
}
   