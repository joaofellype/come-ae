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

    let limpar = $('.tab-pendentes,.tab-cancelados,.tab-aprovados').empty(),
        pend = $('.tab-pendentes'),
        canc = $('.tab-cancelados'),
        apro = $('.tab-aprovados');

    $(window).width() <= 425 ? limpar && pend.append('<i class="material-icons">access_time</i>') && canc.append('<i class="material-icons">cancel</i>') && apro.append('<i class="material-icons">check_circle</i>') : limpar && pend.append('Pendentes') && canc.append('Cancelados') && apro.append('Aprovados');
})

$(document).on('click', '[class^="tab-"]', function () {
    corrigirDatatables()
})

$(document).on('click', '.bt-action-aceitar, .bt-aceitar-modal', function () {
    let idrestaurante = $('.codrestaurante').val();
    let idusuario = $('.codusuario').val();
    $('#modalVisualizar').modal('close');
    Swal.fire({
        title: 'Confirmação',
        text: 'Aprovar cadastro?',
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
                url: '/confirmarRestaurante/' + idrestaurante + '/' + idusuario,
                data: {
                    emaildono: $('.emailDono').text(),
                    nomedono: $(".nomeDono").text()
                },
                cache: false,
                beforeSend: function () {
                    $('.loader-place').append(loader);
                },
                success: (data) => {
                    $('.loader-place').empty();
                    msgswal('Aceito', 'Você pode encontrá-lo na guia de APROVADOS', 'success', 4000);
                    atualizarDatatables();
                },
                error: () => {

                }
            })
        }
    })
})

$(document).on('click', '.bt-action-recusar, .bt-recusar-modal', function () {
    $('#modalVisualizar').modal('close');
    let idrestaurante = $('.codrestaurante').val();
    let idusuario = $('.codusuario').val();
    const {
        value: text
    } = Swal.fire({
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
                url: '/reprovarForm/' + idrestaurante + '/' + idusuario,
                cache: false,
                data: {
                    motivo: result.value,
                    emaildono: $('.emailDono').text(),
                    nomedono: $(".nomeDono").text()
                },
                beforeSend: function () {
                    $('.loader-place').append(loader);
                },
                success: (data) => {
                    $('.loader-place').empty();

                    msgswal('Confirmação', 'O cadastro recusado ainda pode ser encontrado na guia CANCELADOS', 'success', 4000);
                    atualizarDatatables()
                },
                error: () => {

                }
            })
        } else {
            if (result.value == '') {
                msgswal('Erro', 'Você deve informar um motivo para recusar', 'error', 4000);
            }
        }
    })
})

// CARREGAR DADOS AO CLICAR NO BTN PENDENTES
$(document).on('click', '.pendentes', function () {
    let id = $(this).attr('data-id');

    $.ajax({
        type: 'GET',
        url: '/listarOneRestauranteAdmin/' + id,
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.loader-place').append(loader);
        },
        success: (data) => {
            $('.img-cadastro-pend').attr('src', data.caminhofoto.replace('/app', ''));
            $('.codusuario').val(data.usuario.id);
            $('.codrestaurante').val(data.id);
            $('.nomefantasia').text(data.nomefantasia);
            $('.razaosocial').text(data.razaosocial);
            $('.email').text(data.email);
            $('.telefoneRestaurante').text(data.numerorestaurante);
            $('.cnpj').text(data.cnpj);
            $('.cep').text(data.endereco.cep);
            $('.rua').text(data.endereco.rua);
            $('.bairro').text(data.endereco.bairro);
            $('.complemento').text(data.endereco.complemento);
            $('.cidade').text(data.endereco.cidade);
            $('.nmrcasa').text(data.endereco.nmrcasa);
            $('.uf').text(data.endereco.uf);
            $('.categoria').text(data.categoria.categoriarestaurante);
            $('.nomeDono').text(data.usuario.nomeusuario);
            $('.cpfDono').text(data.usuario.cpf);
            $('.emailDono').text(data.usuario.emailusuario);
            $('.telefoneDono').text(data.usuario.numerousuario);

            $('.loader-place').empty();
        },
        error: () => {
            $('#modalVisualizar').modal('close');
        }
    })
})
// CARREGAR DADOS AO CLICAR NO BTN CANCELADOS
$(document).on('click', '.cancelados', function () {
    let id = $(this).attr('data-id');

    $.ajax({
        type: 'GET',
        url: '/listarOneRestauranteAdmin/' + id,
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.loader-place').append(loader);
        },
        success: (data) => {
            $('.codusuario').val(data.usuario.id);
            $('.codrestaurante').val(data.id);
            $('.nomefantasia').text(data.nomefantasia);
            $('.razaosocial').text(data.razaosocial);
            $('.email').text(data.email);
            $('.telefoneRestaurante').text(data.numerorestaurante);
            $('.cnpj').text(data.cnpj);
            $('.cep').text(data.endereco.cep);
            $('.rua').text(data.endereco.rua);
            $('.bairro').text(data.endereco.bairro);
            $('.complemento').text(data.endereco.complemento);
            $('.cidade').text(data.endereco.cidade);
            $('.nmrcasa').text(data.endereco.nmrcasa);
            $('.uf').text(data.endereco.uf);
            $('.categoria').text(data.categoria.categoriarestaurante);
            $('.nomeDono').text(data.usuario.nomeusuario);
            $('.cpfDono').text(data.usuario.cpf);
            $('.emailDono').text(data.usuario.emailusuario);
            $('.telefoneDono').text(data.usuario.numerousuario);

            $('.loader-place').empty();
        },
        error: () => {
            $('#modalVisualizar').modal('close');
        }
    })
})
// CARREGAR DADOS AO CLICAR NO BTN CANCELADOS
$(document).on('click', '.aprovados', function () {
    let id = $(this).attr('data-id');

    $.ajax({
        type: 'GET',
        url: '/listarOneRestauranteAdmin/' + id,
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.loader-place').append(loader);
        },
        success: (data) => {
            $('.codusuario').val(data.usuario.id);
            $('.codrestaurante').val(data.id);
            $('.nomefantasia').text(data.nomefantasia);
            $('.razaosocial').text(data.razaosocial);
            $('.email').text(data.email);
            $('.telefoneRestaurante').text(data.numerorestaurante);
            $('.cnpj').text(data.cnpj);
            $('.cep').text(data.endereco.cep);
            $('.rua').text(data.endereco.rua);
            $('.bairro').text(data.endereco.bairro);
            $('.complemento').text(data.endereco.complemento);
            $('.cidade').text(data.endereco.cidade);
            $('.nmrcasa').text(data.endereco.nmrcasa);
            $('.uf').text(data.endereco.uf);
            $('.categoria').text(data.categoria.categoriarestaurante);
            $('.nomeDono').text(data.usuario.nomeusuario);
            $('.cpfDono').text(data.usuario.cpf);
            $('.emailDono').text(data.usuario.emailusuario);
            $('.telefoneDono').text(data.usuario.numerousuario);

            $('.loader-place').empty();
        },
        error: () => {
            $('#modalVisualizar').modal('close');
        }
    })
})

$(document).on('click', '.bt-action-visualizar', function () {
    $('#modalVisualizar .modal-footer').remove();
    $(this).hasClass('pendentes') ? $('#modalVisualizar').append('<div class="modal-footer kit-flex"><a class="waves-effect waves-light btn-small red bt-recusar-modal">Recusar</a><a class="waves-effect waves-light btn-small green bt-aceitar-modal">Aceitar</a></div>') : null;
})

$(document).ready(function () {

    $('.loader-place').append(loader)

    $('a[data-rel^=lightcase]').lightcase();

    $('#modalVisualizar').modal({
        onOpenStart: () => {
            $('.rodape-mobile').hide(200)
        },
        onCloseStart: () => {
            $('.rodape-mobile').show(200);
            atualizarDatatables();
            corrigirDatatables();
        }
    });

    $('.tabs-cadastros').tabs();

    $('#tablePendentes').DataTable({
        "ajax": '/listarRestaurantesAdm',
        "columns": [
            { "data": "cnpj" },
            { "data": "nomefantasia" },
            { "data": "endereco.bairro" },
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
        "createdRow": function (row, data, rowIndex) {
        },
        "columnDefs": [
            { className: 'center', targets: '_all' },
            { targets: [1], render: $.fn.dataTable.render.ellipsis(40, true) },
            {
                targets: [3], render: function (data) {
                    return '<div class="kit-flex"><button data-id=' + data.id + ' class="btn-small green kit-flex bt-action-aceitar"><i class="material-icons">check</i></button><button data-id=' + data.id + ' class="btn-small red kit-flex bt-action-recusar"><i class="material-icons">close</i></button><button data-id=' + data.id + ' class="btn-small blue kit-flex bt-action-visualizar modal-trigger pendentes" href="#modalVisualizar"><i class="material-icons">visibility</i></button></div>'
                }, orderable: false
            }
        ],
        'initComplete': function (settings, json) { },

        "drawCallback": function () { },
    });

    $('#tableCancelados').DataTable({
        "ajax": '/listarRestaurantesCancelados',
        "columns": [
            { "data": "cnpj" },
            { "data": "nomefantasia" },
            { "data": "endereco.bairro" },
            { "data": null }
        ],
        "createdRow": function (row, data, rowIndex) {
        },
        "bInfo": true,
        "bPaginate": false,
        scrollY: 200,
        responsive: true,
        "columnDefs": [
            { className: 'center', targets: '_all' },
            { targets: [1], render: $.fn.dataTable.render.ellipsis(40, true) },
            {
                targets: [3], render: function (data) {
                    return '<div class="kit-flex"><button data-id=' + data.id + ' class="btn-small blue kit-flex bt-action-visualizar modal-trigger cancelados" href="#modalVisualizar"><i class="material-icons">visibility</i></button></div>'
                }, orderable: false
            }
        ],
        'initComplete': function (settings, json) {
            $('.divLoader').css('display', 'none')
        },
        "language": {
            "lengthMenu": "",
            "zeroRecords": "Nada encontrado - Desculpe",
            "info": "Exibindo _PAGE_ de _PAGES_",
            "infoEmpty": "Sem registros",
            "infoFiltered": "(Filtrando por _MAX_ registros)",
            "sSearch": "Busca:"
        },
        "drawCallback": function () { }
    });

    $('#tableAprovados').DataTable({
        "ajax": '/listarRestauranteAprovados',
        "columns": [
            { "data": "cnpj" },
            { "data": "nomefantasia" },
            { "data": "endereco.bairro" },
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
        "createdRow": function (row, data, rowIndex) {
        },
        "bInfo": true,
        "bPaginate": false,
        scrollY: 200,
        responsive: true,
        "columnDefs": [
            { className: 'center', targets: '_all' },
            { targets: [1], render: $.fn.dataTable.render.ellipsis(40, true) },
            {
                targets: [3], render: function (data) {
                    return '<div class="kit-flex"><button data-id=' + data.id + ' class="btn-small blue kit-flex bt-action-visualizar modal-trigger aprovados" href="#modalVisualizar"><i class="material-icons">visibility</i></button></div>'
                }, orderable: false
            }
        ],
        'initComplete': function (settings, json) {
            $('.loader-place').empty()
        },

        "drawCallback": function () { }
    });

    corrigirDatatables();

})