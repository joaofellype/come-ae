function msgswal(title, text, icon, timer) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: timer,
        confirmButtonColor: "#800080"
    })
}

$(document).on('change', '.select_aplicacao', function () {
    $(this).val() == 'cidades' ? $('.dv-cidades').show(200) : $('.dv-cidades').hide(200) && $('.cid-vs').text('');
})

$(document).on('input', '.val-inp', function () {
    $(this).val(mascaraValor($(this).val()))
})

$(document).on('change', '.pickerinicio', function () {
    $('.pickerfim').val('');
})


$(document).on('click', '.bt-confirm-voucher', function () {

    let cont = 0, tipo = false, valores = [], itens = {};

    if ($('.select-dropdown.dropdown-trigger:first').val() !== "Cidade") {
        tipo = true;
        $('.geral-voucher').find('input').not('.select-dropdown.dropdown-trigger:last').each(function () {
            if ($(this).val() == "" || $(this).val() == "Aplicação") {
                cont++;
                msgswal('Erro', 'O campo ' + $(this).attr('alt') + ' está vazio ou inválido', 'error', 3500)
                return false;
            }
            valores.push($(this).val())
        })
    } else {
        $('.geral-voucher').find('input').each(function () {
            if ($(this).val() == "" || $(this).val() == "Aplicação" || $(this).val() == "Selecione a cidade") {
                cont++;
                msgswal('Erro', 'O campo ' + $(this).attr('alt') + ' está vazio ou inválido', 'error', 3500)
                return false;
            }
            valores.push($(this).val())
        })
    }

    if (cont > 0) {
        return false;
    } else {
        if (tipo == true) {
            itens = { nome: valores[0], aplicacao: valores[1], descricao: valores[2], valor: valores[3], dt_inicio: valores[4], dt_fim: valores[5] }
        } else {
            itens = { nome: valores[0], aplicacao: valores[1], descricao: valores[2], cidade: valores[3], valor: valores[4], dt_inicio: valores[5], dt_fim: valores[6] }
        }

        console.log(itens)

        $.ajax({
            type: 'POST',
            url: '/cdastrarVoucher',
            data: itens,
            cache: false,

            beforeSend: function () {
                $('.bt-confirm-voucher').attr('disabled', 'disabled').html('Aguarde...')
            },
            success: (data) => {
                $('.bt-confirm-voucher').removeAttr('disabled').html('Confirmar')

                $('.geral-voucher').find('input').each(function () { $(this).val('') })
                $('.select_cidades,.select_aplicacao').val('');
                $('.select_cidades,.select_aplicacao').trigger('change');
                $('.select_cidades,.select_aplicacao').formSelect();
                $('.corpo-visualizacao').find('span').each(function () { $(this).text('') })
                msgswal('Sucesso!', 'O voucher foi gerado, e pode ser encontrado no ícone a direita, na guia ATIVOS', 'success', 0);

            }
        })
    }
})

function mascaraValor(valor) {
    valor = valor.toString().replace(/\D/g, "");
    valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
    return valor
}

$(document).on('click', '.bt-vouches', function () {
    setTimeout(() => {
        corrigirDatatables()
    }, 200);
    $('.dv-voucher-geral').attr('style', 'display: none !important');
    $('.dv-voucher-tables').show(200);
    $('.bt-vouches i').html('arrow_back');
    $('.bt-vouches').addClass('bt-vouches-rtn').addClass('bt-vouches')
})

$(document).on('click', '.bt-vouches-rtn', function () {
    setTimeout(() => {
        corrigirDatatables()
    }, 200);
    $('.dv-voucher-geral').attr('style', 'display: flex !important');
    $('.dv-voucher-tables').hide(200);
    $('.bt-vouches i').html('confirmation_number');
    $('.bt-vouches').addClass('bt-vouches').removeClass('bt-vouches-rtn');
})

$(window).on('load resize', function () {

    let limpar = $('.tab-inativos,.tab-ativos').empty(), canc = $('.tab-inativos'), apro = $('.tab-ativos');

    $(window).width() <= 425 ? limpar && canc.append('<i class="material-icons">cancel</i>') && apro.append('<i class="material-icons">check_circle</i>') : limpar && canc.append('Inativos') && apro.append('Ativos');
})

$(document).on('click', '[class^="tab-"]', function () {
    corrigirDatatables()
})

// CARREGAR DADOS AO CLICAR NO BTN INATIVOS
$(document).on('click', '.inativos', function () {
    $.ajax({
        type: 'GET',
        url: 'https://reqres.in/api/users?page=2',
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.loader-place').append(loader);
        },
        success: (data) => {

            $('.loader-place').empty();
        },
        error: () => {
            $('#modalVisualizar').modal('close');
        }
    })
})

// CARREGAR DADOS AO CLICAR NO BTN ATIVOS
$(document).on('click', '.ativos', function () {
    $.ajax({
        type: 'GET',
        url: 'https://reqres.in/api/users?page=2',
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.loader-place').append(loader);
        },
        success: (data) => {

            $('.loader-place').empty();
        },
        error: () => {
            $('#modalVisualizar').modal('close');
        }
    })
})

$(document).ready(function () {

   
    let alt = ['Nome', 'Aplicação', 'Descrição', 'Cidade', 'Valor', 'Data Início', 'Data Fim'], cont = 0;

    let i18n = {
        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabádo'],
        weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        today: 'Hoje',
        clear: 'Limpar',
        cancel: 'Sair',
        done: 'OK',
        labelMonthNext: 'Próximo mês',
        labelMonthPrev: 'Mês anterior',
        labelMonthSelect: 'Selecione um mês',
        labelYearSelect: 'Selecione um ano',
        selectMonths: true,
        selectYears: 10,
    }

    $('.pickerinicio').datepicker({
        i18n: i18n,
        format: 'dd/mm/yyyy',
        onSelect: function (dateStr) {
            $(".pickerfim").datepicker("destroy");
            $(".pickerfim").datepicker({
                minDate: new Date(dateStr), container: 'body', format: 'dd/mm/yyyy', i18n: i18n,
            })
        },
        container: 'body',
        minDate: new Date()
    });

    $('.pickerfim').datepicker({
        format: 'dd/mm/yyyy',
        defaultDate: new Date(),
        container: 'body',
    });

    $('select').formSelect();

    $('.geral-voucher').find('input').each(function () {
        $(this).attr('alt', alt[cont])
        cont++;
    })

    $('#modalVisualizar').modal({
        onOpenStart: () => {
            $('.rodape-mobile').hide(200)
        },
        onCloseStart: () => {
            $('.rodape-mobile').show(200);
            // atualizarDatatables();
        }
    });

    $('.tabs-voucher').tabs();

    $('#tableInativos').DataTable({
        "bInfo": true,
        "bPaginate": false,
        scrollY: 200,
        responsive: true,
        "columnDefs": [{ className: 'nome center', targets: [0] },
        { className: 'aplicacao center', targets: [1] },
        { className: 'valor center', targets: [2] },
        { className: 'center', targets: [3] },
        {
            "targets": 3,
            "data": null,
            "defaultContent": '<div class="kit-flex"> <button class="btn-small blue kit-flex bt-action-visualizar modal-trigger cancelados"' +
                'href="#modalVisualizar"><i class="material-icons">visibility</i></button> </div>',
        }],
        'initComplete': function (settings, json) {
            $('.divLoader').css('display', 'none');
        },
        "language": {
            "lengthMenu": "",
            "zeroRecords": "Nada encontrado - Desculpe",
            "info": "Exibindo _PAGE_ de _PAGES_",
            "infoEmpty": "Sem registros",
            "infoFiltered": "(Filtrando por _MAX_ registros)",
            "sSearch": "Busca:"
        },
        "drawCallback": function () {
        }
    });

    $('#tableAtivos').DataTable({
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
        "columnDefs": [{ className: 'nome center', targets: [0] },
        { className: 'aplicacao center', targets: [1] },
        { className: 'valor center', targets: [2] },
        { className: 'center', targets: [3] },
        {
            "targets": 3,
            "data": null,
            "defaultContent": '<div class="kit-flex"> <button class="btn-small blue kit-flex bt-action-visualizar modal-trigger aprovados"' +
                ' href="#modalVisualizar"><i class="material-icons">visibility</i></button> </div>',
        }],
        'initComplete': function (settings, json) {
            $('.loader-place').empty()
        },

        "drawCallback": function () {
        }
    });

    corrigirDatatables();

})