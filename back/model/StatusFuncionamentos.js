const{Model,DataTypes} =  require('sequelize');

class StatusFuncionamentos extends Model {
    static init(sequelize){
        super.init({
    
            statusfuncionamento:DataTypes.STRING,
            codrestaurante:DataTypes.UUID
          
        },{
            sequelize
        })
    }

   
}
module.exports=StatusFuncionamentos