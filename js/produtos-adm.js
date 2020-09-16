// CARREGAR DADOS AO CLICAR NO BTN PRODUTOS
$(document).on('click', '.produtos', function () {
    let id = $(this).attr('data-id');
    $.ajax({
        type: 'GET',
        url: '/listarProdutosOneAdmin/' + id,
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.loader-place').append(loader)
        },
        success: (data) => {

            $('.nomeproduto').text(data.nomeproduto);
            $('.categoriaProduto').text(data.categoria.categoriaproduto);
            $('.descricaoProduto').text(data.descricao);
            $('.valorProduto').text('R$ ' + data.valor.replace('.', ','));
            $('.loader-place').empty();
        }
    })
})


$(document).ready(function () {

    $('.loader-place').append(loader)

    $('a[data-rel^=lightcase]').lightcase();

    $('#modalVisualizar').modal({
        onOpenStart: () => {
            $('.rodape-mobile').hide(200);
        },
        onCloseStart: () => {
            $('.rodape-mobile').show(200);
            atualizarDatatables();
        }
    });

    $('#tableProdutos').DataTable({
        "ajax": "/listarProdutosAdmin",
        "columns": [
            { "data": "nomeproduto" },
            { "data": null },
            { "data": "restaurante.nomefantasia" },
            { "data": null }
        ],
        "language": {
            "lengthMenu": "",
            "zeroRecords": "Nada encontrado - Desculpe",
            "info": "Exibindo _PAGE_ de _PAGES_",
            "infoEmpty": "Sem registros",
            "infoFiltered": "(Filtrando por _MAX_ registros)",
            "sSearch": "Busca:"
        },
        "bInfo": true,
        "bPaginate": false,
        scrollY: 200,
        responsive: true,
        "columnDefs": [
            { className: 'center', targets: '_all' },
            { targets: [0], render: $.fn.dataTable.render.ellipsis(40, true) },
            {
                targets: [1], render: $.fn.dataTable.render.ellipsis(40, true), render: function (data) {
                    return 'R$ ' + data.valor.replace('.', ',');
                }
            },
            { targets: [2], render: $.fn.dataTable.render.ellipsis(40, true) },
            {
                targets: [3], render: function (data) {
                    return '<div class="kit-flex"> <button data-id=' + data.id + ' class="btn-small blue kit-flex bt-action-visualizar produtos modal-trigger"' +
                        'href="#modalVisualizar"><i class="material-icons">visibility</i></button> </div>'
                }, orderable: false
            }
        ],
        'initComplete': function (settings, json) {
            $('.loader-place').empty()
        },
        "createdRow": function (row, data, rowIndex) {
        },
        "drawCallback": function () {
        }
    });

    corrigirDatatables();

})