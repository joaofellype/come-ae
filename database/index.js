const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const UsuarioRestaurante = require('../back/model/UsuariosRestaurantes');
const Endereco = require('../back/model/Enderecos');
const CategoriaRestaurante = require('../back/model/CategoriasRestaurantes')
const Restaurante = require('../back/model/Restaurantes')
const CategoriaProduto = require('../back/model/CategoriasProdutos');
const Adicionais = require('../back/model/Adicionais');
const Grupo = require('../back/model/Grupos');
const Produtos =require('../back/model/Produtos');
const AreasEntregas = require('../back/model/AreasEntregas')
const HorariosFuncionamentos = require('../back/model/HorariosFuncionamentos')
const Usuarios = require('../back/model/Usuarios')
const UsuariosFacebooks = require('../back/model/UsuariosFacebooks')
const Favoritos = require('../back/model/Favoritos');
const StatusPedido = require("../back/model/statusPedidos");
const StatusFuncionamentos = require("../back/model/StatusFuncionamentos");
const Pedidos = require("../back/model/Pedidos");
const EnderecosUsuarios = require('../back/model/EnderecosUsuarios');
const TiposPagamento = require('../back/model/TiposPagamentos');
const Promocoes = require("../back/model/Promocoes");
const PromocoesResturantes = require("../back/model/PromocoesRestaurantes");
const Avaliacoes = require("../back/model/Avaliacoes");
const Ajudas = require('../back/model/Ajudas');
const MotivosCancelados = require('../back/model/CancelamentosPedidos');
const Estados = require('../back/model/Estados');
const Cidades = require('../back/model/Cidades');
const Bairros = require('../back/model/Bairros');
const Vouchers = require('../back/model/Vouchers');
const Adminstradores = require('../back/model/Administradores');
const LocalidadesRestaurantes = require('../back/model/LocalidadesRestaurantes');
const RelatoriosProdutos = require('../back/model/RelatoriosProdutos');
const ReclamacoesPedidos = require('../back/model/ReclamacoesPedidos');
const connection = new Sequelize(dbConfig);


UsuarioRestaurante.init(connection);
Endereco.init(connection);
StatusPedido.init(connection);
CategoriaRestaurante.init(connection);
StatusFuncionamentos.init(connection)
HorariosFuncionamentos.init(connection);
Restaurante.init(connection);
Restaurante.associate(connection.models);
CategoriaRestaurante.init(connection);
UsuariosFacebooks.init(connection);
Usuarios.init(connection);
Usuarios.associate(connection.models);
TiposPagamento.init(connection);

CategoriaProduto.init(connection);
CategoriaProduto.associate(connection.models); 
Grupo.init(connection);
Grupo.associate(connection.models);
Adicionais.init(connection);
Adicionais.associate(connection.models);
AreasEntregas.init(connection); 
AreasEntregas.associate(connection.models);

Vouchers.init(connection);
EnderecosUsuarios.init(connection);
EnderecosUsuarios.associate(connection.models);
Pedidos.init(connection);
Pedidos.associate(connection.models);
Adminstradores.init(connection);
Favoritos.init(connection);
Favoritos.associate(connection.models); 
Promocoes.init(connection);
Promocoes.associate(connection.models);
PromocoesResturantes.init(connection);
PromocoesResturantes.associate(connection.models);
Produtos.init(connection);
Produtos.associate(connection.models);
Ajudas.init(connection);
Ajudas.associate(connection.models);
Avaliacoes.init(connection);
Avaliacoes.associate(connection.models);
Estados.init(connection);
Cidades.init(connection);
Cidades.associate(connection.models);
Bairros.init(connection);
Bairros.associate(connection.models);
MotivosCancelados.init(connection);
MotivosCancelados.associate(connection.models);
LocalidadesRestaurantes.init(connection);
LocalidadesRestaurantes.associate(connection.models);
RelatoriosProdutos.init(connection);
RelatoriosProdutos.associate(connection.models);

ReclamacoesPedidos.init(connection);
ReclamacoesPedidos.associate(connection.models);

module.exports = connection;