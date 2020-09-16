'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    

   
      return queryInterface.createTable('CategoriasProdutos', { 
        id:{
        type: Sequelize.BIGINT,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    categoriaproduto:{
        type:Sequelize.STRING,
    },
    tipocategoria:{
       type: Sequelize.STRING,
    },
    codusuario:{
        type:Sequelize.UUID
    },
    codrestaurante:{
        type:Sequelize.UUID,
        allowNull:false,
      references:{model:'Restaurantes',key:'id'},
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
    },
   });
    
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.dropTable('CategoriasProdutos');
    
  }
};
