module.exports = {
    salvarCookies(req, res, next) {


        let dados = req.body;

        let carrinho = [];
        let c =[]
        if (req.cookies.carrinho == undefined) {
            res.cookie('carrinho', dados);
            res.status(200).json({
                message: 'kjkjdskdjskdjs'
            });
        }


        let i = req.cookies.carrinho;

        carrinho.push(i);
        c.push(carrinho.concat(dados))
        res.cookie('carrinho', carrinho);
        c.forEach(el=>{
            console.log(el[1]);
        })
        res.status(200).json({
            message: 'kjkjdskdjskdjs'
        });










    }
}