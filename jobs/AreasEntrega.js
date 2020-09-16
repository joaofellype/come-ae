

const Pedido = require('../back/model/Pedidos');
const Sequelize = require("sequelize");
const db = require('../config/database');


const sequelize = new Sequelize(db);
module.exports={
    key:'AreaEntrega',
    async handle({data}){
        const {user} = data;
        for (let i = 0; i < user.length; i++) {
           
            let status = user[i].status;
            console.log(typeof(status))
            let valor = user[i].valor;
            if (status == 'true') {
                status = true;
            }if(status=='false'){
                status = false
            }
            if(valor ==''){
                valor = null
            }

            await sequelize.query('INSERT INTO "LocalidadesRestaurantes"(bairro,cidade,uf,stts,codrestaurante,valor) VALUES(?,?,?,?,?,?)',{
                replacements:[user[i].nomebairro,'São Luís','MA',user[i].status,user[i].codrestaurante, parseFloat(valor)],type: Sequelize.QueryTypes.INSERT
            })
        
        }
    }
}
   