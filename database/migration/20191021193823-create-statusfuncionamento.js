'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('StatusFuncionamentos', {
      id:{
        type: Sequelize.BIGINT,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    statusfuncionamento:{
        type:Sequelize.STRING,
    },
    codrestaurante:{
      type: Sequelize.UUID,
      references: {model: 'Restaurantes',key: 'id'},
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

    return queryInterface.dropTable('StatusFuncionamentos');
  }
};