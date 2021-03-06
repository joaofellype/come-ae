const{Model,DataTypes} =  require('sequelize');

class Grupos extends Model {
    static init(sequelize){
        super.init({
           
    grupo:DataTypes.STRING,
    codrestaurante:DataTypes.UUID,
        },{
            sequelize
        })
    }


    static associate(models){
            
            this.belongsTo(models.Restaurantes,{foreignKey:'codrestaurante',as:'restaurante'});
            this.belongsTo(models.UsuariosRestaurantes,{foreignKey:'codcriador',as:'criador'});
            this.belongsTo(models.UsuariosRestaurantes,{foreignKey:'codupdate',as:'atualizou'});
            
        }
}
module.exports=Grupos