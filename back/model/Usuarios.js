const {
    Model, 
    DataTypes
} = require('sequelize');

class Usuarios extends Model {
    static init(sequelize) {
        super.init({

            nomeusuario: DataTypes.STRING,
            emailusuario: DataTypes.STRING,
            senhausuario: DataTypes.STRING,
            numerousuario: DataTypes.STRING,
            fotousuario: DataTypes.STRING,
            cpf:DataTypes.STRING,
            codfavorito: DataTypes.BIGINT,
            codfacebook:DataTypes.STRING,
            codendereco: DataTypes.BIGINT,
            tokenvalidacao: DataTypes.STRING,
            expirestoken:'TIMESTAMP',
            tokenredefinir:DataTypes.STRING,
            expiresredefinir:'TIMESTAMP'

        }, {
            sequelize
        })
    }  
    static associate(models){
            
        this.hasMany(models.Enderecos,{foreignKey:'codendereco',as:'endereco'});
       
    }
 
}
module.exports = Usuarios