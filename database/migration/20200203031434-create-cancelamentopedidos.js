'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.createTable('CancelamentosPedidos', {
         id:{
            type: Sequelize.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
          },
          motivocancelamento:{
            type:Sequelize.STRING,
            allowNull:false
          },
          codpedido:{
            type:Sequelize.INTEGER,
            references: {
              model: 'Pedidos',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
    
      
          },
          codrestaurante:{
            type:Sequelize.UUID,
            references: {
              model: 'Restaurantes',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
    
      
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
      });
    
  },

  down: (queryInterface, Sequelize) => {
   

     
      return queryInterface.dropTable('CancelamentosPedidos');
   
  }
};
