'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('LocalidadesRestaurantes', {  
      id:{
        type: Sequelize.BIGINT,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    bairro:{
        type:Sequelize.STRING,
    },
    cidade:{
        type:Sequelize.STRING
    },
    uf:{
        type:Sequelize.STRING
    },
    uf:{
        type:Sequelize.STRING
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
    status:{
      type:Sequelize.BOOLEAN
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
   
    return queryInterface.dropTable('LocalidadesRestaurantes');
  }
};
