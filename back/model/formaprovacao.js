const{Model,DataTypes} =  require('sequelize');

class Restaurantes extends Model {
    static init(sequelize){
        super.init({
              
            email: DataTypes.STRING,
            emailcontato: DataTypes.STRING,
            cpfcnpj:DataTypes.STRING,
            telefone:DataTypes.STRING,
            bairro:DataTypes.STRING,
            rua:DataTypes.STRING,
            codrestaurante:DataTypes.UUID,
            caminhofoto:DataTypes.STRING,
           
            
           
        },{
            sequelize
        })

        
    }
        static associate(models){
            this.belongsTo(models.Restaurantes,{foreignKey:'codrestaurante',as:'restaurante'});
        }
    }

module.exports=Restaurantes
