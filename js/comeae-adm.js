function msgswal(title, text, icon, timer) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: timer,
        confirmButtonColor: "#800080"
    })
}

// VALIDAR EMAIL
$(document).on('keyup input focus', 'input[type=email]', function () {
    $(this).val().length < 6 ? $(this).addClass('invalid').removeClass('valid') : $(this).addClass('valid').removeClass('invalid');
})
$(document).on('keyup input focus', 'input[type=email]', function () {
    validateEmail($(this).val()) ? $(this).addClass('valid').removeClass('invalid') : $(this).addClass('invalid').removeClass('valid');
})
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// VERIFICAR SENHAS
$(document).on('input focus', 'input[type=password]', function () {
    $(this).val().length >= 6 ? $(this).addClass('valid').removeClass('invalid') : $(this).addClass('invalid').removeClass('valid');
})

$(document).on('click', '.bt-log-adm', function () {
    let cont = 0;
    $('.fm-log-adm').find('input').each(function () {
        $(this).val() == '' || $(this).val().length <= 0 || $(this).hasClass('invalid') ? $(this).addClass('invalid') && cont++ : null;
    })

    if (cont <= 0) {
        let inputs = [$('input[type=email]').val(), $('input[type=password]').val()]

        $('.check-log-adm').is(':checked') ? Cookies.set('manter') : $(Cookies.get('manter')) ? Cookies.remove('manter') : null;

        Cookies.get('manter') ? Cookies.set('manter', inputs) : null;

        $.ajax({
            type: 'POST', 
            url: '/login_administrador',
            beforeSend: function () {
                $('.bt-log-adm').text('Entrando').attr('disabled', 'disabled')
            },
            data: { email: $('#emaillog').val(), senha: $('#senhalog').val() },
            success: (data) => {
                Cookies.set('tokenAdmin', data.token);
                Cookies.set("nomeAdmin",data.nomeUsuario);
                $('.bt-log-adm').text('Sucesso');
                window.location.href='/resumo-adm';
            },
            error: (error) => {
                $('.bt-log-adm').text('Entrar').removeAttr('disabled');
                msgswal('Erro!', error.responseJSON.message, 'error', 4000, $('.bt-log-adm').text('Entrar').removeAttr('disabled'))
                return false;
            }
        })
        return false;
    } else {
        msgswal('Inválido', 'Há campos inválidos ou vazios', 'error', 3500);
        return false;
    }
})

$(document).ready(function () {
    if (Cookies.get('manter')) {
        let valores = Cookies.get('manter');
        $('input[type=email]').val(valores.split(',')[0]);
        $('input[type=password]').val(valores.split(',')[1]);
        $('.bt-log-adm').click();
    }
})