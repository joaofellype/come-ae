'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  
      return queryInterface.createTable('Avaliacoes', { 
        id: {
          type:  Sequelize.UUID,
          allowNull:false,
          primaryKey:true,
        },
         estrelas:{
           type:Sequelize.BIGINT,
          
         },
         avaliacao:{
           type:Sequelize.STRING
         },
         codpedido:{
          type: Sequelize.BIGINT,
          references: {
            model: 'Pedidos',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
         codusuario:{
          type: Sequelize.UUID,
          references: {
            model: 'Usuarios',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        codrestaurante:{
          type: Sequelize.UUID,
          references: {
            model: 'Restaurantes',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        createdAt:{
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull:false
        },
        updatedAt:{
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull:false
        }
      });
   
  },

  down: (queryInterface, Sequelize) => {


    
      return queryInterface.dropTable('Avaliacoes');
    
  }
};
