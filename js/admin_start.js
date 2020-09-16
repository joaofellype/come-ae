
$(document).ready(function () {

    $.ajax({
        url: '/counterCategorias',
        type: 'GET',
        success: function (data) {
            $('.countCategoria').text(data.categorias[0].categorias);
            $('.countGrupos').text(data.grupos[0].grupos);
            $('.countPedidos').text(data.pedidos[0].pedidos);
            $('.countProdutos').text(data.produtos[0].produtos);
            $('.countAvaliacoes').text(data.avaliacao[0].avaliacoes);
            $('.countAdicionais').text(data.adicionais[0].adicionais);
            let info = [$('.nmlocal').text(), $('#emailProp').text()];
            Cookies.set('infoRest', JSON.stringify(info));

            $.ajax({
                type: 'GET',
                url: '/listarTempoEntrega',
                dataType: 'json',
                cache: false,
                contentType: "application/json; charset=utf-8",
                beforeSend: () => {

                },
                success: (data) => {

                    $('.sp-hr-ent').append('<b class="min-hr-ent">' + data.entregamin + '</b> - <b class="max-hr-ent">' + data.entregamax + '</b> min')
                    $('.divLoader').css('display', 'none');

                    $('.min-hr-ent').text() == 'null' || $('.max-hr-ent').text() == 'null' ? $('.sp-hr-ent').empty() && $('.sp-hr-ent').text('Indefinido') && msgswal('Atenção', '<div class="center" style="line-height: 30px;">Defina seu horário de entrega na guia <b>Pedidos</b>,<br> no ícone <a class="btn-floating bt-hora-entrega inicio"><i class="material-icons">access_time</i></a></div>', 'warning', 0) : null;
                }
            })
        }
    });

    var canvas = document.getElementById('vendas');
    var data = {
        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        datasets: [
            {
                label: "Vendas",
                fill: true,
                lineTension: 0.1,
                borderColor: "purple",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "purple",
                pointBackgroundColor: "purple",
                pointBorderWidth: 1,
                pointHoverRadius: 2,
                pointHoverBackgroundColor: "purple",
                pointHoverBorderWidth: 5,
                pointRadius: 5,
                pointHitRadius: 6,
                data: [65, 59, 80, 0, 56, 55, 40, 40, 65, 80, 100, 74],
            }
        ]
    };

    var option = { showLines: true };
    var myLineChart = Chart.Line(canvas, {
        data: data,
        options: option
    });

    $('input#input_text, textarea#textarea2').characterCounter();
    $('input#nome, textarea#textarea2').characterCounter();

});