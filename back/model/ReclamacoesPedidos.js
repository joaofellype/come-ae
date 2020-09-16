const { Model, DataTypes } = require('sequelize');

class ReclamacoesPedidos extends Model {
    static init(sequelize) {
        super.init({

            motivo_reclamacao: DataTypes.STRING,
  

        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Pedidos, { foreignKey: 'codpedido', as: 'pedido' });
        this.belongsTo(models.Usuarios, { foreignKey: 'codusuario', as: 'usuario' });


    }
}
module.exports = ReclamacoesPedidos