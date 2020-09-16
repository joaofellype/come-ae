const {
    Model, 
    DataTypes
} = require('sequelize');

class Administradores extends Model {
    static init(sequelize) {
        super.init({

            nomeadministrador: DataTypes.STRING,
            loginadministrador: DataTypes.STRING,
            senhaadministrador: DataTypes.STRING,
            stts: DataTypes.BOOLEAN,
            
            permissoes:DataTypes.JSON,

        }, {
            sequelize
        })
    }  
  
 
}
module.exports = Administradores;