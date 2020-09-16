const {
    Model,
    DataTypes
} = require('sequelize');

class Favoritos extends Model {
    static init(sequelize) {
        super.init({
                    stts:DataTypes.BOOLEAN
        }, {
            sequelize
        })
    }
    
    static associate(models){
        this.belongsTo(models.Restaurantes,{foreignKey:'codrestaurante', targetKey:'id',as:'restaurante'}); 
        this.belongsTo(models.Usuarios,{foreignKey:'codusuario',targetKey:'id', as:'usuario'});
       
    
       
    }
 
}
module.exports = Favoritos