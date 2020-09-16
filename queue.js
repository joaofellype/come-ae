require('dotenv').config()
const Queue = require('./Queue/Queue');
const jobsRedefinirSenha = require('./jobs/RecuperarSenha');

const jobsCadastro = require('./jobs/CadastroUsuario');
const jobsConcluir = require('./jobs/ConcluirPedido');
const jobsCancelamento = require('./jobs/CancelamentoPedido');
const jobsCancelamentoRestaurante = require('./jobs/cancelamentoPedidoRestaurante');
const cadastroRestaurante = require('./jobs/cadastroRestaurante');
const aceitarRestaurante = require('./jobs/aceitarRestaurante');
const recusarRestaurante = require('./jobs/recusarRestaurante');
const areaEntrega = require('./jobs/AreasEntrega');
const editarEntrega = require('./jobs/EditarAreasRestaurantes');
const relatorioFormaPagamento = require('./jobs/relatorioFormaPagamento');
const relatorioBairro = require('./jobs/relatorioBairro');
const relatorioProdutosMais = require('./jobs/relatoriosProdutosMais');
const relatorioProdutosMenos = require('./jobs/relatoriosProdutosMenos');
const relatorioFormaPagamentoAdmin = require('./jobs/relatorioFormaPagamentoAdmin');
const relatorioBairroAdmin = require('./jobs/relatorioBairroAdmin');
const relatorioProdutosMaisAdmin = require('./jobs/relorioProdutosMaisAdmin');
const relatorioProdutosMenosAdmin = require('./jobs/relatorioProdutosMenosAdmin');
const recuperarSenhaRestaurante = require('./jobs/recuperarSenhaRestaurante');
const relatorioTurnos = require('./jobs/relatorioTurnos');
const relatorioTurnosAdmin = require('./jobs/relatorioTurnosAdmin');

Queue.mailQueue.process(jobsRedefinirSenha.handle);


Queue.cadastroQueue.process(jobsCadastro.handle)
Queue.concluirQueue.process(jobsConcluir.handle)
Queue.cancelamentoQueue.process(jobsCancelamento.handle)
Queue.cancelamentoRestauranteQueue.process(jobsCancelamentoRestaurante.handle)
Queue.cadastroRestaurante.process(cadastroRestaurante.handle)
Queue.aceitarRestaurante.process(aceitarRestaurante.handle)
Queue.recuperarSenhaRestaurante.process(recuperarSenhaRestaurante.handle);
Queue.recusarRestaurante.process(recusarRestaurante.handle)
Queue.AreasEntrega.process(areaEntrega.handle)
Queue.editarAreasEntrega.process(editarEntrega.handle)
Queue.relatorioformaPagamento.process(relatorioFormaPagamento.handle);
Queue.relatorioBairro.process(relatorioBairro.handle);
Queue.relatorioProdutoMais.process(relatorioProdutosMais.handle);
Queue.relatorioProdutoMenos.process(relatorioProdutosMenos.handle);
Queue.relatorioFormaPagamentoAdmin.process(relatorioFormaPagamentoAdmin.handle);
Queue.relatorioBairroAdmin.process(relatorioBairroAdmin.handle);
Queue.relatorioProdutoMaisAdmin.process(relatorioProdutosMaisAdmin.handle);
Queue.relatorioProdutoMenosAdmin.process(relatorioProdutosMenosAdmin.handle);
Queue.relatorioTurnos.process(relatorioTurnos.handle);
Queue.relatorioTurnosAdmin.process(relatorioTurnosAdmin.handle);
