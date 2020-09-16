const{Model,DataTypes} =  require('sequelize');

class TiposPagamentos extends Model {
    static init(sequelize){
        super.init({
              
            tipopagamento: DataTypes.STRING,
      
        },{
            sequelize
        })

        
    }
     
    }

module.exports=TiposPagamentos
