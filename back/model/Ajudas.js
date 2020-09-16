const { Model, DataTypes } = require('sequelize');

class Ajudas extends Model {
    static init(sequelize) {
        super.init({

            motivo_ajuda: DataTypes.STRING,
            detalhes_juda: DataTypes.STRING,
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            telefone: DataTypes.STRING,
            acontecimento: DataTypes.STRING,

        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Pedidos, { foreignKey: 'codpedido', as: 'pedido' });


    }
}
module.exports = Ajudas