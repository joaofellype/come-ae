// BT LOGAR
$(document).on('click', '.logar', function () {
    let valid = false;
    $('#formIni input').each(function () {
        $(this).hasClass('valid') ? valid = true : valid = false;
    })

    if (valid == true) {
        $.ajax({
            url: '/log_rest',
            type: 'POST',
            dataType: 'json',
            data: { email: $('input[name="email"]').val(), senha: $('input[name="senha"]').val() },
            beforeSend: function () {
                $('.logar').text('Entrando...').attr('disabled', 'disabled')
            },
            success: function (data) {
                var minuto = new Date(new Date().getTime() + 30 * 60 * 1000);
                Cookies.set('token', data.token, { expires: minuto });
                window.location.href = '/admin_start';
                $('.logar').text('Confirmado!').attr('disabled', 'disabled')
            },
            error: (error) => {
                msgswal('Erro!', error.responseJSON.error, 'error');
                $('.logar').text('Logar').removeAttr('disabled');
                return false;
            }
        })
    } else {
        msgswal('Erro', 'Há campos vazios ou inválidos', 'error')
        return false;
    }
})

// BT ESQUECI SENHA
$('.esqsenha').click(function () {
    $('.swal2-input').attr('autocomplete')
    Swal.fire({
        validationMessage: 'Endereço de email inválido',
        html: '<p style="font-size: 27px">Digite seu email para recuperar senha<p><br>',
        inputPlaceholder: 'Email',
        input: 'email',
        showCancelButton: true,
        cancelButtonColor: '#4b5f83',
        cancelButtonText: 'Cancelar',
        imageUrl: 'https://cdn1.iconfinder.com/data/icons/flat-business-icons/128/mail-512.png',
        imageHeight: 150,
        confirmButtonColor: 'purple',
        confirmButtonText: 'Confirmar',
        allowOutsideClick: true, //PERMITIR QUE SE FECHE O ALERT CLICANDO FORA DA CAIXA,
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
            $.ajax({
                type: 'POST',
                url: '/enviar-email',
                data: { 'login': login },
                cache: false,
                success: function (data) {
                    msgswal('Sucesso', data.responseJSON, 'success')
                },
                error: function (data) {
                    msgswal('Erro', data.responseJSON, 'error')
                }
            })
        }
    })
});

// MSG SWAL
function msgswal(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: 4000,
        confirmButtonColor: "#800080"
    })
}

$(document).ready(function () {
    $('.tooltipped').tooltip();
    // EXIBIR SENHA
    $('.btnMostrar').click(function () {
        if ($(this).parent().children('input').attr('type') == 'password') {
            $(this).parent().children('input').attr('type', 'text')
            $(this).html('visibility_off')
            $(this).attr('data-tooltip', 'Ocultar senha')
        } else {
            $(this).parent().children('input').attr('type', 'password')
            $(this).html('visibility')
            $(this).attr('data-tooltip', 'Mostrar senha')
        }

        $('.tooltipped').tooltip('close')
        $('.tooltipped').tooltip()
    })
});