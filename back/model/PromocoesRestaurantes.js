const{Model,DataTypes} =  require('sequelize');

class PromocoesRestaurantes extends Model {
    static init(sequelize){
        super.init({ 
              
            descricao: DataTypes.STRING,
            categorias: DataTypes.JSON,
            valor:DataTypes.DECIMAL(10,2),
            produtos:DataTypes.JSON,
            idsprodutos:DataTypes.JSON,
            data_inicio:DataTypes.STRING,
            data_final:DataTypes.STRING,
            caminhofoto:DataTypes.STRING,
            stts:DataTypes.BOOLEAN
        
        },{
            sequelize
        })

        
    }
        static associate(models){
            this.belongsTo(models.Restaurantes,{foreignKey:'codrestaurante',as:'restaurante'});
            this.belongsTo(models.Promocoes,{foreignKey:'codpromocao',as:'promocao'});
        }
    }

module.exports=PromocoesRestaurantes;
