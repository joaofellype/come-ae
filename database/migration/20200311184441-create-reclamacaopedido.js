'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      
      return queryInterface.createTable('ReclamacoesPedidos', {
         id:{
          type:Sequelize.UUID,
          allowNull:false,
          primaryKey:true,
        
         },
         motivo_reclamacao:{
           type:Sequelize.STRING
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
          codusuario:{
          type:Sequelize.UUID,
          references: {
            model: 'Usuarios',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
  
         },
         status:{
           type:Sequelize.BOOLEAN 
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
    
      return queryInterface.dropTable('ReclamacoesPedidos');
    
  }
};

