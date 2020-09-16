
$(document).ready(function () {
    $('.nome-admin').text(Cookies.get("nomeAdmin"))
    $('.loader-place').append(loader)

    $.ajax({
        type:'GET',
        url:'/listarCounterAdmin',
        cache:false,
        success:(data)=>{
            $('.GerenciarCadastro').text(data.cadastros[0].cadastros);
            $('.GerenciarPed').text(data.pedidosAcancelar[0].pedidos);
            $('.countLocais').text(data.Locais[0].locais);
            $('.totalPromo').text(data.totaisPromocoes[0].total);
            $('.totalPedidos').text(data.totaisPedidos[0].total);
            $('.totalCliente').text(data.totaisClientes[0].restaurantes);
            $('.totalProdutos').text(data.totaisProdutos[0].produtos);
            $('.loader-place').empty();
        }
    })
})