'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('HistoricosPagamentos', {  
      id:{
        type: Sequelize.BIGINT,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    codpagamento:{
        type:Sequelize.BIGINT,
        allowNull:false,
        references:{model:'Pagamentos',key:'id'},
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
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
   
    return queryInterface.dropTable('HistoricosPagamentos');
  }
};
