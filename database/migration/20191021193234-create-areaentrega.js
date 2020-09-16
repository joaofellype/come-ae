'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('AreasEntregas', {  
      id:{
        type: Sequelize.BIGINT,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    area:{
        type:Sequelize.JSON,
    },
    codrestaurante:{
        type:Sequelize.UUID
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
   
    return queryInterface.dropTable('AreasEntregas');
  }
};
