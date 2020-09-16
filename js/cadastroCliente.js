
let emailtrue = $('#email').attr('value')
//MSG SWAL
function msgswal(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: 4000,
        confirmButtonColor: "#800080"
    })
}

function msgswalplus(title,text,icon,timer,funcao){
    Swal.fire({
        title:title,
        text:text,
        icon:icon,
        timer: timer,
        confirmButtonColor: "#800080",
        onClose: ()=>{
            funcao
        }
    })
}

//MASCARA TELEFONE
function inputHandler(masks, max, event) {
    var c = event.target;
    var v = c.value.replace(/\D/g, '');
    var m = c.value.length > max ? 1 : 0;
    VMasker(c).unMask();
    VMasker(c).maskPattern(masks[m]);
    c.value = VMasker.toPattern(v, masks[m]);
}
var telMask = ['(99) 9999-99999', '(99) 99999-9999'];
var tel = document.querySelector('#telefone');
VMasker(tel).maskPattern(telMask[0]);
tel.addEventListener('input', inputHandler.bind(undefined, telMask, 14), false);

//VERIFICAR CAMPOS OBRIGATORIOS
$(document).on('focus input', '#formCadCod2 input', function () {
    $(this).val().length <= 0 && $(this).attr('required') ? $(this).addClass('invalid').removeClass('valid') : $(this).addClass('valid').removeClass('invalid');
})

// VERIFICAR CAMPO TELEFONE
$(document).on('input focus', '#telefone', function () {
    $(this).val().length >= 14 ? $(this).addClass('valid').removeClass('invalid') : $(this).addClass('invalid').removeClass('valid');
})

// VERIFICAR CAMPOS SENHA/CONFIRM
$(document).on('input focus', '#senha, #confirmarSenha', function () {
    $(this).val().length < 6 ? $(this).addClass('invalid').removeClass('valid') : $(this).addClass('valid').removeClass('invalid');
    // corresponder senhas
    $('#senha').val().length >= 6 && $('#confirmarSenha').val().length >= 6 && $('#senha').val() == $('#confirmarSenha').val() ? $('#senha,#confirmarSenha').addClass('valid').removeClass('invalid') : $('#senha,#confirmarSenha').addClass('invalid').removeClass('valid')
})

// MSG 'SENHAS DIFERENTES'
$(document).on('blur', '#senha, #confirmarSenha', function () {
    $('#senha').val().length >= 6 && $('#confirmarSenha').val().length >= 6 && $('#senha').val() != $('#confirmarSenha').val() ? msgswal('Senhas diferentes', 'As senhas não correspondem, verifique-as!', 'error') : null;
})

// EXIBIR SENHA
$(document).on('click', '.btnMostrar', function () {
    let senha_confirm = $('#senha, #confirmarSenha')
    $('#senha').attr('type') == 'password' ? senha_confirm.attr('type', 'text') && $(this).html('visibility_off') : senha_confirm.attr('type', 'password') && $(this).html('visibility')
});

$(document).on('blur', '#email', function () {
    $(this).val() != emailtrue ? msgswal('Erro', 'O email fornecido agora é diferente do anterior', 'error') && $(this).addClass('invalid').removeClass('valid') : $(this).addClass('valid').removeClass('invalid');
})

// ENVIAR FORMULÁRIO
$(document).on('click', ".btnConfirma", function () {
    let cont = 0;

    $('#formCadCod2 .input-field input').each(function () {
        $(this).attr('required') && $(this).hasClass('invalid') || $(this).val().length <= 0 ? $(this).addClass('invalid').removeClass('valid') && cont++ : null;
    })

    if (cont <= 0) {
        $.ajax({
            url: '/cadastrarUsuario',
            type: 'POST',
            data: { nome: $('input[name="nome"]').val(), email: $('input[name="email"]').val(), numero: $('input[name="telefone"]').val(), senha: $('input[name="senha"]').val(), senhaConfirm: $('input[name="confirmSenha"]').val(), idfacebook: $(".idFacebook").val(), receber_novidades: $('.filled-in').is(':checked') },
            beforeSend: function (param) {
                $('.btnConfirma').html('Aguarde...').attr('disabled','disabled')
            },
            success: function (data) {
                $('.btnConfirma').html('Confirmado').attr('disabled','disabled')
                msgswalplus('Sucesso','Cadastro efetuado','success',3500, setTimeout(() => {window.location.href='/ent_cad'}, 3500))
            },
            error: function (data) {
                $('.btnConfirma').html('Prosseguir').removeAttr('disabled')
                msgswal('Erro!', 'Ocorreu um erro, tente novamente', 'error')
            }
        })
    } else {
        msgswal('Erro', 'Há campos obrigatórios inválidos', 'error')
    }
})