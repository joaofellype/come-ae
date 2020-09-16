const {
    Model,
    DataTypes
} = require('sequelize');

class Vouchers extends Model {
    static init(sequelize) {
        super.init({

            codvouchers: DataTypes.STRING,
            valor: DataTypes.DECIMAL(10, 2),
            nomevoucher: DataTypes.BIGINT,
            aplicacao: DataTypes.STRING,
            descricao: DataTypes.STRING,
            ativo:DataTypes.BOOLEAN,
            stts:DataTypes.BOOLEAN,
            data_inicial: 'TIMESTAMP',
            data_final: 'TIMESTAMP',
            



        }, {
            sequelize
        })
    }


}
module.exports = Vouchers;