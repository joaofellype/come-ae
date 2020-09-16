'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CategoriasRestaurantes', {  
      id:{
      type:Sequelize.BIGINT,
      allowNull:false,
      autoIncrement:true,
      primaryKey:true
  },
  categoriarestaurante:{
      type:Sequelize.STRING,
      allowNull:false
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
    
    return queryInterface.dropTable('CategoriasRestaurantes');
  }
};
