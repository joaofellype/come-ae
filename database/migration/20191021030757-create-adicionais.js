'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  

    
      return queryInterface.createTable('Adicionais', { 
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      nome: {
          type: Sequelize.STRING
      },
      descricao: {
          type: Sequelize.STRING
      },
      valor: {
          type: Sequelize.DECIMAL(10, 2)
      },
      status: {
          type: Sequelize.BOOLEAN
      },
      codgrupo: {
          type: Sequelize.BIGINT,
          references: {
            model: 'Grupos',
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
      createdAt:{
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
   
      return queryInterface.dropTable('Adicionais');
    
  }
};
