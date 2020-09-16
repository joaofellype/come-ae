'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.createTable('Estados', {
         id:{
            type: Sequelize.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
          },
          estado:{
            type:Sequelize.STRING,
            allowNull:false
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
   

     
      return queryInterface.dropTable('Estados');
   
  }
};
