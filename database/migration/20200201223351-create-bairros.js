'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.createTable('Bairros', {
         id:{
            type: Sequelize.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
          },
          bairro:{
            type:Sequelize.STRING,
            allowNull:false
          },
          codcidade:{
            type:Sequelize.INTEGER,
            references: {
              model: 'Cidades',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
    
      
          },
          createdAt:{
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP '),
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
   

     
      return queryInterface.dropTable('Bairros');
   
  }
};
