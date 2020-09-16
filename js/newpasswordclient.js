function msgswal(title, html, icon, timer) {
    Swal.fire({
        title: title,
        html: html,
        icon: icon,
        timer: timer,
        confirmButtonColor: "#800080"
    })
}

$(document).on('click', '.see', function () {
    $('.i-pass1').attr('type') == 'password' ? $('[class*="i-pass"]').attr('type', 'text') : $('[class*="i-pass"]').attr('type', 'password');
})

$(document).on('click', '.confirma', function () {

    if ($('#password').val() == '') {
        msgswal('Erro', 'Campo <b class="red-text text-lighten-1">Nova Senha</b> vazio', 'error', 3500);
        $('#password').focus();
        return false;
    } else if ($('#password').val().length < 6 || $('#password2').val().length < 6) {
        msgswal('Erro', 'A <b class="red-text text-lighten-1">nova senha / confirmação</b> deve conter no mínimo 6 caracteres!', 'error', 4500);
        $('#password').focus()
        return false;
    } else if ($('#password2').val() == '') {
        msgswal('Erro', 'Campo <b class="red-text text-lighten-1">Confirmação Senha</b> vazio', 'error', 3500);
        $('#password2').focus()
        return false;
    } else if ($('#password').val() != $('#password2').val()) {
        msgswal('Erro', 'As senhas não conferem!', 'error', 3500);
        $('#password2').removeClass('valid').addClass('invalid');
        return false;
    } else {
        $.ajax({
            url: '/updateSenhaUsuario',
            type: 'PUT',
            data: { senha: $('input[name="senhaNova"]').val(), token: $('input[name="token"]').val() },
            beforeSend: () => {
                $(this).attr('disabled', 'disabled').html('Confirmando...');
                $('.dv-bt-confirm').find('i').addClass('disabled');
            },
            success: (data) => {
                $(this).html('Confirmado!');
                Swal.fire({
                    title: 'Sucesso',
                    text: 'Senha modificada com sucesso!',
                    icon: 'success',
                    timer: 4000,
                    confirmButtonColor: "#800080"
                }).then((result) => {
                    window.location.href = '/comeae'
                })
            },
            error: (error) => {
                Swal.fire({
                    title: 'Erro',
                    text: 'Ocorreu um erro, tente novamente!',
                    icon: 'error',
                    timer: 3500,
                    confirmButtonColor: "#800080"
                }).then((result) => {
                    $(this).removeAttr('disabled').html('Confirmar');
                    $('.dv-bt-confirm').find('i').removeClass('disabled');
                })
            }
        })
    }
})