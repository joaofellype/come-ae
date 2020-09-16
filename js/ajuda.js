
$(document).on('click', '.cancelarbusca', function () {
    $('.buscarajuda').val('').blur();
    $('.cancelarbusca, .empty-msg').hide()
    closeAllCollapsible()
})
$(document).on('blur', '.buscarajuda', function () {
    $(this).val().length <= 0 ? $('.static-list').show() && $('.unique-list, .cancelarbusca').hide() : null;
})

// BUSCA INTERNA > HELP
$(document).on('input focus', '.buscarajuda', function () {
    let valores = [], i = 0, cont = 0;
    $('.static-list').hide()
    $('.unique-list, .cancelarbusca').show()
    var nomeFiltro = $(this).val().toLowerCase();
    $('.unique-list .collapsible').find('li').each(function () {
        var conteudoCelula = $(this).find('div:first').text();
        var corresponde = conteudoCelula.toLowerCase().indexOf(nomeFiltro) >= 0;
        $(this).css('display', corresponde ? '' : 'none');
        valores.push($(this).css('display'))
    });
    for (i == 0; i < valores.length; i++) {
        valores[i] == 'none' ? cont++ : null;
    }
    valores.length == cont ? $('.empty-msg').show() : $('.empty-msg').hide();
});

// MUDAR ICONE DO COLLAPSIBLE > HELP
$(document).on('click', '.collapsible-header', function () {
    $(this).find('i').html() == 'expand_more' ? $(this).find('i').html('expand_less') : $(this).find('i').html('expand_more')
})

$(document).on('change', '#motivo-ajuda', function () {
    let pedidos = ['', 'Meu pedido está atrasado', 'Meu pedido não foi entregue', 'Meu pedido veio errado', 'Tive problema com a minha comida', 'Meu pedido foi cancelado'], pagamento = ['', 'Não consigo pagar online', 'Tive uma cobrança indevida', 'Não recebi meu estorno', 'Não consigo usar o cupom de descontos', 'Não recebi o cupom fiscal'], conta_e_priv = ['', 'Quero alterar os dados da minha conta', 'Minha conta foi invadida por alguém', 'Não encontro meu endereço', 'Quero excluir uma avaliação que eu fiz', 'Quero excluir a minha conta'], i = 0;

    $(this).val() == 'sem-motivo' ? $('#detalhe-motivo').empty() && $('.select-detalhe').hide() : null;

    if ($(this).val() == 'pedido') {
        $('.select-detalhe').show()
        $('#detalhe-motivo').empty()
        for (i == 0; i < pedidos.length; i++) {
            $('<option value="' + pedidos[i] + '">' + pedidos[i] + '</option>').appendTo('#detalhe-motivo')
        }
    }
    if ($(this).val() == 'Pagamento') {
        $('.select-detalhe').show()
        $('#detalhe-motivo').empty()
        for (i == 0; i < pagamento.length; i++) {
            $('<option value="' + pagamento[i] + '">' + pagamento[i] + '</option>').appendTo('#detalhe-motivo')
        }
    }
    if ($(this).val() == 'Conta e Privacidade') {
        $('.select-detalhe').show()
        $('#detalhe-motivo').empty()
        for (i == 0; i < conta_e_priv.length; i++) {
            $('<option value="' + conta_e_priv[i] + '">' + conta_e_priv[i] + '</option>').appendTo('#detalhe-motivo')
        }
    }
    $('#detalhe-motivo').formSelect();
})

$(document).on('click', '.back-listhelp', function () {
    $('.contato-comeae').hide()
    $('.header-busca, .static-list').show()
    $('.buscarajuda').val('').blur()
})

$(document).on('click', '.help-plus', function () {
    let ajuda = $(this).attr('data-title'), motivo = $(this).attr('data-header');
    closeAllCollapsible()
    $('.header-busca, .static-list, .unique-list').hide()
    $('.contato-comeae').show()
    $('#motivo-ajuda').val(ajuda).change()
    $('#motivo-ajuda').formSelect()
    $('#detalhe-motivo').val(motivo).change()
    $('#detalhe-motivo').formSelect()
    validarSelects()
})

$(document).on('focus input', '#email', function () {
    validarCampos()
})

$(document).on('focus input', '#telefone, #telefoneajuda', function () {
    $(this).val().length > 0 && $(this).val().length < 14 || $(this).val().length <= 0 ? $(this).addClass('invalid').removeClass('valid') : $(this).val().length >= 14 ? $(this).addClass('valid').removeClass('invalid') : null;
    validarCampos()
})

$(document).on('change input blur focus', '#nomeajuda, #pedido, #oqaconteceu, #form-help textarea, #detalhe-motivo, #motivo-ajuda', function () {
    $(this).val().length > 0 ? $(this).addClass('valid').removeClass('invalid') : $(this).addClass('invalid').removeClass('valid');
    $('#pedido').val().length >= 0 ? $('#pedido').addClass('valid').removeClass('invalid') : null;
    validarCampos()
    validarSelects()
})

$(document).on('click', '.bt-enviar-ajuda', function () {
    let dados_help = []
    $('#form-help').find('input').each(function () {
        dados_help.push($(this).val())
    })
    $.ajax({
        type: 'POST',
        url: '/createAjuda',
        data: { dados: dados_help },
        beforeSend: function () {
            $('.bt-enviar-ajuda').attr('disabled', 'disabled')
            $('.bt-enviar-ajuda').html('Enviando...')
        },
        success: function () {
            $('#form-help').find('input').each(function () {
                $(this).val('')
                $(this).removeClass('valid')
            })
            $('.bt-enviar-ajuda').html('Enviar')
            $('.bt-enviar-ajuda').css('background-color', 'green')
            $('.contato-comeae').hide()
            $('.header-busca, .static-list').show()
            $('.buscarajuda').val('').blur()
            msgswal('Confirmação!', 'Sua solicitação foi enviada, por favor, aguarde contato da nossa equipe no email <b>' + dados_help[4] + '</b> ou pelo número <b>' + dados_help[5] + '</b> informado.', 'success', 0)
        }
    })
})

$(document).on('click', '.bt-no-result', function () {
    closeAllCollapsible();
    $('.header-busca, .static-list, .unique-list, .empty-msg').hide();
    $('.contato-comeae').show();
    $('#motivo-ajuda').val('sem-motivo').change();
    $('#motivo-ajuda').formSelect();
    validarSelects();
})

function validarCampos() {
    $('#detalhe-motivo').val() != "" && $('#nome').hasClass('valid') && $('#email').hasClass('valid') && $('#telefone').hasClass('valid') && $('#oqaconteceu').hasClass('valid') ? $('.bt-enviar-ajuda').removeAttr('disabled') : $('.bt-enviar-ajuda').attr('disabled', 'disabled');
}
function validarSelects() {
    $('.select-motivo input').val() != '' ? $('.select-motivo input').addClass('valid').removeClass('invalid') : $('.select-motivo input').addClass('invalid').removeClass('valid');
    $('.select-detalhe input').val() != '' ? $('.select-detalhe input').addClass('valid').removeClass('invalid') : $('.select-detalhe input').addClass('invalid').removeClass('valid');
}

// VALIDAR EMAIL
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function validate() {
    var email = $("#email").val();
    validateEmail(email) ? $("#email").addClass('valid').removeClass('invalid') : $("#email").addClass('invalid').removeClass('valid');
    return false;
}
// ---------------

// MASCARA TELEFONE
function inputHandler(masks, max, event) {
    var c = event.target;
    var v = c.value.replace(/\D/g, '');
    var m = c.value.length > max ? 1 : 0;
    VMasker(c).unMask();
    VMasker(c).maskPattern(masks[m]);
    c.value = VMasker.toPattern(v, masks[m]);
}

var telMask = ['(99) 9999-99999', '(99) 99999-9999'];
var tel = document.querySelector('#telefoneajuda');
VMasker(tel).maskPattern(telMask[0]);
tel.addEventListener('input', inputHandler.bind(undefined, telMask, 14), false);

function closeAllCollapsible() {
    $('.lista-ajuda').find('.collapsible').each(function () {
        $(this).find('li').removeClass('active');
        $(this).find('.collapsible-header i').html('expand_more');
        $(this).find('.collapsible-body').css('display', 'none');
    })
}

$(document).ready(function () {

    // COLLAPSIBLE HELP
    $('.collapsible').collapsible({
        accordion: false
    });

    $('#motivo-ajuda').formSelect();
    $('#detalhe-motivo').formSelect();

});