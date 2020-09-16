const {
    Model,
    DataTypes
} = require('sequelize');

class Cidades extends Model {
    static init(sequelize) {
        super.init({
                    cidade:DataTypes.STRING,
                    stts:DataTypes.BOOLEAN
        }, {
            sequelize
        })
    }
    static associate(models){
        this.belongsTo(models.Estados,{foreignKey:'codestado', targetKey:'id',as:'estado'}); 
       
    
       
    }
 
}
module.exports = Cidades;