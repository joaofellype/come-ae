'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('Enderecos', {  
      id:{
        type: Sequelize.BIGINT,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    bairro:{
        type:Sequelize.STRING
    },
    rua:{
       type:Sequelize.STRING
    },
    nmrcasa:{
        type:Sequelize.STRING,
        allowNull:false
    },
    complemento:{
        type:Sequelize.STRING
    },
    cep:{
        type:Sequelize.STRING,
        allowNull:false
    },
    pontoreferencia:{
        type:Sequelize.STRING
    },
    coordenada:{
        type:Sequelize.STRING
    },
    cidade:{
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
   
    return queryInterface.dropTable('Enderecos');
  }
};
