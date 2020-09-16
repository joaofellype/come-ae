const Pool = require('../controllers/dbconfig')



async function buscaBairro(idCidade){
    let bairros;
    try{
        const{rows}  = await Pool.pool.query('SELECT nomebairro,\'<p><label> <input type="checkbox" id="checkbairros" checked="checked" /><span></span></label></p>\' as coluna2,\' <input class="browser-default textValor" name="valorFrete" id="valorFrete" type="text"  >\' as coluna3 from bairro WHERE idcidade='+idCidade);
        bairros = rows;
        return bairros


    }catch(error){
        console.log(error)
    }
}
  async function  buscaCidade(idBairro){
    let bairros;
    try{
        const{rows} = await Pool.pool.query('SELECT idcidade, nomecidade from cidade WHERE idestado='+idBairro);
        bairros = rows;
        return bairros


    }catch(error){
        console.log(error)
    }
}

async function createArea(dado){
    let now = new Date()
    try{
        await Pool.pool.query('INSERT INTO areaentrega (area,codrestaurante,data_criada) VALUES ($1,$2,$3)',[JSON.stringify(dado.area), dado.codrestaurante,now]);
        return true
    }catch(error){
        console.log(error)
        return false;
    }
}

async function listarArea(id){
    let area;
    try{
        const{rows} = await Pool.pool.query('SELECT area, idarea FROM areaentrega WHERE codrestaurante =$1 ORDER BY idarea DESC LIMIT 1',[id]);
        area = rows;
        console.log(area)
        return area;
    }catch(error){
        console.log(error)
    }
}
module.exports ={
    buscaBairro,
    buscaCidade,
    createArea,
    listarArea
}