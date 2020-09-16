'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      
      return queryInterface.createTable('Ajudas', {
         id:{
          type:Sequelize.UUID,
          allowNull:false,
          primaryKey:true,
        
         },
         motivo_ajuda:{
           type:Sequelize.STRING
         },
         detalhes_ajuda:{
           type:Sequelize.STRING
         },
         nome:{
            type:Sequelize.STRING
         }, 

    email:{
     type: Sequelize.STRING,
    }, 
   
    telefone:{
      type:Sequelize.STRING,

    },

    acontecimento:{
    type:  Sequelize.STRING,
    }
        });
    
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.dropTable('Ajudas');
    
  }
};
