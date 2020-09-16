const{Model,DataTypes} =  require('sequelize');

class Adicionais extends Model {
    static init(sequelize){
        super.init({
           
       nome:  DataTypes.STRING,
    descricao:DataTypes.STRING,
   
    valor: DataTypes.DECIMAL(10, 2),

    status: DataTypes.BOOLEAN,
   
    codgrupo: DataTypes.BIGINT,

    codrestaurante:DataTypes.UUID,
 
        },{
            sequelize
        })
    }

    static associate(models){
            this.belongsTo(models.Restaurantes,{foreignKey:'codrestaurante',as:'restaurante'});
            this.belongsTo(models.Grupos,{foreignKey:'codgrupo',as:'grupo'});
            this.belongsTo(models.UsuariosRestaurantes,{foreignKey:'codcriador',as:'criador'});
            this.belongsTo(models.UsuariosRestaurantes,{foreignKey:'codupdate',as:'atualizou'});
           
        }
}
module.exports= Adicionais