'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('HorariosFuncionamentos', {  
      id:{
        type: Sequelize.BIGINT,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    segunda:{
        type:Sequelize.JSON,
    },
    terca:{
       type: Sequelize.JSON,
    },
    quarta:{
        type:Sequelize.JSON
    },
    quinta:{
        type:Sequelize.JSON
    },
    sexta:{
        type:Sequelize.JSON
    },
    sabado:{
        type:Sequelize.JSON
    },
    domingo:{
        type:Sequelize.JSON
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
   
    return queryInterface.dropTable('HorariosFuncionamentos');
  }
};
