const{Model,DataTypes} =  require('sequelize');

class AreasEntregas extends Model {
    static init(sequelize){
        super.init({
           
            area:DataTypes.JSON,
            codrestaurante:DataTypes.UUID,
 
        },{
            sequelize
        })
    }

    static associate(models){
            this.belongsTo(models.UsuariosRestaurantes,{foreignKey:'codrestaurante',as:'restaurante'});
          
           
        }
}
module.exports= AreasEntregas