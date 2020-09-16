'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('Usuarios', {  
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
},
senhausuario:{
    type:Sequelize.STRING
},
expirestoken:{
  type:'TIMESTAMP'
},
numerousuario:{
   type:Sequelize.STRING
},
fotousuario:{
    type:Sequelize.STRING
},
tokenusuario:{
  type:Sequelize.STRING,
  allowNull:false
},
codfacebook:{
    type:Sequelize.STRING
},
cpf:{
  type:Sequelize.STRING
},
tokenusuario:{
    type:Sequelize.JSON
},
codfavorito:{
    type:Sequelize.BIGINT
},
codendereco:{
  type:Sequelize.BIGINT,
  references:{model:'Enderecos',key:'id'},
  onUpdate:'CASCADE',
  onDelete:'CASCADE'

},
tokenredefinir:{
  type:Sequelize.STRING
},
expiresredefinir:{
  type:'TIMESTAMP'
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
   
    return queryInterface.dropTable('Usuarios');
  }
};
