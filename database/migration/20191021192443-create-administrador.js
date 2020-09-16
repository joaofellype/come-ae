'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('Administradores', {  
     id:{
      type: Sequelize.UUID,
      allowNull:false,
      primaryKey:true,
     },
     nomeadministrador:{
       type: Sequelize.STRING,
       allowNull:false
     },
     loginadministrador:{
      type: Sequelize.STRING,
      allowNull:false
   },
   senhaadministrador:{
       type:Sequelize.BIGINT,
       allowNull:false
   },
   tokenadministrador:{
       type:Sequelize.STRING
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
   
    return queryInterface.dropTable('Administradores');
  }
};
