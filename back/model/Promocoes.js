 const{Model,DataTypes} =  require('sequelize');

class Promocoes extends Model {
    static init(sequelize){
        super.init({
              
            descricao: DataTypes.STRING,
            categorias: DataTypes.JSON,
            produtos:DataTypes.JSON,
            valor:DataTypes.DECIMAL(10,2),
            data_inicio:DataTypes.STRING,
            data_final:DataTypes.STRING
        
        },{
            sequelize
        })

        
    }
        static associate(models){
            this.belongsTo(models.Restaurantes,{foreignKey:'codrestaurante',as:'restaurante'});
        }
    }

module.exports=Promocoes
