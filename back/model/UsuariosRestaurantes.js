const {
    Model,
    DataTypes
} = require('sequelize');

class UsuariosRestaurantes extends Model {
    static init(sequelize) {
        super.init({

            nomeusuario: DataTypes.STRING,
            emailusuario: DataTypes.STRING,
            senhausuario: DataTypes.STRING,
            numerousuario: DataTypes.STRING,
            cpf: DataTypes.STRING,
            codrestaurante: DataTypes.UUID,
            perfil: DataTypes.STRING,
            permissao: DataTypes.JSON,
            stts:DataTypes.BOOLEAN,
            status: DataTypes.BOOLEAN,
            idcontrole: DataTypes.BIGINT,
            tokenrecuperacao: DataTypes.STRING,
            expirestoken:'TIMESTAMP'

        }, {
            sequelize
        })
    }  
 
}
module.exports = UsuariosRestaurantes