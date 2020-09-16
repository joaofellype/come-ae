const {
    Model,
    DataTypes
} = require('sequelize');

class UsuariosFacebooks extends Model {
    static init(sequelize) {
        super.init({
            nome:DataTypes.STRING,
            dataaniversario: DataTypes.STRING,
            tokenusuario: DataTypes.STRING,
            email: DataTypes.STRING
        }, {
            sequelize
        })
    }  
 
}
module.exports = UsuariosFacebooks