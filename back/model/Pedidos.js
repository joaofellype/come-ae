 const{Model,DataTypes} =  require('sequelize');

class Pedidos extends Model {
    static init(sequelize){
        super.init({
           
       
            valor:DataTypes.DECIMAL(10,2) , 
            taxaentrega:DataTypes.DECIMAL(10,2) , 

            adicionais:DataTypes.JSON,
            pedidoacancelar:DataTypes.BOOLEAN,
            observacao:DataTypes.STRING,
            status:DataTypes.BOOLEAN,
            produtos:DataTypes.JSON,
            horaconfirmacao:'TIMESTAMP',
            horapreparado:'TIMESTAMP',
            horaentregue:'TIMESTAMP',
            troco: DataTypes.DECIMAL(10,2),
            horacancelado:'TIMESTAMP',
            motivocancelado_restaurante:DataTypes.STRING,
            motivocancelado_usuario:DataTypes.STRING,
            usuariocancelado:DataTypes.STRING,
            stts:DataTypes.BOOLEAN
          
        },{
            sequelize
        })  
    }

    static associate(models){
        this.belongsTo(models.Restaurantes,{foreignKey:'codrestaurante',as:'restaurante'});
        this.belongsTo(models.Usuarios,{foreignKey:'codusuario',as:'usuario'});
        this.belongsTo(models.UsuariosFacebooks,{foreignKey:'codusuariofacebook',as:'usuariofacebook'});
        this.belongsTo(models.EnderecosUsuarios,{foreignKey:'codendereco',as:'endereco'});
        this.belongsTo(models.TiposPagamentos,{foreignKey:'codtipopagamento',as:'tipopagamento'});
  
        this.belongsTo(models.StatusPedidos,{foreignKey:'codstatuspedido',as:'statuspedido'});
        
       
    }
}
module.exports=Pedidos