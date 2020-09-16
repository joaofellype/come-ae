'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.createTable('Restaurantes', { 
      id:{
      type: Sequelize.UUID,
      allowNull:false,
      primaryKey:true,
      
  },
  nomefantasia:{
      type:Sequelize.STRING,
      allowNull:false
  },
  razaosocial:{
     type: Sequelize.STRING,
     allowNull:false
  },
  cnpj:{
      type:Sequelize.STRING,
      allowNull:false
  },
  numerorestaurante:{
      type:Sequelize.STRING
  },
  email:{
      type:Sequelize.STRING
  },
  status:{
      type:Sequelize.BOOLEAN
  },
  codusuario:{
      type:Sequelize.UUID,
      allowNull:false,
      references:{model:'UsuariosRestaurantes',key:'id'},
      onUpdate:'CASCADE',
      onDelete:'CASCADE'

  },
  codendereco:{
      type:Sequelize.BIGINT,
      allowNull:false,
      references:{model:'Enderecos',key:'id'},
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
  },
  codcategoria:{
      type:Sequelize.BIGINT,
      allowNull:false,
      references:{model:'CategoriasRestaurantes',key:'id'},
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
  },
  tokenrestaurante:{
      type:Sequelize.STRING
  },
  caminhofoto:{
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
  }, 
});
  },

  down: (queryInterface, Sequelize) => {
    
    return queryInterface.dropTable('Restaurantes');
  }
};
