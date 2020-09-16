
$(document).on('click', '.recusar', function () {
    $('.bt-enviar-cancelamento').attr('data-id', $(this).parent().parent().find('.sorting_1').html())
    $('#modalCancelamento').modal('open')
})

$(document).on('click', '.bt-enviar-cancelamento', function () {
    let texto = $('#modalCancelamento').find('.area-cancelamento textarea').val()
    $.ajax({
        url: '/cancelarPedido/' + $(this).attr('data-id'),
        type: 'PUT',
        data: {
            motivo: texto,
            codUsuario: $('.codusuario').val(),
            idpedido: $(this).attr('data-id')
        },
        beforeSend: () => {
            $(this).attr('disabled', 'disabled').html('Enviando')
        },
        success: (data) => {
            $(this).removeAttr('disabled').html('Enviar');
            $('#modalCancelamento').modal('close');
            $('#modalCancelamento').find('.area-cancelamento textarea').val('');
            msgswal('Em análise', 'Por favor, aguarde nosso contato', 'success', 3500);
        }
    })
})

$(document).on('click', '.news, .finals, .preps, .cancel', function () {
    $('table.display').DataTable().columns.adjust().draw();
    $('table.display2').DataTable().columns.adjust().draw();
    $('table.display3').DataTable().columns.adjust().draw();
    $('table.display7').DataTable().columns.adjust().draw();
})

$(document).on('click', '.finalizado', function () {
    Swal.fire({
        title: 'O produto já foi entregue?',
        text: 'Tenha certeza dessa informação',
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Não',
        confirmButtonColor: '#800080',
        cancelButtonColor: '#333',
        confirmButtonText: 'Sim'
    }).then((result) => {
        result.value ? msgswal('Em análise', 'O processo foi movido para a aba <b>Finalizados</b>', 'success', 3500) && $('.modal').modal('close') : null;
    })
})

$(document).on('click', '.display1 .aceitaPedido', function () {
    let id = $(this).parent().parent().find('.sorting_1').html();
    var socket = io('https://comeaee.herokuapp.com/');

    Swal.fire({
        title: 'Aceitar pedido?',
        text: 'Não aceite pedidos que não possa cumprir',
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Não',
        confirmButtonColor: '#800080',
        cancelButtonColor: '#333',
        confirmButtonText: 'Sim'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: '/confirmarPedido/' + id,
                type: 'PUT',
                success: function (data) {
                    let array = data.data[1];
                    socket.emit('enviar pedidos', {
                        msg: `Olá, o pedido ${array[0].id} foi confirmado. Acompanhe o seu pedido! `,
                        pedido: array[0].codusuario
                    })
                    msgswal('Pedido aceito!', 'O pedido foi movido para a aba <b>Em preparação</b>', 'success', 3500);
                    $('table.display1').DataTable().ajax.reload();
                    $('table.display2').DataTable().ajax.reload();
                }
            })
        }
    })
})

$(document).on('click', '.display1 .btnVisuPed', function () {
    let id = $(this).parent().parent().find('.sorting_1').html();
    $('.display4 tbody').empty();
    $('.divLoader').show();
    $.ajax({
        url: '/pedidosOne/' + id,
        success: function (data) {
            $('.divLoader').hide();
            let adicionais = [], produtos, dataped = data.createdAt

            data.observacao == null ? data.observacao = '' : null;

            JSON.parse(data.produtos).forEach(el => { produtos = el.produto })

            $('.codusuario').val(data.usuario.id);
            data.troco == null || data.troco == 'NaN' ? data.troco = '' : null;

            $('.display4').append('<tr><td>' + data.id + '</td><td>' + produtos + '</td><td>' + data.valor.replace(".", ",") + '</td><td>' + adicionais + '</td><td>' + data.observacao + '</td><td> Nª Casa -' + data.endereco.nmrcasa + ' Rua - ' + data.endereco.rua + '  Bairro - ' + data.endereco.bairro + '</td><td>' + dataped.substr(8, 2) + '/' + dataped.substr(5, 2) + '/' + dataped.substr(0, 4) + '</td><td>' + data.usuario.nomeusuario + '</td><td>' + data.tipopagamento.tipopagamento + '</td><td>' + data.troco + '<td></tr>')
        }
    })
});

$(document).on('click', '.display2 .confirmarPedido', function () {
    var socket = io('https://comeaee.herokuapp.com/');
    let id = $(this).parent().parent().find('.sorting_1').html();
    Swal.fire({
        title: 'Finalizar preparação?',
        text: 'Confirme se o produto já estiver pronto para envio',
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Não',
        confirmButtonColor: '#800080',
        cancelButtonColor: '#333',
        confirmButtonText: 'Sim'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: '/despachaPedido/' + id,
                type: 'PUT',
                success: function (data) {
                    console.log(data)
                    let array = data.data[1];
                        socket.emit('enviar pedidos', {
                            msg: ` Olá, seu pedido ${array[0].id} saiu para entrega`,
                            pedido: array[0].codusuario
                        })
                    msgswal('Enviando produto...', 'O pedido foi movido para o botão &nbsp <a style="background-color: purple" class="btn-floating pulse btn-medium waves-effect waves-light"><i class="material-icons">motorcycle</i></a>', 'success', 5000)
                    $('table.display1').DataTable().ajax.reload();
                    $('table.display2').DataTable().ajax.reload();
                    $('table.display2,table.display5').DataTable().ajax.reload();
                   
                }
            })
        }
    })
})

$(document).on('click', '.display7 .btnVisuPed', function () {
    let id = $(this).parent().parent().find('.sorting_1').html();
    $('.display12 tbody').empty();
    $('.divLoader').show();
    $.ajax({
        url: '/pedidosOne/' + id,
        success: function (data) {
            $('.divLoader').hide();
            let adicionais = [], nomeAdicionais = JSON.parse(data.adicionais), produto = [], dataped = data.createdAt;

            data.observacao == null ? data.observacao = '' : null;

            JSON.parse(data.produtos).forEach(prod => { produto.push(prod.produto) });
            nomeAdicionais.forEach(el => { adicionais.push(el) });

            data.troco == null || data.troco == 'NaN' ? data.troco = '' : null;

            $('.display12').append('<tr><td>' + data.id + '</td><td>' + produto.toString() + '</td><td>' + (data.valor).replace('.', ',') + '</td><td>' + adicionais + '</td><td>' + data.observacao + '</td><td> Nª Casa -' + data.endereco.nmrcasa + ' Rua - ' + data.endereco.rua + '  Bairro - ' + data.endereco.bairro + '</td><td>' + dataped.substr(8, 2) + '/' + dataped.substr(5, 2) + '/' + dataped.substr(0, 4) + '</td><td>' + data.usuario.nomeusuario + '</td><td>' + data.tipopagamento.tipopagamento + '</td><td>' + data.troco + '<td><td>' + data.motivocancelado + '</td></tr>');
        }
    })
});

$(document).on('click', '.display5 .finalizar', function () {
    let id = $(this).parent().parent().find('.sorting_1').html();
    $.ajax({
        url: '/finalizarPedido/' + id,
        type: 'PUT',
        success: function (data) {
            msgswal('Enviando produto...', 'O pedido foi movido para o botão &nbsp <a style="background-color: purple" class="btn-floating pulse btn-medium waves-effect waves-light"><i class="material-icons">motorcycle</i></a>', 'success', 5000);
            $('table.display1').DataTable().ajax.reload();
        }
    })
});

$(document).on('click', '.display2 .btnVisuPed1', function () {
    let id = $(this).parent().parent().find('.sorting_1').html();
    $('.display4 tbody').empty();
    $('.divLoader').show();
    $.ajax({
        url: '/pedidosOne/' + id,
        success: function (data) {
            $('.divLoader').hide();
            let produtos, nomeAdicionais = JSON.parse(data.adicionais), dataped = data.createdAt;

            data.observacao == null ? data.observacao = '' : null;

            JSON.parse(data.produtos).forEach(el => { produtos = el.produto })

            data.troco == 'NaN' ? data.troco = '' : null;

            $('.display4').append('<tr><td>' + data.id + '</td><td>' + produtos + '</td><td>' + data.valor + '</td><td>' + nomeAdicionais.toString() + '</td><td>' + data.observacao + '</td><td> Nª Casa -' + data.endereco.nmrcasa + ' Rua - ' + data.endereco.rua + '  Bairro - ' + data.endereco.bairro + '</td><td>' + dataped.substr(8, 2) + '/' + dataped.substr(5, 2) + '/' + dataped.substr(0, 4) + '</td><td>' + data.usuario.nomeusuario + '</td><td>' + data.tipopagamento.tipopagamento + '</td><td>' + data.troco + '<td></tr>');
        }
    })
});

$(document).on('click', '.display3  .btnVisuPed1', function () {
    let id = $(this).parent().parent().find('.sorting_1').html();
    $('.display4 tbody').empty();
    $('.divLoader').show();
    $.ajax({
        url: '/pedidosOne/' + id,
        success: function (data) {
            $('.divLoader').hide();
            let produtos, adicionais = [], nomeAdicionais = JSON.parse(data.adicionais), dataped = data.createdAt;

            data.observacao == null ? data.observacao = '' : null;

            JSON.parse(data.produtos).forEach(el => { produtos = el.produto })

            nomeAdicionais.forEach(el => { adicionais.push(el) });

            data.troco == 'NaN' ? data.troco = '' : null;

            $('.display4').append('<tr><td>' + data.id + '</td><td>' + produtos + '</td><td>' + data.valor.replace(".", ",") + '</td><td>' + adicionais + '</td><td>' + data.observacao + '</td><td> Nª Casa -' + data.endereco.nmrcasa + ' Rua - ' + data.endereco.rua + '  Bairro - ' + data.endereco.bairro + '</td><td>' + dataped.substr(8, 2) + '/' + dataped.substr(5, 2) + '/' + dataped.substr(0, 4) + '</td><td>' + data.usuario.nomeusuario + '</td><td>' + data.tipopagamento.tipopagamento + '</td><td>' + data.troco + '<td></tr>');
        }
    })
});

// BTN HORARIO DE ENTREGA
$(document).on('click', '.bt-hora-entrega', function () {
    $.ajax({
        type: 'GET',
        url: 'https://reqres.in/api/users?page=2',
        dataType: 'json',
        data: { minimo: $('.minimo-hr').val(), maximo: $('.maximo-hr').val() },
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.divLoader').show();
        },
        success: (data) => {
            // COLOCAR O HORARIO DE ENTREGA (SE JÁ DEFINIDO)
            $('.divLoader').hide();
        }
    })
})

// BTN SALVAR HORARIO DE ENTREGA -> MODAL
$(document).on('click', '.bt-salvar-hr-entrega', function () {
    if ($('.minimo-hr').val() == "" || $('.maximo-hr').val() == "") {
        msgswal('Erro', 'Há campos vazios', 'error', 3500);
        return false;
    } else if ($('.minimo-hr').val() > $('.maximo-hr').val()) {
        msgswal('Erro', 'O <b>mínimo</b> não pode ser maior que o <b>máximo</b>', 'error', 3500);
    } else {
        $.ajax({
            type: 'PUT',
            url: '/atualizarTempoEntrega',

            data: { minimo: $('.minimo-hr').val(), maximo: $('.maximo-hr').val() },
            cache: false,

            beforeSend: () => {
                $(this).attr('disabled', 'disabled').html('Aguarde...');
            },
            success: (data) => {
                $(this).removeAttr('disabled').html('Confirmar');
                msgswal('Confirmação', 'Horário de entrega definido com sucesso', 'success', 4500);
                $('#modalHorarioEntrega').modal('close');
            }
        })
    }
})

$(document).ready(function () {

    $('#modalHorarioEntrega').modal({
        dismissible: false,
        onOpenStart: function () {
            //$('.minimo-hr, .maximo-hr').val('')
        }
    });

    $.ajax({
        url: '/listarTempoEntrega',
        success: (data) => {
            console.log(data)
            $('.minimo-hr').val(parseInt(data.entregamin))
            $('.maximo-hr').val(parseInt(data.entregamax))
        }
    })

    $('#modalDetalhes').modal({
        onOpenEnd: () => {
            $('table.display').DataTable().columns.adjust().draw();
        }
    })
    $('#modalEnvios').modal({
        onOpenEnd: () => {
            $('table.display5').DataTable().columns.adjust().draw();
        }
    })
    $('#modalDetalhes1').modal()
    $('#modalCancelamento').modal()

    $('#tabs-swipe-demo').ready(function () {
        $('.tabs .tab a.active')[0].click()
    })

    $(window).resize(function () {
        $('table.display').DataTable().columns.adjust().draw();
    });

    $('table.display1').DataTable({
        "ajax": "/listarPedido",
        "order":[[0,'desc']],
        beforeSend: function () {
            $('.divLoader').css('display', '');
        },
        "columns": [
            { "data": "id" },
            { "data": "endereco.bairro" },
            { "data": null },
            { "data": null },
        ],
        "createdRow": function (row, data, rowIndex) {
            $.each($('td', row), function (colIndex) {
                $(this).attr('data-id', data.id);
            });
        },
        "columnDefs": [
            { targets: '_all', className: 'center' },
            {
                targets: [2],
                render: function (data) {
                    return moment(data.createdAt).format('DD/MM/YYYY - hh:mm')
                }
            },
            {
                targets: [3], defaultContent: '<a class="btn-floating btn-small waves-effect waves-light green darken-2 tooltipped aceitaPedido" data-tooltip="Aceitar" data-position="left"> <i class="material-icons aceitar">check</i </a><a class="btn-floating btn-small waves-effect waves-light red darken-4 recusar tooltipped"data-tooltip="Recusar" data-position="left"> <i class="material-icons">block</i></a><a class="btn-floating btn-small waves-effect waves-light blue darken-4 tooltipped modal-trigger btnVisuPed" data-tooltip="Visualizar" href="#modalDetalhes" data-position="left"> <i class="material-icons">remove_red_eye</i></a>'
            },
        ],
        responsive: true,
        "scrollY": "300px",
        "scrollCollapse": true,
        "paging": false,
        "language": {
            "lengthMenu": "",
            "zeroRecords": "Nada encontrado!",
            "info": '',
            "infoEmpty": "Sem registros encontrados!",
            "infoFiltered": "(Filtrando por um total de  _MAX_ registros)",
            "sSearch": "Buscar:"
        },
        initComplete: function (settings, json) {
            $('.divLoader').css('display', 'none');
        },
        "drawCallback": function (settings) { },
        "bAutoWidth": true
    });

    $('table.display7').DataTable({
        "ajax": "/listarPedidosCancelados",
        beforeSend: function () {
            $('.divLoader').css('display', '');
        },
        "columns": [
            { "data": "id" },
            { "data": "usuariocancelado" },
            { "data": null },
            { "data": null }
        ],
        "createdRow": function (row, data, rowIndex) {
            $.each($('td', row), function (colIndex) {
                $(this).attr('data-id', data.id);
            });
        },
        "columnDefs": [
            {
                targets: [2], render: (data) => {
                    return moment(data.horacancelado).format('DD/MM/YYYY - HH:mm');
                }
            },
            {
                targets: [3], defaultContent: '  <a class="btn-floating btn-small waves-effect waves-light blue darken-4 tooltipped modal-trigger btnVisuPed" data-tooltip="Visualizar" href="#modalDetalhes1" data-position="left"> <i class="material-icons">remove_red_eye</i></a>'
            },
        ],
        responsive: true,
        "scrollY": "300px",
        "scrollCollapse": true,
        "paging": false,
        "language": {
            "lengthMenu": "",
            "zeroRecords": "Nada encontrado!",
            "info": '',
            "infoEmpty": "Sem registros encontrados!",
            "infoFiltered": "(Filtrando por um total de  _MAX_ registros)",
            "sSearch": "Buscar:"
        },
        initComplete: function (settings, json) {
            $('.divLoader').css('display', 'none');
        },
        "drawCallback": function (settings) { },
        "bAutoWidth": true
    });

    $('table.display3').DataTable({
        "ajax": "/listarPedidoFechados",
        "order":[[0,'desc']],
        beforeSend: function () {
            $('.divLoader').css('display', '');
        },
        "columns": [
            { "data": "id" },
            { "data": "endereco.bairro" },
            { "data": null },
            { "data": null }
        ],
        "createdRow": function (row, data, rowIndex) {
            $.each($('td', row), function (colIndex) {
                $(this).attr('data-id', data.id);
            });
        },
        "columnDefs": [{
            targets: [2], render: (data) => {
                return moment(data.createdAt).format('DD/MM/YYYY - HH:mm')
            }
        },
        {
            targets: [3], defaultContent: '<a class="btn-floating btn-small waves-effect waves-light blue darken-4 tooltipped modal-trigger btnVisuPed1"' +
                ' data-tooltip="Visualizar" href="#modalDetalhes" data-position="left">' +
                ' <i class="material-icons">remove_red_eye</i> </a>'
        }
        ],
        responsive: true,
        "scrollY": "300px",
        "scrollCollapse": true,
        "paging": false,
        "language": {
            "lengthMenu": "",
            "zeroRecords": "Nada encontrado!",
            "info": '',
            "infoEmpty": "Sem registros encontrados!",
            "infoFiltered": "(Filtrando por um total de  _MAX_ registros)",
            "sSearch": "Buscar:"
        },
        initComplete: function (settings, json) {
            $('.divLoader').css('display', 'none');
        },
        "drawCallback": function (settings) { },
        "bAutoWidth": true
    });

    $('table.display2').DataTable({
        "ajax": "/listarEmPreparacao",
        "order":[[0,'desc']],
        beforeSend: function () {
            $('.divLoader').css('display', '');
        },
        "columns": [
            { "data": "id" },
            { "data": "endereco.bairro" },
            { "data": null },
            { "data": null },
            { "data": null },
        ],
        "createdRow": function (row, data, rowIndex) {
            $.each($('td', row), function (colIndex) {
                $(this).attr('data-id', data.id);
            });
        },
        "columnDefs": [{
            targets: [2], render: (data) => {
                return (data.valor).replace('.', ',')
            }
        },
        {
            targets: [3], render: (data) => {
                return moment(data.createdAt).format('DD/MM/YYYY - HH:mm');
            }
        },
        {
            targets: [4], defaultContent: ' <a class="btn-floating btn-small waves-effect waves-light blue darken-4 tooltipped modal-trigger btnVisuPed1"' +
                ' data-tooltip="Visualizar" href="#modalDetalhes" data-position="left">' +
                ' <i class="material-icons">remove_red_eye</i> </a><a class="btn-floating btn-small waves-effect waves-light green darken-2 tooltipped confirmarPedido"  data-tooltip="Aceitar" data-position="left"> <i class="material-icons preparado">check</i></a>'
        },
        ],
        responsive: true,
        "scrollY": "300px",
        "scrollCollapse": true,
        "paging": false,
        "language": {
            "lengthMenu": "",
            "zeroRecords": "Nada encontrado!",
            "info": '',
            "infoEmpty": "Sem registros encontrados!",
            "infoFiltered": "(Filtrando por um total de  _MAX_ registros)",
            "sSearch": "Buscar:"
        },
        initComplete: function (settings, json) {
            $('.divLoader').css('display', 'none');
        },
        "drawCallback": function (settings) { },
        "bAutoWidth": true
    });

    $('table.display5').DataTable({
        "ajax": "/listarPedidosEntrega",
        "order":[[0,'desc']],
        beforeSend: function () {
            $('.divLoader').css('display', '');
        },
        "columns": [
            { "data": "id" },
            { "data": null },
            { "data": null },
            { "data": "observacao" },
            { "data": "endereco.rua" },
            { "data": null },
            { "data": "usuario.nomeusuario" },
        ],
        "createdRow": function (row, data, rowIndex) {
            $.each($('td', row), function (colIndex) {
                $(this).attr('data-id', data.id);
            });
        },
        "columnDefs": [{
            targets: [1], render: function (data) {
                let produtos = [];
                JSON.parse(data.produtos).forEach(aa => { produtos.push(aa.produto) })
                return produtos.toString().replace(',', ', ');
            }
        },
        {
            targets: [2], render: function (data) {
                return data.valor.replace('.', ',')
            }
        },
        {
            targets: [5], render: function (data) {
                return moment(data.horapreparado).format('DD/MM/YYYY - HH:mm');
            }
        },
        ],
        responsive: true,
        "scrollY": "300px",
        "scrollCollapse": true,
        "paging": false,
        "language": {
            "lengthMenu": "",
            "zeroRecords": "Nada encontrado!",
            "info": '',
            "infoEmpty": "Sem registros encontrados!",
            "infoFiltered": "(Filtrando por um total de  _MAX_ registros)",
            "sSearch": "Buscar:"
        },
        initComplete: function (settings, json) {
            $('.divLoader').css('display', 'none');
        },
        "drawCallback": function (settings) { },
        "bAutoWidth": true
    });

    $('.dataTables_filter input').addClass('browser-default').css('outline', 'none').css('height', '25px').css('border', '1px solid black').css('border-radius', '3px').css('padding-left', '3px')

    $('#modalCancelamento').modal()
    $('.tabs').tabs();
})