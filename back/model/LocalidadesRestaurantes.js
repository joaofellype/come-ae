const{Model,DataTypes} =  require('sequelize');

class LocalidadesRestaurantes extends Model {
    static init(sequelize){
        super.init({
           
            bairro:DataTypes.STRING,
            cidade:DataTypes.STRING,
            uf:DataTypes.STRING, 
            stts:DataTypes.BOOLEAN,
            valor: DataTypes.DECIMAL(10,2)
          
 
        },{
            sequelize
        })
    }

    static associate(models){
            this.belongsTo(models.Restaurantes,{foreignKey:'codrestaurante',as:'restaurante'});
          
           
        }
}
module.exports= LocalidadesRestaurantes