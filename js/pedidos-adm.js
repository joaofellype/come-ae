function msgswal(title, text, icon, timer) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: timer,
        confirmButtonColor: "#800080"
    })
}

function onlymsgswal(title, icon, timer) {
    Swal.fire({
        title: title,
        icon: icon,
        timer: timer,
        showConfirmButton: false
    })
}

$(document).on('click', '[class^="tab-"]', function () {
    corrigirDatatables();
})

$(window).on('load resize', function () {

    let limpar = $('.tab-cancelar,.tab-historico, .tab-todos').empty(),
        canc = $('.tab-cancelar'),
        hist = $('.tab-historico'),
        td = $('.tab-todos');

    $(window).width() <= 425 ? limpar && canc.append('<i class="material-icons">cancel</i>') && hist.append('<i class="material-icons">history</i>') && td.append('<i class="material-icons">select_all</i>') : limpar && canc.append('A cancelar') && hist.append('Histórico') && td.append('Todos');
})

$('.icone-copia').click(function () {
    $('.text-resposta-cliente textarea').val($(this).parent().next().text());
    onlymsgswal('A mensagem foi enviada para o campo do cliente', 'success', 3500);
    $('.icone-copia').tooltip();
});

$(document).on('click', '.bt-action-visualizar', function () {
    $('#modalVisualizar .modal-footer').remove();
    $(this).hasClass('resposta') ? $('#modalVisualizar').append('<div class="modal-footer kit-flex"><a class="waves-effect waves-light btn-small green bt-aceitar-modal">Enviar</a></div>') && $('.text-resposta-rest textarea,.text-resposta-cliente textarea').removeAttr('disabled') && $('.icone-copia').show() : $('.text-resposta-rest textarea,.text-resposta-cliente textarea').attr('disabled', 'disabled') && $('.icone-copia').hide();
})

$(document).on('click', '.bt-aceitar-modal', function () {
    let id=$(this).attr("data-id")
    if ($('.text-resposta-rest > textarea').val() == '' || $('.text-resposta-cliente > textarea').val() == '') {
        msgswal('Erro', 'O LOCAL e o CLIENTE devem receber alguma resposta', 'error', 5000);
        return false;
    } else {
        // MENSAGEM PARA O CLIENTE
        let msgcliente = $('.text-resposta-cliente > textarea').val()

        $.ajax({
            type: 'PUT',
            url: '/cancelarPedidoAdmin/' + id,
            data:{msg:msgcliente},
            cache: false,
            beforeSend: function () {
                $('.loader-place').append(loader);
            },
            success: () => {
                $('.loader-place').empty();
                Swal.fire({
                    icon: 'success',
                    title: 'O email do CLIENTE foi enviado!',
                    showConfirmButton: false,
                    timer: 2000
                }).then((result) => {
                    // MENSAGEM PARA O LOCAL
                    let msgrest = $('.text-resposta-rest > textarea').val();

            
                })
            },
            error: () => {

            }
        })
    }
})


// CARREGAR DADOS AO CLICAR NO BTN TODOS
$(document).on('click', '.todos', function () {
    let id = $(this).attr('data-id');
    $.ajax({
        type: 'GET',
        url: '/listarAllPedidosOne/' + id,
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.loader-place').append(loader);
        },
        success: (data) => {
            JSON.parse(data.produtos).forEach(el => {
                $('.produtos').text(el.produto)
            })
            $('.restaurante').text(data.restaurante.nomefantasia);

            $('.total').text(data.valor);
            $('.nomecliente').text(data.usuario.nomeusuario);
            $('.emailcliente').text(data.usuario.emailusuario);
            $('.endereco').text('Rua ' + data.endereco.rua + ' Nº ' + data.endereco.nmrcasa + '  Bairro ' + data.endereco.bairro);
            $('.npedido').text(data.id);
            $('.datapedido').text(data.createdAt);
            $('.formapagamento').text(data.tipopagamento.tipopagamento);
            $('.statuspedido').text(data.statuspedido.statuspedido);

            $('.loader-place').empty()
        }
    })
})

// CARREGAR DADOS AO CLICAR NO BTN HISTORICO
$(document).on('click', '.historico', function () {
    let id = $(this).attr('data-id');
    $.ajax({
        type: 'GET',
        url: '/listarAllPedidosOne/' + id,
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.loader-place').append(loader);
        },
        success: (data) => {
            JSON.parse(data.produtos).forEach(el => {
                $('.produtos').text(el.produto)
            })
            $('.restaurante').text(data.restaurante.nomefantasia);

            $('.total').text(data.valor);
            $('.nomecliente').text(data.usuario.nomeusuario);
            $('.emailcliente').text(data.usuario.emailusuario);
            $('.endereco').text('Rua ' + data.endereco.rua + ' Nº ' + data.endereco.nmrcasa + '  Bairro ' + data.endereco.bairro);
            $('.npedido').text(data.id);
            $('.datapedido').text(data.createdAt);
            $('.formapagamento').text(data.tipopagamento.tipopagamento);
            $('.statuspedido').text(data.statuspedido.statuspedido);

            $('.loader-place').empty()
        }
    })
})

// CARREGAR DADOS AO CLICAR NO BTN RESPOSTA
$(document).on('click', '.resposta', function () {
    let id = $(this).attr('data-id');
    $.ajax({
        type: 'GET',
        url: '/listarPedidosAcancelarOne/' + id,
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.loader-place').append(loader)
        },
        success: (data) => {
            console.log(data)
            let produto = [];
            JSON.parse(data.produtos).forEach(el => {
                produto.push(el.produto)
            })
            if (data.motivocancelado_usuario != null) {
                $('#motivo-text').text(data.motivocancelado_usuario);

            }
            if (data.motivocancelado_restaurante != null) {
                $('#motivo-text').text(data.motivocancelado_restaurante);

            }
            $('.bt-aceitar-modal').attr('data-id', data.id)
            $('.local').text(data.restaurante.nomefantasia);
            $('.nmrPedido').text(data.id);
            $('.emailLocal').text(data.restaurante.email);
            $('.nomeCliente').text(data.usuario.nomeusuario);
            $('.emailCliente').text(data.usuario.emailusuario);
            $('.pedidoCliente').text(produto.toString());
            $('.loader-place').empty()
        }
    })
})


$(document).ready(function () {

    $('.loader-place').append(loader)

    $('.icone-copia').tooltip();
    $('#modalPedido').modal({
        onOpenStart: () => {
            $('.rodape-mobile').hide(200);
        },
        onCloseStart: () => {
            $('.rodape-mobile').show(200);
            atualizarDatatables();
        }
    })

    $('#modalVisualizar').modal({
        onOpenStart: () => {
            $('.rodape-mobile').hide(200);
        },
        onCloseStart: () => {
            $('.rodape-mobile').show(200);
            atualizarDatatables();
        }
    });

    $('.tabs-pedidos').tabs();

    $('#tableCancelar').DataTable({
        "ajax": '/listarPedidosAcancelar',
        "columns": [{
                "data": "restaurante.nomefantasia"
            },
            {
                "data": "usuario.nomeusuario"
            },
            {
                "data": null
            },
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
        "columnDefs": [{
                className: 'center',
                targets: '_all'
            },
            {
                targets: [2],
                render: function (data) {
                    return '<div class="kit-flex"> <button data-id=' + data.id + ' class="btn-small orange kit-flex bt-action-visualizar modal-trigger resposta "' +
                        ' href="#modalVisualizar"><i class="material-icons">message</i></button> </div>'
                },
                orderable: false
            }
        ],
        'initComplete': function (settings, json) {},
        "createdRow": function (row, data, rowIndex) {},
        "drawCallback": function () {},
    });

    $('#tableHistorico').DataTable({
        "ajax": "/listarPedidosCanceladosAdmin",
        "columns": [{
                "data": "restaurante.nomefantasia"
            },
            {
                "data": "usuario.nomeusuario"
            },
            {
                "data": null
            },
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
        "columnDefs": [{
                className: 'center',
                targets: '_all'
            },
            {
                targets: [2],
                render: function (data) {
                    return '<div class="kit-flex"> <button data-id=' + data.id + ' class="btn-small blue kit-flex bt-action-visualizar modal-trigger historico "' +
                        ' href="#modalVisualizar"><i class="material-icons">visibility</i></button> </div>'
                },
                orderable: false
            }
        ],
        'initComplete': function (settings, json) {},
        "createdRow": function (row, data, dataIndex) {},
        "drawCallback": function () {}
    });

    $('#tableTodos').DataTable({
        "ajax": "/listaAllPedidos",
        "columns": [{
                "data": "id"
            },
            {
                "data": "restaurante.nomefantasia"
            },
            {
                "data": "usuario.nomeusuario"
            },
            {
                "data": "statuspedido.statuspedido"
            },
            {
                "data": null
            },
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
        "columnDefs": [{
                className: 'center',
                targets: '_all'
            },
            {
                targets: [4],
                render: function (data) {
                    return '<div class="kit-flex"> <button data-id=' + data.id + ' class="btn-small blue kit-flex bt-action-pedido modal-trigger todos"' +
                        ' href="#modalPedido"><i class="material-icons">visibility</i></button> </div>'
                },
                orderable: false
            }
        ],
        'initComplete': function (settings, json) {
            $('.loader-place').empty()
        },
        "createdRow": function (row, data, rowIndex) {
            $.each($('td', row), function (colIndex) {
                $(this).attr('data-id', data.id);
            });
        },
        "drawCallback": function () {}
    });

    corrigirDatatables();

})