const{Model,DataTypes} =  require('sequelize');

class StatusPedidos extends Model {
    static init(sequelize){
        super.init({
           
    statuspedido:DataTypes.STRING,


     }, {
            sequelize
        })
    }

}
module.exports=StatusPedidos