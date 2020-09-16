const{Model,DataTypes} = require('sequelize');

class CategoriasRestaurantes extends Model {
    static init(sequelize){
        super.init({
            
            categoriarestaurante:DataTypes.STRING
        },{
            sequelize
        })
    }

  
}
module.exports=CategoriasRestaurantes
