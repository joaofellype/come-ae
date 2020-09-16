const categoriarest = require('../model/CategoriasRestaurantes');

module.exports={
    async listarCategoriaRestaurante(){
        let categorias = await categoriarest.findAll().catch(error=> {
            console.log(error)
      
        })
        return categorias;
    }
}