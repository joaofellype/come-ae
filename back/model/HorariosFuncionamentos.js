const{Model,DataTypes} =  require('sequelize');

class HorariosFuncionamentos extends Model {
    static init(sequelize){
        super.init({
              
            segunda: DataTypes.JSON,
            terca: DataTypes.JSON,
            quarta:DataTypes.JSON,
            quinta:DataTypes.JSON,
            sexta:DataTypes.JSON,
            sabado:DataTypes.JSON,
            domingo:DataTypes.JSON,
            codrestaurante:DataTypes.UUID
         
        },{
            sequelize
        })

        
    }
      
    }

module.exports=HorariosFuncionamentos
