'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.createTable('Promocoes', {
      id:{
        type: Sequelize.UUID,
        allowNull:false,
        primaryKey:true,
     
       
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
    descricao:{
      type:Sequelize.STRING
    },
    data_inicio:{
        type: Sequelize.STRING
    },
    data_final:{
      type: Sequelize.STRING
    },
    valor:{
      type:Sequelize.DECIMAL(10,2)
    },
    produtos:{
      type:Sequelize.JSON
    },
    categorias:{
      type:Sequelize.JSON
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
      
   } );

  },

  down: (queryInterface, Sequelize) => {
  
      return queryInterface.dropTable('Promocoes');

  }
};
