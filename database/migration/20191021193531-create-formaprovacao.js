'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('FormsAprovacaos', {  
      id:{
        type: Sequelize.BIGINT,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true  
    },
    email:{
        type:Sequelize.STRING
    },
    emailcontato:{
       type: Sequelize.STRING
    },
    cpfcnpj:{
        type:Sequelize.STRING
    },
    telefone:{
        type:Sequelize.STRING
    },
    bairro:{
        type:Sequelize.STRING
    },
    rua:{
        type:Sequelize.STRING
    },
    caminhofoto:{
        type:Sequelize.STRING
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
   
    return queryInterface.dropTable('FormsAprovacaos');
  }
};
