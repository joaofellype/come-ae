'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('Avaliacaos', {  
      id:{
        type: Sequelize.BIGINT,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    avaliacao:{
        type:Sequelize.STRING
    },
    tokenavaliacao:{
       type: Sequelize.STRING
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
   
    return queryInterface.dropTable('Avaliacaos');
  }
};
