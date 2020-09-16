const{Model,DataTypes} =  require('sequelize');

class Produtos extends Model {
    static init(sequelize){
        super.init({
           
      nomeproduto:DataTypes.STRING,
    valor:DataTypes.DECIMAL(10, 2),
    codcategoria:DataTypes.BIGINT,
    valorpromocional:DataTypes.DECIMAL(10,2),
    codrestaurante:DataTypes.UUID,
    caminhofoto:DataTypes.STRING,
    status:DataTypes.BOOLEAN,
    stts:DataTypes.BOOLEAN,
    statuspromocao:DataTypes.BOOLEAN,
    adicionais:DataTypes.JSON,
    descricao:DataTypes.STRING


        },{
            sequelize
        })
    }

    static associate(models){
            this.belongsTo(models.Restaurantes,{foreignKey:'codrestaurante',as:'restaurante'});
            this.belongsTo(models.CategoriasProdutos,{foreignKey:'codcategoria',as:'categoria'});
            this.belongsTo(models.Promocoes,{foreignKey:'codpromocao',as:'promocao'});
            this.belongsTo(models.UsuariosRestaurantes,{foreignKey:'codcriador',as:'criador'});
            this.belongsTo(models.UsuariosRestaurantes,{foreignKey:'codupdate',as:'atualizou'});
           
        }
}
module.exports= Produtos