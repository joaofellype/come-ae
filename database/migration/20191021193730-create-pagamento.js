'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('Pagamentos', {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
      },
      idtipopagamento: {
        type: Sequelize.BIGINT,
        allowNull: false,
        reference: {
          model: 'TipoPagamentos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      idpedido: {
        type: Sequelize.BIGINT,
        allowNull: false,
        reference:{
          model:'Pedidos',
          key:'id'
        },
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
      },
      codusuario: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'UsuariosRestaurantes',
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
      }
    });
  },
  down: (queryInterface, Sequelize) => {

    return queryInterface.dropTable('Pagamentos');
  }
};