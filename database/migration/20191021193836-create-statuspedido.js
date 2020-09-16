'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('StatusPedidos', {
      id:{
        type: Sequelize.BIGINT,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    statuspedido:{
        type:Sequelize.STRING,
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

    return queryInterface.dropTable('StatusPedidos');
  }
};