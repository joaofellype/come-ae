'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.createTable('Cidades', {
         id:{
            type: Sequelize.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
          },
          cidade:{
            type:Sequelize.STRING,
            allowNull:false
          },
          codestado:{
            type:Sequelize.INTEGER,
            references: {
              model: 'Estados',
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
   

     
      return queryInterface.dropTable('Cidades');
   
  }
};
