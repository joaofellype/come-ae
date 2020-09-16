// VALIDAÇÃO INPUT EMAIL/TELEFONE
$(document).on('input', '#emailRest, #celRest', function () {
    if ($(this).attr('alt') == 'email') {
        var email = $("#emailRest").val();
        validateEmail(email) ? $("#emailRest").addClass('valid').removeClass('invalid') : $("#emailRest").addClass('invalid').removeClass('valid');
    } else {
        $(this).val().length == 0 || $(this).val().length > 0 && $(this).val().length < 14 ? $(this).addClass('invalid').removeClass('valid') : $(this).addClass('valid').removeClass('invalid');
    }
})

// ENVIO DO SUBMIT
$(document).on('submit', '#formIni', function () {
    if ($('input[name=nomeFantasia]').val() == '') {
        msgswal('Erro', 'Nome do estabelecimento vazio!', 'error', 3000)
        return false
    } else if ($('input[name=emailRest]').val() == '') {
        msgswal('Email inválido', '<b>Possiveis erros:</b><br><br><ul><li>● Campo em branco<li><li>● Duas arrobas (@) no campo</li><li>● Nenhum dado antes da arroba (@)</li><li>● Falta de um identificador final <b>ex:</b> .com/.org/.edu/.net</li></ul>', 'error', 0)
        return false
    } else if ($('input[name=celRest]').val() == '' || $('input[name=celRest]').val().length < 14) {
        msgswal('Telefone inválido', '<b>O telefone não pode:</b><br><ul><li>● Estar em branco</li></ul><br><b>Formatos permitidos:</b><ul><li>● (99) 9999-9999</li><li>● (99) 99999-9999</li></ul><br>', 'error', 4000)
        return false
    }
});

// MSG SWEET
function msgswal(title, text, icon, timer) {
    Swal.fire({
        title: title,
        html: text,
        icon: icon,
        timer: timer,
        confirmButtonColor: "#800080"
    })
}

// VALIDAR EMAIL
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

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
var tel = document.querySelector('input[attrname=telephone1]');
VMasker(tel).maskPattern(telMask[0]);
tel.addEventListener('input', inputHandler.bind(undefined, telMask, 14), false);