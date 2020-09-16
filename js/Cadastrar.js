$(document).on('click focus', '[id^="inp"]', function () {
    $(this).val().length > 0 ? $(this).select() : null;
})

$(document).on('input', '[id^="inp"]', function () {
    let cont = 0;

    $('#divCode input').each(function () {
        if ($(this).val().length > 0) {
            cont++;
            cont == 5 ? $(this).blur() && $('#btnCad').click() : null;
            $(this).next().focus()
        } else {
            $(this).focus();
            return false;
        }
    })
})

$(document).on('click', '#aEditEmail', function () {
    Cookies.set('editEmail', $('.eml').html())
})

$(document).on("click", ".btnValidar", function () {
    let resultado = "";

    $('.COD').each(function () {
        resultado += $(this).val();
    })
    $.ajax({
        url: '/verificarCodigo',
        beforeSend: function () {
            $('.btnValidar').attr('disabled', 'disabled').text('Validando...');
        },
        type: 'POST',
        data: { resultado: resultado, email: $('.eml').html() },
        success: function (data) {
            $('.btnValidar').attr('disabled', 'disabled').text('Confirmado!');
                window.location.href = '/cadastroCliente/' + $('.eml').html();
        },
        error: (data) => {
            Swal.fire({
                title: 'Erro!',
                text: 'Ocorreu um erro, por favor, verifique o seu código e tente novamente',
                timer: 5000,
                confirmButtonColor: "#800080",
                icon: 'error'
            }).then(() => {
                $('.btnValidar').removeAttr('disabled').text('Enviar');
            })
        }
    })
})