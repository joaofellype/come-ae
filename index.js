var express = require('express'),
    handlebars = require('express-handlebars');
const bodyParser = require('body-parser'),
    session = require('express-session'),
    route = require('./client/routes/routes'),
    cookieParser = require('cookie-parser');
    flash = require('connect-flash'),
    secure = require('express-force-https'),
    helmet = require('helmet')

expressValidator = require('express-validator');
const BullBoard = require('bull-board');
const Queueu = require('./Queue/Queue');
require('./database')
require('dotenv').config()
const rotas = require('./back/routes/rotas');
const rotasAjax = require('./client/routes/routesAjax');
var port = process.env.PORT || 3000
const app = express();
//app.use(secure);
const passport = require('passport')
require('./back/middleware/passport-facebook')
require('./back/controllers/loginUsuarios')
require('./back/middleware/passport-jwt');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(helmet());
app.use(cookieParser())

app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}))
BullBoard.setQueues(Queueu.mailQueue);
BullBoard.setQueues(Queueu.cadastroQueue);
BullBoard.setQueues(Queueu.concluirQueue);
BullBoard.setQueues(Queueu.cancelamentoQueue);
BullBoard.setQueues(Queueu.cancelamentoRestauranteQueue);
BullBoard.setQueues(Queueu.cadastroRestaurante);
BullBoard.setQueues(Queueu.aceitarRestaurante);
BullBoard.setQueues(Queueu.recusarRestaurante);
BullBoard.setQueues(Queueu.AreasEntrega);
BullBoard.setQueues(Queueu.editarAreasEntrega);
BullBoard.setQueues(Queueu.relatorioformaPagamento);
BullBoard.setQueues(Queueu.relatorioBairro);
BullBoard.setQueues(Queueu.relatorioProdutoMais);
BullBoard.setQueues(Queueu.relatorioProdutoMenos);
BullBoard.setQueues(Queueu.recuperarSenhaRestaurante);
BullBoard.setQueues(Queueu.relatorioFormaPagamentoAdmin);
BullBoard.setQueues(Queueu.relatorioBairroAdmin);
BullBoard.setQueues(Queueu.relatorioProdutoMaisAdmin);
BullBoard.setQueues(Queueu.relatorioProdutoMenosAdmin);
BullBoard.setQueues(Queueu.relatorioTurnos);
BullBoard.setQueues(Queueu.relatorioTurnosAdmin);

app.use('/admin/queues',BullBoard.UI);

app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({
    extended: true,
    limit:'50mb',
    parameterLimit: 1000000

}))
app.use(bodyParser.json({
    limit:'50mb',
}));
app.use(session({
    secret: process.env.KEY_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true
    }
}))
app.use(passport.initialize());
app.use(passport.session());


app.use(expressValidator());
app.use('/views/css', express.static('./views/css'));

app.use('/views/img', express.static('./views/img'));
app.use('/js', express.static('./js'));
app.use('/', route)
app.use('/', rotas)
app.use('/', rotasAjax)

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Comeae',
            description: 'Comeae app',
            contact: {
                name: "."
            },
            servers: ["http://localhost:3000/"]
        },
        securityDefinitions: {
            Bearer: {
                type: 'apiKey',
                template: 'Bearer {apiKey}',
                name: 'Authorization',
                in: 'header',
            }
        },
    },
    apis: ["back/routes/rotas.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
let restaurantes = [];
let usuarios = [];
io.on('connection', socket => {

    socket.on("entrar", function (codigo, callback) {
        console.log(codigo)
        console.log(callback)
        if(codigo in restaurantes){
            socket.codigo = codigo;
            restaurantes[codigo] = socket;
            callback(true);
            io.emit("atualizar usuarios", Object.keys(restaurantes));
        }
        if (!(codigo in restaurantes)) {
            socket.codigo = codigo;
            restaurantes[codigo] = socket;
            callback(true);
            io.emit("atualizar usuarios", Object.keys(restaurantes));

        } else {
            callback(false)
        }
    });
    socket.on("entrar pedidos", function (codigo, callback) {
        console.log(codigo)
        console.log(callback)
        if(codigo in usuarios){
            socket.codigo = codigo;
            usuarios[codigo] = socket;
            callback(true);
            io.emit("atualizar usuarios", Object.keys(usuarios));

        }
        if (!(codigo in usuarios)) {
            socket.codigo = codigo;
            usuarios[codigo] = socket;
            callback(true);
            io.emit("atualizar usuarios", Object.keys(usuarios));

        } else {
            callback(false)
        }
    });
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });

    socket.on("enviar mensagem", function (dados, callback) {
        let mensagem_enviada = dados.msg;
        var restaurante = dados.restaurante;
       
        socket.emit("atualizar mensagens", mensagem_enviada);
        if (restaurantes[restaurante] == undefined) {
            console.log("Não Existe restaurante");
        } else {
            restaurantes[restaurante].emit("atualizar mensagens", mensagem_enviada)
        }


    });
    socket.on("enviar pedidos", function (dados, callback) {
        let mensagem_enviada = dados.msg;
        var pedido = dados.pedido;
        socket.emit("atualizar pedidos", mensagem_enviada);
        if (usuarios[pedido] == undefined) {
            console.log("Não Existe restaurante");
        } else {
            console.log('CHEGOU AKI')
            usuarios[pedido].emit("atualizar pedidos", mensagem_enviada)
        }


    });
});
server.listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
});