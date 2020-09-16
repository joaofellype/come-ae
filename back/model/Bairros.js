const {
    Model,
    DataTypes
} = require('sequelize');

class Bairros extends Model {
    static init(sequelize) {
        super.init({
                    bairro:DataTypes.STRING,
                    stts:DataTypes.BOOLEAN
        }, {
            sequelize
        })
    } 
    static associate(models){
        this.belongsTo(models.Cidades,{foreignKey:'codcidade', targetKey:'id',as:'cidade'}); 
       
    
       
    }
 
}
module.exports = Bairros;