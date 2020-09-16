const{Model,DataTypes} =  require('sequelize');

class Avaliacoes extends Model {
    static init(sequelize){
        super.init({
           
            estrelas:DataTypes.BIGINT,
            avaliacao:DataTypes.STRING,
 
        },{
            sequelize
        })
    }

    static associate(models){
            this.belongsTo(models.Restaurantes,{foreignKey:'codrestaurante',as:'restaurante'}); 
            this.belongsTo(models.Usuarios,{foreignKey:'codusuario',as:'usuario'}); 
            this.belongsTo(models.Pedidos,{foreignKey:'codpedido',as:'pedido'});
          
           
        } 
}
module.exports= Avaliacoes