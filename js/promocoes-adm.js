function msgswal(title, text, icon, timer) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: timer,
        confirmButtonColor: "#800080"
    })
}

$(window).on('load resize', function () {
    let limpar = $('.tab-solicitadas,.tab-inativas,.tab-ativas').empty(), pend = $('.tab-solicitadas'), canc = $('.tab-inativas'), apro = $('.tab-ativas');

    $(window).width() <= 425 ? limpar && pend.append('<i class="material-icons">access_time</i>') && canc.append('<i class="material-icons">cancel</i>') && apro.append('<i class="material-icons">check_circle</i>') : limpar && pend.append('Solicitadas') && canc.append('Inativas') && apro.append('Ativas');
})

$(document).on('click', '[class^="tab-"]', function () {
    corrigirDatatables();
})

$(document).on('click', '.bt-action-aceitar, .bt-aceitar-modal', function () {
    $('#modalVisualizar').modal('close');
    Swal.fire({
        title: 'Confirmação',
        text: 'Aprovar promoção?',
        icon: 'warning',
        confirmButtonColor: "#800080",
        cancelButtonColor: "#333",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sim",
        showCancelButton: true
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: 'PUT',
                url: '/aprovarPromocao/' + $('.idpromo').val(),
                data: { idprodutos: $('.idprodutos').val() },
                cache: false,

                beforeSend: function () {
                    $('.loader-place').append(loader);
                },
                success: (data) => {
                    $('.loader-place').empty();
                    msgswal('Aceito', 'Você pode encontrá-la na guia de ATIVAS', 'success', 4000);
                    atualizarDatatables();
                },
                error: () => {

                }
            })
        }
    })
})

$(document).on('click', '.bt-action-recusar, .bt-recusar-modal', function () {
    let id =$(this).attr('data-id');
    $('#modalVisualizar').modal('close');
    const { value: text } = Swal.fire({
        title: 'Informe o motivo',
        input: 'textarea',
        inputPlaceholder: 'Digite o motivo...',
        inputAttributes: {
            'aria-label': 'Digite o motivo...',
            'style': 'resize: none; border-color: purple',
        },
        cancelButtonColor: "#333",
        confirmButtonColor: "#800080",
        confirmButtonText: "Enviar",
        cancelButtonText: "Cancelar",
        showCancelButton: true
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: 'PUT',
                url: '/recusarPromocao/'+id,
                cache: false,
                beforeSend: function () {
                    $('.loader-place').append(loader);
                },
                success: (data) => {
                    $('.loader-place').empty();
                    msgswal('Confirmação', 'A promoção recusada ainda pode ser encontrada na guia INATIVAS', 'success', 4000);
                    atualizarDatatables();
                },
                error: (data) => {

                }
            })
        } else {
            if (result.value == '') {
                msgswal('Erro', 'Você deve informar um motivo para recusar', 'error', 4000);
            }
        }
    })
})

// CARREGAR DADOS AO CLICAR NO BTN SOLICITADAS
$(document).on('click', '.solicitadas', function () {
    let id = $(this).attr('data-id');

    $.ajax({
        type: 'GET',
        url: '/listarOnePromocoesAdmin/' + id,
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.loader-place').append(loader);
        },
        success: (data) => {
          

            if(!data.idsprodutos && data.categorias){

                
                $('.itens').text(data.categorias);
                
            }else{
                  if(data.produtos!=null){

                      $('.itens').text(JSON.parse(data.produtos).join(', '));
                  }  
            }
            $('.idprodutos').val(data.categorias);
            
            if (data.valor) {
                $('.valor').text((data.valor).replace('.', ','));
            }
            if (data.caminhofoto != null) {
                
                $('.img-cadastro-sol').attr('src', data.caminhofoto.replace('/app', ''))
            }
            
            $('.idprodutos').val(data.idsprodutos);


            $('.local').text(data.restaurante.nomefantasia);
            $('.idpromo').val(data.id);
            $('.dataInicio').text(data.data_inicio);
            $('.dataFinal').text(data.data_final);
            $('.tipoPromocao').text(data.descricao);
            $('.loader-place').empty();
        },
        error: () => {
            $('#modalVisualizar').modal('close');
        }
    })
})
// CARREGAR DADOS AO CLICAR NO BTN INATIVAS
$(document).on('click', '.inativas', function () {

    let id = $(this).attr('data-id');

    $.ajax({
        type: 'GET',
        url: '/listarOnePromocoesAdmin/' + id,
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.loader-place').append(loader);
        },
        success: (data) => {
            $('.local').text(data.restaurante.nomefantasia)
            $('.dataInicio').text(data.data_inicio)
            $('.dataFinal').text(data.data_final)
            $('.tipoPromocao').text(data.descricao);
            $('.valor').text(data.valor);
            $('.itens').text(data.produtos);
            $('.loader-place').empty();
        },
        error: () => {
            $('#modalVisualizar').modal('close');
        }
    })
})
// CARREGAR DADOS AO CLICAR NO BTN ATIVAS
$(document).on('click', '.ativas', function () {
    let id = $(this).attr('data-id');

    $.ajax({
        type: 'GET',
        url: '/listarOnePromocoesAdmin/' + id,
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.loader-place').append(loader);
        },
        success: (data) => {
            $('.local').text(data.restaurante.nomefantasia)
            $('.dataInicio').text(data.data_inicio)
            $('.dataFinal').text(data.data_final)
            $('.tipoPromocao').text(data.descricao);
            $('.valor').text(data.valor);
            $('.itens').text(JSON.parse(data.produtos).join(', '));
            $('.loader-place').empty();
        },
        error: () => {
            $('#modalVisualizar').modal('close');
        }
    })
})

$(document).on('click', '.bt-action-visualizar', function () {
    $('#modalVisualizar .modal-footer').remove();
    $(this).hasClass('solicitadas') ? $('#modalVisualizar').append('<div class="modal-footer kit-flex"><a class="waves-effect waves-light btn-small red bt-recusar-modal">Recusar</a><a class="waves-effect waves-light btn-small green bt-aceitar-modal">Aceitar</a></div>') : null;
})

$(document).ready(function () {

    $('.loader-place').append(loader)

    $('a[data-rel^=lightcase]').lightcase();

    $('#modalVisualizar').modal({
        onOpenStart: () => {
            $('.rodape-mobile').hide(200)
        },
        onCloseStart: () => {
            $('.rodape-mobile').show(200)
            atualizarDatatables()
            corrigirDatatables()
        }
    });

    $('.tabs-promocoes').tabs();

    var table = $('#tableSolicitadas').DataTable({
        "ajax": "/listarAllPromocoes",
        "columns": [
            { "data": "restaurante.nomefantasia" },
            { "data": "descricao" },
            { "data": "data_inicio" },
            { "data": "data_final" },
            { "data": null },
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
            {
                targets: [4], render: function (data) {
                    return '<div class="kit-flex"> <button data-id=' + data.id + ' class="btn-small green kit-flex bt-action-aceitar"><i class="material-icons">check</i></button><button data-id=' + data.id + ' class="btn-small red kit-flex bt-action-recusar"><i class="material-icons">close</i></button><button data-id=' + data.id + ' class="btn-small blue kit-flex bt-action-visualizar modal-trigger solicitadas" href="#modalVisualizar"><i class="material-icons">visibility</i></button> </div>'
                }, orderable: false
            }
        ],
        'initComplete': function (settings, json) {
            $('.loader-place').empty()
        },
        "createdRow": function (row, data, rowIndex) {
        },
        "drawCallback": function () {
        },
    });

    $('#tableInativas').DataTable({
        "ajax": "/listarAllPromocoesInativas",
        "columns": [
            { "data": "restaurante.nomefantasia" },
            { "data": "descricao" },
            { "data": "data_inicio" },
            { "data": "data_final" },
            { "data": null },
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
            {
                targets: [4], render: function (data) {
                    return '<div class="kit-flex"> <button class="btn-small blue kit-flex bt-action-visualizar modal-trigger inativas" data-id=' + data.id + ' href="#modalVisualizar"><i class="material-icons">visibility</i></button> </div>'
                }, orderable: false
            }
        ],
        'initComplete': function (settings, json) {
        },
        "createdRow": function (row, data, rowIndex) {
        },
        "drawCallback": function () {
        }
    });

    $('#tableAtivas').DataTable({
        "ajax": "/listarAllPromocoesAtivas",
        "columns": [
            { "data": "restaurante.nomefantasia" },
            { "data": "descricao" },
            { "data": "data_inicio" },
            { "data": "data_final" },
            { "data": null },
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
            {
                targets: [4], render: function (data) {
                    return '<div class="kit-flex"> <button class="btn-small blue kit-flex bt-action-visualizar modal-trigger ativas" data-id=' + data.id + ' href="#modalVisualizar"><i class="material-icons">visibility</i></button> </div>'
                }, orderable: false
            },
        ],
        'initComplete': function (settings, json) {
        },
        "createdRow": function (row, data, rowIndex) {
        },
        "drawCallback": function () {
        }
    });

    corrigirDatatables();

})