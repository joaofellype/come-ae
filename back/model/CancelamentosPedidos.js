const{Model,DataTypes} =  require('sequelize');

class CancelamentosPedidos extends Model {
    static init(sequelize){
        super.init({
           
        motivocancelamento:DataTypes.STRING,
 

     }, {
            sequelize
        })
    }

    static associate(models){
            
            this.belongsTo(models.Restaurantes,{foreignKey:'codrestaurante',as:'restaurante'});
            this.belongsTo(models.Pedidos,{foreignKey:'codpedido',as:'pedido'});
            this.belongsTo(models.Usuarios,{foreignKey:'codusuario',as:'usuario'});
                
        }
}
module.exports=CancelamentosPedidos;