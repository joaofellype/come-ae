const  Queue = require('bull');
const redis =  require('../config/redis');
const io =require('socket.io-client');


const jobRecuperar = require('../jobs/RecuperarSenha');
const jobCadastrar = require('../jobs/CadastroUsuario');
const jobConcluirPedido = require('../jobs/ConcluirPedido');
const jobCancelamentoPedido = require('../jobs/CancelamentoPedido');
const jobCancelamentoPedidoRestaurante = require('../jobs/cancelamentoPedidoRestaurante');
const jobCadastroRestaurante = require('../jobs/cadastroRestaurante');
const jobAceitarRestaurante = require('../jobs/aceitarRestaurante');
const jobRecusarRestaurante = require('../jobs/recusarRestaurante');
const jobareaEntrega = require('../jobs/AreasEntrega');
const jobeditarEntrega = require('../jobs/EditarAreasRestaurantes');
const jobRelatoriosFormaPagamento = require('../jobs/relatorioFormaPagamento');
const jobRelatoriosBairros = require('../jobs/relatorioBairro');
const jobRelatoriosProdutosMais = require('../jobs/relatoriosProdutosMais');
const jobRelatoriosProdutosMenos = require('../jobs/relatoriosProdutosMenos');
const jobRelatoriosFormaPagamentoAdmin = require('../jobs/relatorioFormaPagamentoAdmin');
const jobRelatoriosBairroAdmin = require('../jobs/relatorioBairroAdmin');
const jobRelatoriosProdutosMaisAdmin = require('../jobs/relorioProdutosMaisAdmin');
const jobRelatoriosProdutosMenosAdmin = require('../jobs/relatorioProdutosMenosAdmin');
const jobRecuperarSenhaRestaurante = require('../jobs/recuperarSenhaRestaurante');
const jobRelatorioTurnos = require('../jobs/relatorioTurnos');
const jobRelatorioTurnosAdmin = require('../jobs/relatorioTurnosAdmin');



const mailQueue = new Queue(jobRecuperar.key,redis);
const cadastroQueue = new Queue(jobCadastrar.key,redis)
const concluirQueue = new Queue(jobConcluirPedido.key,redis)
const cancelamentoQueue = new Queue(jobCancelamentoPedido.key,redis)
const cancelamentoRestauranteQueue = new Queue(jobCancelamentoPedidoRestaurante.key,redis)
const cadastroRestaurante = new Queue(jobCadastroRestaurante.key,redis);
const aceitarRestaurante = new Queue(jobAceitarRestaurante.key,redis);
const recusarRestaurante = new Queue(jobRecusarRestaurante.key,redis);
const AreasEntrega = new Queue(jobareaEntrega.key,redis);
const editarAreasEntrega = new Queue(jobeditarEntrega.key,redis);
const relatorioformaPagamento = new Queue(jobRelatoriosFormaPagamento.key,redis);
const relatorioBairro = new Queue(jobRelatoriosBairros.key,redis);
const relatorioProdutoMais = new Queue(jobRelatoriosProdutosMais.key,redis);
const relatorioProdutoMenos = new Queue(jobRelatoriosProdutosMenos.key,redis);
const relatorioFormaPagamentoAdmin = new Queue(jobRelatoriosFormaPagamentoAdmin.key,redis);
const relatorioBairroAdmin = new Queue(jobRelatoriosBairroAdmin.key,redis);
const relatorioProdutoMaisAdmin = new Queue(jobRelatoriosProdutosMaisAdmin.key,redis);
const relatorioProdutoMenosAdmin = new Queue(jobRelatoriosProdutosMenosAdmin.key,redis);
const recuperarSenhaRestaurante = new Queue(jobRecuperarSenhaRestaurante.key,redis);
const relatorioTurnos = new Queue(jobRelatorioTurnos.key,redis);
const relatorioTurnosAdmin = new Queue(jobRelatorioTurnosAdmin.key,redis);

mailQueue.on('failed',(job,err)=>{
    console.log('JOB FAILED',job.name,job.data);

    console.log(err)
})
cadastroQueue.on('failed',(job,err)=>{
    console.log('JOB FAILED',job.name,job.data);

    console.log(err)
})
concluirQueue.on('failed',(job,err)=>{
    console.log('JOB FAILED',job.name,job.data);

    console.log(err)
})
cancelamentoQueue.on('failed',(job,err)=>{
    console.log('JOB FAILED',job.name,job.data);

    console.log(err)
})
cancelamentoRestauranteQueue.on('failed',(job,err)=>{
    console.log('JOB FAILED',job.name,job.data);

    console.log(err)
})
cadastroRestaurante.on('failed',(job,err)=>{
    console.log('JOB FAILED',job.name,job.data);

    console.log(err)
})
aceitarRestaurante.on('failed',(job,err)=>{
    console.log('JOB FAILED',job.name,job.data);

    console.log(err)
})
recusarRestaurante.on('failed',(job,err)=>{
    console.log('JOB FAILED',job.name,job.data);

    console.log(err)
})
AreasEntrega.on('failed',(job,err)=>{
    console.log('JOB FAILED',job.name,job.data);

    console.log(err)
})
editarAreasEntrega.on('failed',(job,err)=>{
    console.log('JOB FAILED',job.name,job.data);

    console.log(err)
})
relatorioformaPagamento.on('failed',(job,err)=>{
    console.log('JOB FAILED',job.name,job.data);

    console.log(err)
});
relatorioFormaPagamentoAdmin.on('completed',async (job)=>{
    const socket  = io('http://localhost:3000/');
    console.log(job.data.user.nome)
    await  socket.on('news',function(data){
        
        socket.emit('my other event',{my:job.data.user.nome});
    });

})
relatorioTurnosAdmin.on('completed',async (job)=>{
    const socket  = io('http://localhost:3000/');
    console.log(job.data.user.nome)
    await  socket.on('news',function(data){
        
        socket.emit('my other event',{my:job.data.user.nome});
    });

})
relatorioBairroAdmin.on('completed',async (job)=>{
    const socket  = io('http://localhost:3000/');
    console.log(job.data.user.nome)
    await  socket.on('news',function(data){
        
        socket.emit('my other event',{my:job.data.user.nome});
    });

})
relatorioProdutoMaisAdmin.on('completed',async (job)=>{
    const socket  = io('http://localhost:3000/');
    console.log(job.data.user.nome)
    await  socket.on('news',function(data){
        
        socket.emit('my other event',{my:job.data.user.nome});
    });

})
relatorioProdutoMenosAdmin.on('completed',async (job)=>{
    const socket  = io('http://localhost:3000/');
    console.log(job.data.user.nome)
    await  socket.on('news',function(data){
        
        socket.emit('my other event',{my:job.data.user.nome});
    });

})

relatorioBairro.on('completed', async (job,err)=>{
    const socket  = io('http://localhost:3000/');
    console.log(job.data.user.nome)
    await  socket.on('news',function(data){
        
        socket.emit('my other event',{my:job.data.user.nome});
    });
})
relatorioProdutoMais.on('completed', async(job,err)=>{
    const socket  = io('http://localhost:3000/');
    console.log(job.data.user.nome)
    await  socket.on('news',function(data){
        
        socket.emit('my other event',{my:job.data.user.nome});
    });
})
relatorioProdutoMenos.on('completed',async (job,err)=>{
    const socket  = io('http://localhost:3000/');
    console.log(job.data.user.nome)
    await  socket.on('news',function(data){
        
        socket.emit('my other event',{my:job.data.user.nome});
    });
})
relatorioTurnos.on('completed',async (job,err)=>{
    const socket  = io('http://localhost:3000/');
    console.log(job.data.user.nome)
    await  socket.on('news',function(data){
        
        socket.emit('my other event',{my:job.data.user.nome});
    });
})
recuperarSenhaRestaurante.on('failed',async (job,err)=>{
    const socket  = io('http://localhost:3000/');
    console.log(job.data.user.nome)
    await  socket.on('news',function(data){
        
        socket.emit('my other event',{my:job.data.user.nome});
    });
})
recuperarSenhaRestaurante.on('completed', async ( job)=>{
    
    console.log(`Job with id ${job.id} has been completed`);

  
})

module.exports ={
    mailQueue,
    cadastroQueue,
    concluirQueue,
    cancelamentoQueue,
    cancelamentoRestauranteQueue,
    cadastroRestaurante,
    aceitarRestaurante,
    recusarRestaurante,
    AreasEntrega,
    editarAreasEntrega,
    relatorioBairro,
    relatorioFormaPagamentoAdmin,
    relatorioformaPagamento,
    relatorioProdutoMais,
    relatorioProdutoMenos,
    recuperarSenhaRestaurante,
    relatorioBairroAdmin,
    relatorioProdutoMaisAdmin,
    relatorioProdutoMenosAdmin,
    relatorioTurnos,
    relatorioTurnosAdmin,
    
} 