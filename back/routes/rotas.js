
const express = require('express')
const router = express.Router()
passport = require('passport');
const Restaurante = require('../controllers/controllersRestaurante')
const Produto = require('../controllers/controllersProdutos')
const Adicionais = require('../controllers/controllersAdicionais')
const AreaEntrega = require('../controllers/controllersAreaEntregas')
const CategoriaProduto = require('../controllers/controllersCategoriaProduto')
const Grupo = require('../controllers/controllersGrupo')
const Horario = require('../controllers/controllersHorarioFuncionamento')
const autentic = require('../middleware/authentic');
const autenticRest = require('../middleware/authenticRest');
const controllerUsuario = require("../../back/controllers/controllersUsuario");
const Pedido = require("../controllers/controllersPedidos");
const Promocao = require("../controllers/controllersPromocoes");
const Token = require("../middleware/genereteToken")
const login = require("../controllers/loginUsuarios");
const loginAdminstrador = require("../controllers/loginAdministradores");
const status = require("../controllers/controllerStatusFuncionamento");
const ajuda = require('../controllers/controllerAjuda');
const avaliacao = require('../controllers/controllersAvaliacao');
const adm = require('../controllers/controllerAdmin');
const usuarioRestaurante = require('../controllers/controllersUsuariosRestaurantes');
const listarBairroCidade = require("../controllers/listarBairrosCidades");

const Voucher = require('../controllers/controllerVouchers');
const search = require('../controllers/busca');
const administrador = require('../controllers/Administradores');
const reclamacoesPedido = require('../controllers/controllerReclamacoesPedido');
const multer = require('../uploadImagem/index');

//'/app/views/img/uploads/'

require('dotenv').config();
/**
 * @swagger
 *
 * /login:
 *   post:
 *     description: Login clientes
 *   
 *     parameters:
 *       - in: formData
 *         name: email
 *         description: Informar o email do usuario.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: senha
 *         description: Informar a senha do usuario.
 *         required: true
 *         type: string
 *     tags:
 *      - Autenticação
 *     responses:
 *       200:
 *         description: Cadastrado com sucesso!
 *       401:
 *         description: Erro ao cadastrar.
 */
router.post('/login', login.login);
// /**
//  * @swagger 
//  *
//  * /cadastrarAdicional:
//  *   post:
//  *     description: Cadastrar um adicional 
//  *   
//  *     parameters:
//  *       - in: formData
//  *         name: nome
//  *         description: Nome desejado para adicional.
//  *         required: true
//  *         type: string
//  *       - in: formData
//  *         name: descricao
//  *         description: Dar descrição ao adicional.
//  *         type: string
//  *       - in: formData
//  *         name: valor
//  *         description: Informar valor ao adicional.
//  *         type: decimal
//  * 
//  *     tags:
//  *      - Adicional
//  *     responses:
//  *       200:
//  *         description: Cadastrado com sucesso!
//  *       401:
//  *         description: Erro ao cadastrar.
//  */
router.post("/cadastrarAdicional", autenticRest, Adicionais.CadastrarAdicionais)

// /**
//  * @swagger
//  *
//  * /cadastrarArea:
//  *   post:
//  *     description: Cadastrar uma nova area
//  *   
//  *     parameters:
//  *       - in: formData
//  *         name: area
//  *         description: Informar a area.
//  *         required: true
//  *         type: string 
//  *     tags:
//  *      - Area de entrega
//  *     responses:
//  *       200:
//  *         description: Cadastrado com sucesso!
//  *       401:
//  *         description: Cadastro não realizado.
//  */

router.post("/cadastrarArea", autenticRest, AreaEntrega.createArea)

// /**
//  * @swagger
//  *
//  * /cadastrarCategoriaProduto:
//  *   post:
//  *     description: Cadastra uma categoria de produtos.
//  *   
//  *     parameters:
//  *       - in: formData
//  *         name: categoriaproduto
//  *         description: Informar nome da categoria desejado.
//  *         required: true
//  *         type: string
//  *     tags:
//  *      - Categorias
//  *     responses:
//  *       200:
//  *         description: Cadastrado com sucesso!
//  *       401:
//  *         description: Erro ao cadastrar.
//  */
router.post("/cadastrarCategoriaProduto", autenticRest, CategoriaProduto.CadastrarCategorias);

// /**
//  * @swagger
//  *
//  * /cadastrarGrupo:
//  *   post:
//  *     description: Cadastrar um grupo 
//  *   
//  *     parameters:
//  *       - in: formData
//  *         name: grupo
//  *         description: Informar nome do grupo desejado.
//  *         required: true
//  *         type: string
//  *     tags:
//  *      - Grupo
//  *     responses:
//  *       200:
//  *         description: Cadastrado com sucesso!
//  *       401:
//  *         description: Erro ao cadastrar.
//  */
router.post("/cadastrarGrupo", autenticRest, Grupo.CadastrarGrupo)

// /**
//  * @swagger
//  *
//  * /cadastrarHorarioFuncionamento:
//  *   post:
//  *     description: Cadastrar um horario  
//  *   
//  *     parameters:
//  *       - in: formData
//  *         name: segunda
//  *         description: Informar horario desejado.
//  *         type: JSON
//  *       - in: formData
//  *         name: terca
//  *         description: Informar horario desejado.
//  *         type: JSON
//  *       - in: formData
//  *         name: quarta
//  *         description: Informar horario desejado.
//  *         type: JSON
//  *       - in: formData
//  *         name: quinta
//  *         description: Informar horario desejado.
//  *         type: JSON
//  *       - in: formData
//  *         name: sexta
//  *         description: Informar horario desejado.
//  *         type: JSON
//  *       - in: formData
//  *         name: sabado
//  *         description: Informar horario desejado.
//  *         type: JSON
//  *       - in: formData
//  *         name: domingo
//  *         description: Informar horario desejado.
//  *         type: JSON
//  *     tags:
//  *      - Horario Funcionamento
//  *     responses:
//  *       200:
//  *         description: Cadastrado com sucesso!
//  *       401:
//  *         description: Dado(s) incorreto(s)
//  */
router.post("/cadastrarHorarioFuncionamento", autenticRest, Horario.createHorario)

// /**
//  * @swagger
//  *
//  * /cadastrarProduto:
//  *   post:
//  *     description: Cadastrar produto 
//  *   
//  *     parameters:
//  *       - in: formData
//  *         name: nomeproduto
//  *         description: Informar nome a um produto.
//  *         required: true
//  *         type: string
//  *       - in: formData
//  *         name: descricao
//  *         description: Informar uma descrição ao produto.
//  *         required: true
//  *         type: string
//  *       - in: formData
//  *         name: preco
//  *         description: Informar valor desejado
//  *         required: true
//  *         type: decimal
//  * 
//  *     tags:
//  *      - Produtos
//  *     responses:
//  *       200:
//  *         description: Cadastrado com sucesso!
//  *       401:
//  *         description: Erro ao cadastrar.
//  */
router.post("/cadastrarProduto", autenticRest, Produto.CadastrarProduto)

/**
 * @swagger
 *
 * /cadastrarRestaurante:
 *   post:
 *     description: Cadastrar restaurante e usuario no sistema.
 *   
 *     parameters:
 *       - in: formData
 *         name: nomeDono
 *         description: Informar nome do usuario.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: emailDono
 *         description: Informar email válido para usuario.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: senhaDono
 *         description: Informar senha desejada
 *         required: true
 *         type: string
 *       - in: formData
 *         name: senhaConfirm
 *         description: Confirmar a senha.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: cpf
 *         description: Informar o cpf do usuario.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: nomefantasia
 *         description: Informar o nome fantasia do restaurante.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: razaosocial
 *         description: Informar a razão social da restaurante
 *         required: true
 *         type: string
 *       - in: formData
 *         name: email
 *         description: Informar email de contato do restaurante
 *         required: true
 *         type: string
 *       - in: formData
 *         name: numeroRestaurante
 *         description: Informar numero de contato do restaurante.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: cnpj
 *         description: Informar cnpj ou CPF do restaurante
 *         required: true
 *         type: string
 *       - in: formData
 *         name: cep
 *         description: Informar CEP do restaurante
 *         required: true
 *         type: string
 *       - in: formData
 *         name: rua
 *         description: Informar rua do restaurante.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: nmrCasa
 *         description: Informar numero do endereço do restaurante.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: bairro
 *         description: Informar bairro do restaurante.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: cidade
 *         description: Informar cidade do restaurante.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: uf
 *         description: Informar estado do restaurante.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: categoriaRestaurante
 *         description: Informar a categoria do restaurante.
 *         required: true
 *         type: string
 *     tags:
 *      - Restaurante
 *     responses:
 *       200:
 *         description: Cadastrado com sucesso!
 *       401:
 *         description: Dado(s) incorreto(s)
 */

router.post("/cadastrarRestaurante", Restaurante.CadastrarRestaurante)

// /**
//  * @swagger
//  *
//  * /log_rest:
//  *   post:
//  *     description: Loga no restaurante.
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - in: formData
//  *         name: email
//  *         description: Informar email do usuario.
//  *         required: true
//  *         type: string
//  *       - in: formData
//  *         name: senha
//  *         description: Informar senha do usuario.
//  *         required: true
//  *         type: string
//  *     tags:
//  *      - Autenticação
//  *     responses:
//  *       200:
//  *         description: Logado com sucesso!
//  *       401:
//  *         description: Erro ao logar.
//  */
router.post("/log_rest", (req, res, next) => {
  passport.authenticate(
    'local',
    { session: false },
    (error, user) => {

      if (error || !user) {
        res.status(400).json({ error: 'Email ou Senha incorreto' });
      }

      /** This is what ends up in our JWT */


      const payload = {
        id: user.id,
        nomeusuario: user.nomeUsuario,
        emailusuario: user.emailUsuario,
        codrestaurante: user.codrestaurante,
        nomefantasia: user.nomefantasia,
        permissao: user.permissao,
        expires: Date.now() + parseInt(process.env.TIME_TOKEN),
      };

      /** assigns payload to req.user */
      req.login(payload, { session: false }, (error) => {
        if (error) {
          res.status(400).send({ error });
        }

        /** generate a signed json web token and return it in the response */


        const token = 'Bearer ' + Token.geraNovoToken(payload);

        res.status(200).json({ token: token,permissao:payload.permissao});


      });
    },
  )(req, res, next);
});

// /**
//  * @swagger
//  *
//  * /listarAdicional:
//  *   get:
//  *     description: Listar adicionais 
//  *     tags:
//  *      - Adicional
//  *     responses:
//  *       400:
//  *         description: Nenhum adicional foi encontrado!
//  */
router.get("/listarAdicional", Adicionais.listarAdicionais)

/**
 * @swagger
 *
 * /verificarEmail:
 *   post:
 *     description: Verifica o email inserido pelo usuario.
 *   
 *     parameters:
 *       - in: formData
 *         name: email
 *         description: Informar email do usuario.
 *         required: true
 *         type: string
 *     tags:
 *      - Usuario
 *     responses:
 *       200:
 *         description: Sucesso.
 *       401:
 *         description: Erro ao verificar email.
 */

router.post('/verificarEmail', controllerUsuario.enviarEmail);

/**
 * @swagger
 *
 * /verificarCodigo:
 *   post:
 *     description: Verifica o codigo enviado ao email do usuario.
 *   
 *     parameters:
 *       - in: formData
 *         name: email
 *         description: Informar email do usuario.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: resultado
 *         description: Informar codigo recebido no email do usuario.
 *         required: true
 *         type: string
 *     tags:
 *      - Usuario
 *     responses:
 *       200:
 *         description: Sucesso.
 *       401:
 *         description: Codigo Expirado.
 */

router.post('/verificarCodigo', controllerUsuario.verificarCodigo);

/**
 * @swagger
 *
 * /cadastrarUsuario:
 *   post:
 *     description: Cadastra usuario para aplicação.
 *   
 *     parameters:
 *       - in: formData
 *         name: nome
 *         description: Informar nome do usuario.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: numero
 *         description: Informar numero do usuario.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: email
 *         description: Informar email do usuario.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: senha
 *         description: Informar senha do usuario.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: senhaConfirm
 *         description: Confirmar senha.
 *         required: true
 *         type: string
 *     tags:
 *      - Usuario
 *     responses:
 *       200:
 *         description: Cadastrado com sucesso!
 *       401:
 *         description: Erro ao cadastrar.
 */
router.post('/cadastrarUsuario', controllerUsuario.cadastrarUsuario);

/**
 * @swagger
 *
 * /cadastrarPedido:
 *   post:
 *     description: Faz pedido cadastrando um endereço.
 *   
 *     parameters:
 *       - in: formData
 *         name: cep
 *         description: Informar o CEP do endereço.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: rua
 *         description: Informar a rua do endereco.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: nmrcasa
 *         description: Informar numero da casa.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: bairro
 *         description: Informar bairro do endereço.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: complemento
 *         description: Informar o complemento.
 *         type: string
 *       - in: formData
 *         name: uf
 *         description: Informar uf.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: produtos
 *         required: true
 *         description: Informar produto.
 *         type: json
 *       - in: formData
 *         name: valor
 *         required: true
 *         description: Informar valor.
 *         type: string
 *       - in: formData
 *         name: adicionais
 *         required: true
 *         description: Informar adicionais.
 *         type: json
 *       - in: formData
 *         name: adicionais
 *         required: true
 *         description: Informar adicionais.
 *         type: json
 *       - in: formData
 *         name: codtipopagamento
 *         required: true
 *         description: Informar tipo pagamento.
 *         type: string
 *       - in: formData
 *         name: codrestaurante
 *         required: true
 *         description: Informar cod do restaurante.
 *         type: string
 *       - in: formData
 *         name: taxaentrega
 *         required: true
 *         description: Informar a taxa de entrega.
 *         type: string
 *     tags:
 *      - Pedidos
 *     responses:
 *       200:
 *         description: Cadastrado com sucesso!
 *       401:
 *         description: Erro ao cadastrar.
 *     security:
 *      - Bearer: []
 */

router.post('/cadastrarPedido', autentic, Pedido.cadastrarPedido);
/**
 * @swagger
 *
 * /pedidoEnde:
 *   post:
 *     description: Faz pedido com endereço já cadastrado.
 *   
 *     parameters:
 *       - in: formData
 *         name: troco
 *         description: Informar o valor do troco.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: produtos
 *         description: Informar o produto.
 *         type: JSON
 *       - in: formData
 *         name: valor
 *         description: Informar valor.
 *         type: string 
 *       - in: formData
 *         name: codtipopagamento
 *         description: Informar o codigo tipo pagamento.
 *         required: true
 *         type: string 
 *       - in: formData
 *         name: codendereco
 *         description: Informar o codigo do endereco.
 *         required: true
 *         type: string 
 *       - in: formData
 *         name: codrestaurante
 *         description: Informar o codigo do restaurante.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: adicionais
 *         description: Informar os produtos adicionais.
 *         type: JSON 
 *       - in: formData
 *         name: taxaentrega
 *         description: Informar a taxa de entrega.
 *         required: true
 *         type: string 
 *        
 *     tags:
 *      - Pedidos 
 *     responses:
 *       200:
 *         description: Cadastrado com sucesso!
 *       401:
 *         description: Erro ao cadastrar.
 *     security:
 *      - Bearer: []
 */
router.post('/pedidoEnde', autentic, Pedido.cadastrarPedidoEndereco);
/**
 * @swagger
 *
 * /cadastrarAvaliacao:
 *   post:
 *     description: Faz pedido com endereço já cadastrado.
 *   
 *     parameters:
 *       - in: formData
 *         name: nota
 *         description: Informar o Nota  do pedido.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: comentario
 *         description: Informar o o comentario do pedido.
 *         type: string
 *       - in: formData
 *         name: pedido
 *         description: Informar codigo do pedido.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: restaurante
 *         description: Informar os codigo do restaunrante.
 *         required: true
 *         type: string 
 *     tags:
 *      - Avaliacoes
 *     responses:
 *       200:
 *         description: Cadastrado com sucesso!
 *       401:
 *         description: Erro ao cadastrar.
 *     security:
 *      - Bearer: []
 */
router.post('/cadastrarAvaliacao', autentic, avaliacao.createAvaliacoes);

/**
 * @swagger
 *
 * /cadastrarEnderecoPedido:
 *   post:
 *     description: Cadastrar Endereco pelo perfil.
 *   
 *     parameters:
 *       - in: formData
 *         name: uf
 *         description: Informar o UF.
 *         required: true
 *         type: string 
 *       - in: formData
 *         name: cidade
 *         description: Informar a Cidade.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: cep
 *         description: Informar o CEP.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: bairro
 *         description: Informar o Bairro.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: rua
 *         description: Informar a rua .
 *         type: string
 *       - in: formData
 *         name: nmrcasa
 *         description: Informar o numero do lugar.
 *         required: true
 *         type: string 
 *       - in: formData
 *         name: complemento
 *         description: Informar o complemento.
 *         type: string 
 *       - in: formData
 *         name: principal
 *         description: Informar se é o principal.
 *         type: boolean 
 *     tags:
 *      - Endereço
 *     responses:
 *       200:
 *         description: Cadastrado com sucesso!
 *       401:
 *         description: Erro ao cadastrar.
 *     security:
 *      - Bearer: []
 */

router.post('/cadastrarEnderecoPedido', autentic, controllerUsuario.cadastrarEndereco);

/**
 * @swagger
 *
 * /listarAvaliacoes/{id}/{pagina}:
 *   get:
 *     description: Listar As avaliações no perfil do restaurante
 *     summary: Passar o numero da pagina e o id do restaurante na url
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pagina
 *         required: string
 *         schema:
 *           type: string
 *     tags:
 *      - Avaliacoes
 *     responses:
 *       400:
 *         description: Nenhum endereco foi encontrado!

 */
router.get('/listarAvaliacoes/:id/:pagina', avaliacao.listarAvaliacao);

router.post('/createUsuarioRestaurante', autenticRest, usuarioRestaurante.createUsuarioRestaurante);

router.get("/listarPromocoesProdutos/:cidade",Promocao.ListarTodosProdutosPromocoes);

router.post('/statusfuncionamento', autenticRest, status.createStatus);
router.post('/createAjuda', ajuda.createAjuda);
router.post('/cadastrarPromocao', autenticRest, Promocao.cadastrarPromocao);

router.post('/msgRestaurante', adm.mandarMsgRestaurante);
router.post('/msgCliente', adm.mandarMsgCliente);
router.post('/cadastrarVoucher', Voucher.cadastrarVoucher);
router.post('/validarVoucher',autentic, Voucher.regrasVoucher);
router.post('/createAdmin', administrador.cadastrarUsuario);
/**
 * @swagger
 *
 * /favoritos:
 *   post:
 *     description: Passar id do restaurante para favoritar
 *   
 *     parameters:
 *       - in: formData
 *         name: codrestaurante
 *         description: Informar o id do restaurante.
 *         required: true
 *         type: string
 *     tags:
 *      - Favoritos
 *     responses:
 *       200:
 *         description: Cadastrado com sucesso!
 *       401:
 *         description: Erro ao cadastrar.
 *     security:
 *      - Bearer: []
 */
router.post('/favoritos', autentic, controllerUsuario.createFavoritos);
/**
 * @swagger
 *
 * /redefinirSenhaCliente:
 *   post:
 *     description: Redefine a senha do cliente.
 *   
 *     parameters:
 *       - in: formData
 *         name: email
 *         description: Informar o email do cliente.
 *         required: true
 *         type: string
 *     tags:
 *      - Redefinição de senha
 *     responses:
 *       200:
 *         description: Cadastrado com sucesso!
 *       401:
 *         description: Erro ao cadastrar.
 */
router.post('/redefinirSenhaCliente', controllerUsuario.redefinirSenha);
router.post("/login_administrador", loginAdminstrador.login);
router.post('/cadastrarFotoProduto', multer.single('imgPerfil'), (req, res) => {
  console.log(req.file)
  if (req.file != undefined) {
    
    res.json({ message: req.file.path, file: req.file })
  }
})


router.get("/areas", autenticRest, AreaEntrega.listarArea)

// /**
//  * @swagger
//  *
//  * /listarCategoriaProduto:
//  *   get:
//  *     description: Listar categoria de produtos
//  *     tags:
//  *      - Categorias
//  *     responses:
//  *       400:
//  *         description: Nenhum categoria foi encontrada!
//  */
router.get("/listarCategoriaProduto", autenticRest, CategoriaProduto.listarCategoriaProduto)

// /**
//  * @swagger
//  *
//  * /listarGrupo:
//  *   get:
//  *     description: Listar grupos 
//  *     tags:
//  *      - Grupo
//  *     responses:
//  *       400:
//  *         description: Nenhum grupo foi encontrado!
//  */
router.get("/listarGrupo", autenticRest, Grupo.listarGrupo)

// /**
//  * @swagger
//  *
//  * /listarHorarioFuncionamento:
//  *   get:
//  *     description: Listar horario de funcionamento do restaurante.
//  *     tags:
//  *      - Horario Funcionamento
//  *     responses:
//  *       400:
//  *         description: Nenhum horario cadastrado.
//  */
router.get("/listarHorarioFuncionamento", autenticRest, Horario.listarHorario)

// /**
//  * @swagger
//  *
//  * /listarProduto:
//  *   get:
//  *     description: Listar produtos 
//  *     tags:
//  *      - Produtos
//  *     responses:
//  *       400:
//  *         description: Nenhum produto foi encontrado!
//  */
router.get("/listarProduto/:id", autenticRest, Produto.listarProdutos);

/**
 * @swagger
 *
 * /listarRestauranteComeae/{pagina}/{cidade}:
 *   get:
 *     summary: Passar o numero da pagina e cidade na url
 *     parameters:
 *       - in: path
 *         name: pagina
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: cidade
 *         required: string
 *         schema:
 *           type: string
 * 
 *     tags:
 *      - Restaurante
 *     responses:
 *       200:
 *        description: Listar restaurantes por cidade  
 */


router.get('/listarRestauranteComeae/:pagina/:cidade', Restaurante.listarRestauranteCidade);


/**
 * @swagger
 *
 * /listarPedidoUsuario/{id}:
 *   get:
 *     summary: Passar o id do pedido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     tags:
 *      - Pedidos 
 *     responses:
 *       200:
 *         description: Pedido buscado pelo id
 *     security:
 *      - Bearer: []
 */

router.get("/listarPedidoUsuario/:id",autentic, Pedido.listarPedidoUsuario);
/**
 * @swagger
 *
 * /listarEnderecos/{id}:
 *   get:
 *     summary: Passar o id do Endereco
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     tags:
 *      - Endereço
 *     responses:
 *       200:
 *         description: Endereco buscado por ID
 *     security:
 *      - Bearer: []
 */
router.get('/listarEnderecos/:id', autentic, controllerUsuario.listarEnd)

/**
 * @swagger
 *
 * /listarPedidosUsuarios:
 *   get:
 *     description: Listar Pedido em acompanhamento
 *     tags:
 *      - Pedidos
 *     responses:
 *       200:
 *         description: Pedido para Acompanhar 
 *       400:
 *         description: Nenhum pedido foi encontrado!
 *     security:
 *      - Bearer: []
 */
router.get("/listarPedidosUsuarios/:id", autentic, controllerUsuario.listarPedidosAcompanhar);

/**
 * @swagger
 *
 * /listarPedidousuario:
 *   get:
 *     description: Listar Todos os pedidos do usuario
 *     tags:
 *      - Pedidos
 *     responses:
 *       200: 
 *         description: Todos os pedidos do usuario
 *       400:
 *         description: Nenhum pedido foi encontrado!
 *     security:
 *      - Bearer: []
 */

router.get('/listarPedidousuario', autentic, controllerUsuario.listarPedidos);



router.put('/atualizarEnderecoPrincipal/:id',autentic,controllerUsuario.editarPrincipal)

/**
 * @swagger
 *
 * /listarFavoritos:
 *   get:
 *     description: Listar favoritos no perfil
 *     tags:
 *      - Favoritos
 *     responses:
 *       400:
 *         description: Nenhum favorito  foi encontrado!
 *     security:
 *      - Bearer: []
 */
router.get('/listarFavoritos', autentic, controllerUsuario.listarFavorito);
/**
 * @swagger
 *
 * /listarFavoritosOne:
 *   get:
 *     description: Listar favoritos no restaurante.
 *     tags:
 *      - Favoritos
 *     responses:
 *       400:
 *         description: Nenhum favorito foi encontrado!
 *     security:
 *      - Bearer: []
 */
router.get('/listarFavoritosOne', autentic, controllerUsuario.listarFavoritoOne);
/**
 * @swagger
 *
 * /listarEnderecosUsuarios:
 *   get:
 *     description: Listar todos os endereços do usuario
 *     tags:
 *      - Endereço
 *     responses:
 *       400:
 *         description: Nenhum endereco foi encontrado!
 *     security:
 *      - Bearer: []
 */
router.get('/listarEnderecosUsuarios', autentic, controllerUsuario.listarEnderecos);
/**
 * @swagger
 *
 * /enderecoLast:
 *   get:
 *     description: Listar último endereco que foi usado na compra
 *     tags:
 *      - Endereço
 *     responses:
 *       400:
 *         description: Nenhum endereco foi encontrado!
 *     security:
 *      - Bearer: []
 */

router.get('/enderecoLast', autentic, controllerUsuario.listarUltimoEndereco);
/**
 * @swagger
 *
 * /restaurantes-categorias/{cidade}/{categoria}:
 * 
 *   get:
 *     description: Listar último endereco que foi usado na compra
 *     summary: Passar a categoria e a cidade na url
 *     parameters:
 *       - in: path
 *         name: cidade
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: categoria
 *         required: string
 *         schema:
 *           type: string
 *     tags:
 *      - Restaurante
 *     responses:
 *       400:
 *         description: Nenhum endereco foi encontrado!
 */


router.get("/restaurantes-categorias/:cidade/:categoria", Restaurante.listarRestauranteCategoria);
/**
 * @swagger
 *
 * /listarRestauranteID/{id}:
 * 
 *   get:
 *     description: Listar restaurante a partir do id
 *     summary: Passar o id do restaurante pela url
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     tags:
 *      - Restaurante
 *     responses:
 *       400:
 *         description: Nenhum Restaurante foi encontrado!
 */
router.get('/listarRestauranteID/:id', Restaurante.listaRestauranteID);
/**
 * @swagger
 *
 * /buscarRestaurante/busca?search={query}:
 * 
 *   get:
 *     description: Buscar Restaurantes
 *     summary: Passar a query pela url
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     tags:
 *      - Restaurante
 *     responses:
 *       400:
 *         description: Nenhum Restaurante foi encontrado!
 */
router.get('/buscarRestaurante/:query', search.buscaRestaurante);

/**
 * @swagger
 *
 * /buscarProdutos/busca?search={query}:
 * 
 *   get:
 *     description: Buscar produtos do restaurantes
 *     summary: Passar a query pela url
 *     parameters:
 *       - in: query
 *         name: queruy
 *         required: true
 *         schema:
 *           type: string
 *     tags:
 *      - Restaurante
 *     responses:
 *       400:
 *         description: Nenhum Restaurante foi encontrado!
 */

router.get('/buscarProdutos/:query', search.buscaProdutos);


/**
 * @swagger
 *
 * /ListarPromocoesAtivas:
 * 
 *   get:
 *     description: Buscar promocoes ativa
 *     tags:
 *      - Promocoes
 *     responses:
 *       400:
 *         description: Nenhuma promoção foi encontrada!
 *       200:
 *         description: Sucesso.
 */
router.get('/ListarPromocoesAtivas', Promocao.listarPromocaosAtivasUsuarios)
/**
 * @swagger
 *
 * /listarPromocaos/{id}:
 * 
 *   get:
 *     description: Buscar produtos com promocoes ativa
 *     summary: Passar o nome da promocao e o id pela url
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     tags:
 *      - Promocoes
 *     responses:
 *       400:
 *         description: Nenhum produttos foi encontrado!
 */

router.get('/listarPromocaos/:id', Produto.listarProdutosUsu);


/**
 * @swagger
 *
 * /listarProdutos/{id}:
 * 
 *   get:
 *     description: Buscar produto pelo id
 *     summary: Passar o id do produto pela url
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string 
 *     tags:
 *      - Restaurante
 *     responses:
 *       400:
 *         description: Nenhum produttos foi encontrado!
 */
router.get('/listarProdutos/:id', Produto.listarEditar);

/**
 * @swagger
 *
 * /listarCategoriaProdutoRestaurante/{id}:
 * 
 *   get:
 *     description: Listar todas as categorias de UM restaurante
 *     summary: Passar o id do restaurante pela url
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string 
 *     tags:
 *      - Restaurante
 *     responses:
 *       400:
 *         description: Nenhum produttos foi encontrado!
 */
router.get('/listarCategoriaProdutoRestaurante/:id', CategoriaProduto.listarCategoriaProdutoRestaurante);

/**
 * @swagger
 *
 * /listarProdutoRestaurant/{id}:
 * 
 *   get:
 *     description: Listar todos produtos  de UM restaurante
 *     summary: Passar o id do restaurante pela url
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string 
 *     tags:
 *      - Restaurante
 *     responses:
 *       400:
 *         description: Nenhum produto foi encontrado!
 */

router.get('/listarProdutoRestaurant/:id', Produto.listarProdutosRestaurantes);


router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.send({ message: req.user })
});
router.get('/caminho', (req, res) => {
  res.send({ caminho: __dirname });
})

router.put('/cadastrarForm', autenticRest, Restaurante.updateRestaurante)
// /**
//  * @swagger
//  *
//  * /updateCategoriaProduto/{id}:
//  *   put:
//  *     parameters:
//  *       - in: formData
//  *         name: categoriaproduto
//  *         description: Informar novo nome para para update categoria.
//  *         required: true
//  *         type: string
//  *     description: Update em nome da categoria de produto 
//  *     tags:
//  *      - Categorias
//  *     responses:
//  *       400:
//  *         description: Erro ao atualizar produto!
//  */

router.put('/updateCategoriaProduto/:id', autenticRest, CategoriaProduto.UpdateCategoriaProduto)

// /**
//  * @swagger
//  *
//  * /updateAdicionais/{id}:
//  *   put:
//  *     parameters:
//  *       - in: formData
//  *         name: nome
//  *         description: Informar novo nome para update em Adicionais.
//  *         required: true
//  *         type: string
//  *       - in: formData
//  *         name: descricao
//  *         description: Informar nova descrição para update em Adicionais.
//  *         required: true
//  *         type: string
//  *       - in: formData
//  *         name: valor
//  *         description: Informar novo valor para update em Adicionais.
//  *         required: true
//  *         type: string 
//  *     description: Update adicionais. Necessário passar id pelo header.
//  *     tags:
//  *      - Adicional
//  *     responses:
//  *       400:
//  *         description: Erro ao atualizar adicionais!
//  */
router.put('/updateAdicionais/:id', autenticRest, Adicionais.UpdateAdicionais)

// /**
//  * @swagger
//  *
//  * /updateGrupo/{id}:
//  *   put:
//  *     parameters:
//  *       - in: formData
//  *         name: grupo
//  *         description: Informar novo nome para update em Grupo.
//  *         required: true
//  *         type: string
//  *     description: Update grupo. Necessário passar id pelo header.
//  *     tags:
//  *      - Grupo
//  *     responses:
//  *       400:
//  *         description: Erro ao atualizar grupo!
//  */
router.put('/updateGrupo/:id', Grupo.UpdateGrupo)


// /**
//  * @swagger
//  *
//  * /deleteProduto/{id}:
//  *   put:
//  *     parameters:
//  *       - in: formData
//  *         name: categoriaproduto
//  *         description: Deletar categoria produto.
//  *         required: true
//  *         type: string
//  *     description: Deletar uma categoria de produto. Necessário passar id pelo header.
//  *     tags:
//  *      - Categorias
//  *     responses:
//  *       400:
//  *         description: Erro ao deletar produto.
//  *       200:
//  *         description: Deletado com sucesso.
//  */
router.put('/deleteProduto/:id', Produto.DeleteGrupo);

/**
 * @swagger
 *
 * /deletarFavoritos/{id}:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Deletar favorito.
 *         required: true
 *         type: string
 *     description: Deletar um favorito. Necessário passar id pelo header.
 *     tags:
 *      - Favoritos
 *     responses:
 *       400:
 *         description: Erro ao deletar produto.
 *       200:
 *         description: Deletado com sucesso.
 */

router.put('/deletarFavoritos/:id', autentic, controllerUsuario.deletarFavoritos);
router.put('/pedidosAcancelarUsuarios/:id', autentic, Pedido.pedidoAcancelarUsuario);

router.put('/updateStatusProduto/:id', Produto.updateStatusProduto);
router.put("/updateUsuariosRestaurante/:id", autenticRest, usuarioRestaurante.updateUsuarios)

/**
 * @swagger
 *
 * /AlterarSenhaUsuario:
 * 
 *   put:
 *     parameters:
 *       - in: formData
 *         name: senha
 *         description: Insira nova senha do usuario.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: senhaantiga
 *         description: Insira senha antiga do usuario.
 *         required: true
 *         type: string
 *     description: Altera a senha do usuario. Necessário passar id pelo header.
 *     tags:
 *      - Usuario
 *     responses:
 *       400:
 *         description: Erro ao alterar senha.
 *       200:
 *         description: Alterado com sucesso.
 *     security:
 *      - Bearer: []
 */

router.put("/AlterarSenhaUsuario", autentic, controllerUsuario.alterarSenha)
router.put('/aprovarPromocao/:id', adm.aprovarPromocoes);
router.get('/listarBairros/:cidade',listarBairroCidade.listarBairros);
router.get('/listarCidades/:uf',listarBairroCidade.listarCidades);
router.put('/confirmarRestaurante/:idrestaurante/:idusuario', adm.aprovarForm)
router.put('/updateproduto/:id', autenticRest, Produto.UpdateProduto)
router.put('/confirmarPedido/:id', Pedido.confirmarPedido);
router.put('/despachaPedido/:id', Pedido.despacharPedido);
router.put('/finalizarPedido/:id', Pedido.finalizarPedido);
router.put('/cancelarPedido/:id', autenticRest, Pedido.cancelarPedido);

router.post("/createReclamacoes",autentic,reclamacoesPedido.createReclamacao);

/**
 * @swagger
 *
 * /deletarEnderecoUsuario/{id}:
 * 
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Informe o id do endereço.
 *         required: true
 *         type: string
 *     description: Deletar endereco do usuario. Necessário passar id pelo header.
 *     tags:
 *      - Endereço
 *     responses:
 *       400:
 *         description: Erro ao deletar Enderecos.
 *       200:
 *         description: Alterado com sucesso.
 *     security:
 *      - Bearer: []
 */
router.put('/deletarEnderecoUsuario/:id',autentic, controllerUsuario.deletarEndereco);
/**
 * @swagger
 *
 * /atualizarUsuario:
 *   put:
 *     parameters:
 *       - in: formData
 *         name: nome
 *         description: nome do usuario.
 *         required: false
 *         type: string
 *       - in: formData
 *         name: cpf
 *         description: CPF do usuario.
 *         required: false
 *         type: string
 *       - in: formData
 *         name: numero
 *         description: Numero do usuario.
 *         type: string
 *         required: false
 *     description: Atualiza os dados do usuario.
 *     tags:
 *      - Usuario
 *     responses:
 *       400:
 *         description: Erro ao alterar senha.
 *       200:
 *         description: Alterado com sucesso.
 *     security:
 *      - Bearer: []
 */
router.put('/atualizarUsuario', autentic, controllerUsuario.updateUsuario);
router.put("/updateEndereco/:id",autentic, controllerUsuario.editarEndereco);
/**
 * @swagger
 *
 * /updateSenhaUsuario:
 *   put:
 *     parameters:
 *       - in: formData
 *         name: senha
 *         description: Insira senha novo do usuario.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: token
 *         description: Insira o token enviado no email.
 *         required: true
 *         type: string
 *     description: Faz a confirmação de alteração de senha do usuario.
 *     tags:
 *      - Usuario
 *     responses:
 *       400:
 *         description: Erro ao alterar senha.
 *       200:
 *         description: Alterado com sucesso.
 */
router.put('/updateSenhaUsuario', controllerUsuario.confirmarSenha);
router.put('/updateSenhaUsuarioRestaurante', usuarioRestaurante.redefinirSenhaUsuario);
router.put('/atualizarTempoEntrega',autenticRest,Restaurante.atualizarTempoEntrega);
router.get('/listarTempoEntrega',autenticRest, Restaurante.listarMaxMin);
router.put('/cancelarPedidoAdmin/:id',adm.cancelarPedido)
router.put('/reprovarForm/:codrestaurante/:idusuario', adm.recusarForm);
router.put("/deletarUsuario",usuarioRestaurante.deleteUsuario);
// /**
//  * @swagger
//  *
//  * /deleteCategoriaProduto/{id}:
//  *   delete:
//  *     parameters:
//  *       - in: formData
//  *         name: grupo
//  *         description: Deletar categoria de produtos.
//  *         required: true
//  *         type: string
//  *     description: Deleta uma categoria de  produtos. Necessário passar id pelo header.
//  *     tags:
//  *      - Grupo
//  *     responses:
//  *       400:
//  *         description: Erro ao deletar grupo.
//  *       200:
//  *         description: Deletado com sucesso.
//  */

router.delete('/deleteCategoriaProduto/:id', autenticRest, CategoriaProduto.DeleteCategoria)

// /**
//  * @swagger
//  *
//  * /deleteAdicionais/{id}:
//  *   delete:
//  *     parameters:
//  *       - in: formData
//  *         name: adicionais
//  *         description: Deletar adicional.
//  *         required: true
//  *         type: string
//  *     description: Deletar um adicional. Necessário passar id pelo header.
//  *     tags:
//  *      - Adicional
//  *     responses:
//  *       400:
//  *         description: Erro ao deletar adicional.
//  *       200:
//  *         description: Deletado com sucesso.
//  */
router.delete('/deleteAdicionais/:id', autenticRest, Adicionais.DeleteAdicionais)
router.delete('/excluir_complemento/:id',Adicionais.DeleteAdicionais)


router.delete('/deleteGrupo/:id', Grupo.DeleteGrupo);

module.exports = router
