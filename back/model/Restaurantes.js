const { Model, DataTypes } = require('sequelize');

class Restaurantes extends Model {
    static init(sequelize) {
        super.init({

            nomefantasia: DataTypes.STRING,
            razaosocial: DataTypes.STRING,
            cnpj: DataTypes.STRING,
            numerorestaurante: DataTypes.STRING,
            email: DataTypes.STRING,
            status: DataTypes.BOOLEAN,
            tokenrestaurante: DataTypes.STRING,
            caminhofoto: DataTypes.STRING,
            codusuario: DataTypes.UUID,
            codcategoria: DataTypes.BIGINT,
            codendereco: DataTypes.BIGINT,
            descricao: DataTypes.STRING,
            stts: DataTypes.BOOLEAN,
            tempoentrega: DataTypes.BIGINT,
            entregamin: DataTypes.BIGINT,
            entregamax: DataTypes.BIGINT,
            valormin:DataTypes.DECIMAL(10,2) ,
    

        }, {
            sequelize
        })
    }
    static associate(models) {
        this.belongsTo(models.UsuariosRestaurantes, { foreignKey: 'codusuario', as: 'usuario' });

        this.belongsTo(models.CategoriasRestaurantes, { foreignKey: 'codcategoria', as: 'categoria' });
        this.belongsTo(models.Enderecos, { foreignKey: 'codendereco', as: 'endereco' });
        this.belongsTo(models.StatusFuncionamentos, { foreignKey: 'codfuncionamento', as: 'funcionamento' });
   

    }
}

module.exports = Restaurantes
