const express = require('express');
const router = express.Router();

const categoria = require('../../back/controllers/controllersCategoriaProduto');
const grupo = require('../../back/controllers/controllersGrupo');
const horario = require('../../back/controllers/controllersHorarioFuncionamento');
const adicionais = require('../../back/controllers/controllersAdicionais');
const produto = require('../../back/controllers/controllersProdutos');
const pedidos = require('../../back/controllers/controllersPedidos');
const authentic = require('../../back/middleware/authentic');
const authenticAdmin = require('../../back/middleware/authenticAdmin');
const autenticRest = require('../../back/middleware/authenticRest');
const funcionamento = require('../../back/controllers/controllerStatusFuncionamento')
const usuario = require('../../back/controllers/controllersUsuario');
const promocao = require('../../back/controllers/controllersPromocoes');
const restaurante = require('../../back/controllers/controllersRestaurante');
const areaEntrega = require('../../back/controllers/controllersAreaEntregas');
const search = require('../../back/controllers/busca');
const usuariosRestaurantes = require('../../back/controllers/controllersUsuariosRestaurantes');
const adms = require('../../back/controllers/controllerAdmin');
const avaliacao = require("../../back/controllers/controllersAvaliacao");
const cadastrarToken = require("../../back/controllers/cadastrarToken");
const relatorios = require("../../back/controllers/relatorios");
const ajuda = require('../../back/controllers/controllerAjuda');
const reclamacaoPedido = require('../../back/controllers/controllerReclamacoesPedido');
const fs = require('fs');


router.get('/exportarPdf/:nome', (req, res) => {
    console.log(__dirname)
    var file = fs.createReadStream('./pdf/'+req.params.nome+'.pdf');
    var stat = fs.statSync('./pdf/'+req.params.nome+'.pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    file.pipe(res);
});

router.get("/listarUsuario", authentic, usuario.listarUsuario)
router.get("/listarBairros", autenticRest, areaEntrega.listarBairros);
router.get('/listarUsuariosRestaurantesOne/:id', usuariosRestaurantes.listarUsuariosOne);
router.get('/listarReclamacaoPedido', reclamacaoPedido.listarReclamacoes)
router.get("/listarFaturamento",autenticRest, restaurante.FaturaFormPagamento);
router.get("/listarhorario",autenticRest, restaurante.relatorioTurnos);
router.get("/listarBairro", autenticRest, restaurante.relatorioBairro);
router.get("/listarOsMais", autenticRest, restaurante.relatorioProdutoMais);
router.get("/listarOsMenos", autenticRest, restaurante.relatorioProdutoMenos);

router.get("/listarFaturamentoAdm/:codrestaurante", authenticAdmin,adms.relatorioFormaPagamento);
router.get("/listarBairroAdm/:codrestaurante", adms.relatorioBairro);
router.get("/listarOsMaisAdm/:codrestaurante", adms.relatorioProdutosMais);
router.get("/listarOsMenosAdm/:codrestaurante", adms.relatorioProdutosMenos);
router.get("/listarTurnos/:codrestaurante", adms.relatorioTurnos);

router.get("/listarFaturamentoTudo", autenticRest, relatorios.faturamentoTudo);
router.get("/listarBairroTudo", autenticRest, relatorios.relatorioBairroTudo);
router.get("/listarOsMaisTudo", autenticRest, relatorios.relatorioProdutosMaisVendidosTudo);
router.get("/listarOsMenosTudo", autenticRest, relatorios.relatorioProdutosMenosVendidosTudo);


router.get("/listarFaturamentoDia", autenticRest, relatorios.faturamentoEspecifico);
router.get("/listarBairroDia", autenticRest, relatorios.relatorioBairroeEspecifico);
router.get("/listarOsMaisDia", autenticRest, relatorios.relatorioProdutosMaisVendidosEspecifico);
router.get("/listarOsMenosDia", autenticRest, relatorios.relatorioProdutosMenosVendidosEspecifico);


router.get('/promocoesAtivasRestaurante', autenticRest, promocao.listarPromocaosAtivas);

router.get("/listarAllAjudas", ajuda.listarAjuda);
router.get('/listarAllRestaurante', restaurante.listarAllRestaurantes);
router.get("/listarPedido", pedidos.listarPedidosNovos);
router.get("/listarPedidoFechados", pedidos.listarPedidosFinalizado);
router.get('/listarPedidosCancelados', autenticRest, pedidos.listarPedidosCancelado);
router.get('/listaAllPedidos', pedidos.listarAllPedidos);
router.get('/listarCounterAdmin', adms.counterAdmin);
router.get('/listarPedidosCanceladosAdmin', pedidos.listarPedidosCanceladosAdmin);
router.get('/listarAllPedidosOne/:id', pedidos.listarAllPedidosOne);
router.get('/listarProdutosPromocao/:id/:bairro', produto.listarProdutosUsu);

router.get("/listarPedidosEntrega", pedidos.listarPedidosEntrega);

router.get('/listarProdutoRestaurant/:id', produto.listarProdutosRestaurantes);


router.get('/counterCategorias', autenticRest, restaurante.countersCategorias);
router.get('/buscarTotal', search.buscarProdutosRestaurante);
router.get('/countNovosPedidos', autenticRest, pedidos.countNovosPedidos);

router.get('/taxaEntrega/:codrestaurante', authentic, areaEntrega.listarValorArea);
router.get('/listarProdutosAdmin', adms.listarProdutos);
router.get('/listarProdutosOneAdmin/:id', adms.listarProdutosOneAdmin);
router.get('/listarAvaliacaoRestaurante', autenticRest, restaurante.avaliacaoRestaurante);
router.get('/listarPedidosAcancelarOne/:id', adms.listarPedidosAcancelarOne);
router.get('/listarComentariosAvaliacoes', autenticRest, restaurante.avaliacaoRestaurante);
router.get("/listarAllClientes", adms.listarUsuarios);
router.get('/listarUsuarios', autenticRest, usuariosRestaurantes.listarUsuarios);
router.get('/listarPedidosAcancelar', adms.listarPedidosAcancelar);
router.get('/listarRestaurantesAdm', adms.listarRestaurante);
router.get('/listarRestaurantesCancelados', adms.listarRestaurantesCancelado);
router.get('/listarRestauranteAprovados', adms.listarRestaurantesAprovados);
router.get('/listarOneRestauranteAdmin/:idRestaurante', adms.listarOneRestaurante);
router.get('/listarAllPromocoes', adms.listarPromocoes);
router.get('/listarAllPromocoesAtivas', adms.listarPromocoesAtiva);
router.get('/listarAllPromocoesInativas', adms.listarPromocoesInativa);
router.get('/listarStatusFuncionamento', autenticRest, funcionamento.listarFuncionamentoRestaurante)
router.get('/listarOnePromocoesAdmin/:id', adms.listarPromocoesOne);
router.get('/listarOneUsuarios/:id', adms.listarOneUsuarios);

router.get('/horario', autenticRest, horario.listarHorario)
router.get('/editarProduto/:id', autenticRest, produto.listarEditar);
router.get('/pedidosOne/:id', autenticRest, pedidos.listarOnePedido);
router.get('/listarEmPreparacao', pedidos.listarEmPreparacao);

router.get('/listarProdutosRestaurante/:id', produto.listarProdutosRestaurante);

router.get("/listarComentariosAvaliacao", autenticRest, avaliacao.listarAvaliacaoComentario);
router.get("/listarCountEstrelas", autenticRest, avaliacao.listarQuantidadesAvaRestaurante);
router.get("/listarAvaliacoesMes", autenticRest, avaliacao.listarAvaliacoesMes);
router.get("/listarMediaRestaurante", autenticRest, avaliacao.listarMediaAvaliacoes);

router.get('/editarAdicionais/:id', adicionais.allAdicionais)


router.get('/listarAdicionais/:id', autenticRest, adicionais.listarAdicionais);





router.get("/all_produto/:codcategoria/:codrestaurante", produto.listarProdutoPromo)

router.post('/cadastrarToken', cadastrarToken.cadastrarToken);

router.get('/all_produto/:id/', autenticRest, produto.listarProdutosCategoria);

router.get('/categorias', autenticRest, categoria.listarCategoriaProduto);

router.get('/grupo', autenticRest, grupo.listarGrupo);

router.get('/comple/:id', adicionais.complementos);


module.exports = router