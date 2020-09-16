const{Model,DataTypes} =  require('sequelize');

class EnderecosUsuarios extends Model {
    static init(sequelize){
        super.init({
           
            bairro:DataTypes.STRING ,
            rua:DataTypes.STRING ,
            nmrcasa:DataTypes.STRING,
            complemento:DataTypes.STRING,
            cep:DataTypes.STRING,
            pontoreferencia:DataTypes.STRING,
            coordenada:DataTypes.STRING,
            uf:DataTypes.STRING,
            cidade:DataTypes.STRING,
            principal:DataTypes.BOOLEAN,
            stts:DataTypes.BOOLEAN
            
        },{
            sequelize
        })
    }
 
    static associate(models){
            
         this.belongsTo(models.Usuarios,{foreignKey:'codusuario',as:'usuario'});
         this.belongsTo(models.UsuariosFacebooks,{foreignKey:'codusuariofacebook',as:'usuariofacebook'}); 
        
    }
}
module.exports=EnderecosUsuarios