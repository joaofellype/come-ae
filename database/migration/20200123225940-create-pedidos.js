'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  
      return queryInterface.createTable('Pedidos', 
      {
      id: {
        type:Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      produtos:{
        type:Sequelize.JSON
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2)
      },
      codusuario: {
        type: Sequelize.UUID,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'

      },
      adicionais: {
        type: Sequelize.JSON
      },
      codstatuspedido:{
        type:Sequelize.BIGINT,
        references: {
          model: 'StatusPedidos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'


      },
      codendereco:{
        type:Sequelize.BIGINT,
        references: {
          model: 'EnderecosUsuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'

      },
      codrestaurante: {
        type: Sequelize.UUID,
        references: {
          model: 'Restaurantes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      observacao:{
        type:Sequelize.STRING
      },
      status:{
        type:Sequelize.BOOLEAN
      },
      troco:{
        type:Sequelize.NUMERIC(10,2)
      },
      codtipopagamento:{
        type:Sequelize.BIGINT,
        references: {
          model: 'TiposPagamentos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'

      },
      usuariocancelado:{
        type:Sequelize.STRING
      },
      motivocancelado:{
        type:Sequelize.STRING
      },
      createdAt:{
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP '),
        allowNull:false
      },
      updatedAt:{
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull:false
      },
      horaconfirmacao:{
        type: 'TIMESTAMP',
      },
      horapreparado:{
        type: 'TIMESTAMP',
  
      },  
      horaentregue:{
        type: 'TIMESTAMP',
   
      },  
      })
   
  
},

  down: (queryInterface, Sequelize) => {

      
      return queryInterface.dropTable(' Pedidos');
   
  }
};
