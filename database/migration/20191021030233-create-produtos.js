'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {



    return queryInterface.createTable('Produtos', {
      id: {
        type:Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      nomeproduto: {
        type: Sequelize.STRING
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2)
      },
      codcategoria: {
        type: Sequelize.BIGINT,
        references: {
          model: 'CategoriasProdutos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'

      },
      valorpromocional: {
        type: Sequelize.DECIMAL(10, 2)
      },
      adicionais:{
        type:Sequelize.JSON
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
      descricao:{
        type:Sequelize.STRING
      },
      caminhofoto: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.BOOLEAN
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
   
      return queryInterface.dropTable('Produtos');
    
  }
};