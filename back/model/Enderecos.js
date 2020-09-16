const{Model,DataTypes} =  require('sequelize');

class Enderecos extends Model {
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
            cidade:DataTypes.STRING
        },{
            sequelize
        })
    }
}
module.exports=Enderecos