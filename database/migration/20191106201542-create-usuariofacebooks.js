'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('UsuarioFacebooks', {  
      id:{
    type: Sequelize.UUID,
    allowNull:false,
    primaryKey:true,
},
dataaniversario:{
    type:Sequelize.STRING,
    allowNull:false
},
tokenusuario:{
   type: Sequelize.STRING,
},
email:{
   type: Sequelize.STRING,
},
nome:{
   type: Sequelize.STRING,
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
   
    return queryInterface.dropTable('UsuarioFacebooks');
  }
};
