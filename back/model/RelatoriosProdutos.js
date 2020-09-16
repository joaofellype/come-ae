const {
    Model,
    DataTypes
} = require('sequelize');

class RelatoriosProdutos extends Model {
    static init(sequelize) {
        super.init({
                    stts:DataTypes.BOOLEAN,
                    valorproduto:DataTypes.DECIMAL(10,2),
        }, {
            sequelize
        })
    }
    
    static associate(models){
        this.belongsTo(models.Restaurantes,{foreignKey:'codrestaurante', targetKey:'id',as:'restaurante'}); 
        this.belongsTo(models.Produtos,{foreignKey:'codproduto',targetKey:'id', as:'produto'});
        this.belongsTo(models.Pedidos,{foreignKey:'codpedido',targetKey:'id', as:'pedido'});
       
    
       
    }
 
}
module.exports = RelatoriosProdutos