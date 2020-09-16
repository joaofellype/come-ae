'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('UsuariosRestaurantes', {  
      id:{
    type: Sequelize.UUID,
    allowNull:false,
    primaryKey:true,
},
nomeusuario:{
    type:Sequelize.STRING,
    allowNull:false
},
emailusuario:{
   type: Sequelize.STRING,
   allowNull:false
},
senhausuario:{
    type:Sequelize.STRING
},
numerousuario:{
    type:Sequelize.STRING
},
cpf:{
    type:Sequelize.STRING
},
perfil:{
    type:Sequelize.STRING
},
permissao:{
    type:Sequelize.JSON
},
status:{
    type:Sequelize.BOOLEAN
},
idcontrole:{
    type:Sequelize.BIGINT
},
codrestaurante:{

    type:Sequelize.UUID,
    
},
tokenrecuperacao:{
    type:Sequelize.STRING
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
   
    return queryInterface.dropTable('UsuariosRestaurantes');
  }
};
