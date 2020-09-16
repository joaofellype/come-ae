

const Pedido = require('../back/model/Pedidos');
const Sequelize = require("sequelize");
const db = require('../config/database');


const sequelize = new Sequelize(db);
module.exports={
    key:'ConcluirPedido',
    async handle({data}){
        const {user} = data;

        console.log(user)
        const now = new Date();
        now.setHours(now.getHours() - 3);
         await sequelize.query('UPDATE "Pedidos" SET codstatuspedido =?,"updatedAt" =? WHERE id=? ', {replacements:[7,now,user.id] });
        // await Pedido.update({codstatuspedido:7},{where:{id:user.id}}).catch(err=>{
        //     console.log(err)
        // });
       
    }
}
   