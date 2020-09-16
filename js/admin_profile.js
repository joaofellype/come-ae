
$(document).on('click', '.btnEditarPerfil', function () {
    var inputsorig = new Array();
    $('.divCentroPerfil input,textarea').each(function () {
        $(this).removeAttr('disabled').removeAttr('readonly');
        inputsorig.push($(this).val());
    });

    $(this).attr('style', 'display: none !important');
    $('.btnEnviarSol, .btnCancelSol').attr('style', 'display: flex !important');
})

$(document).on('click', '.btnEnviarSol', function () {
    let campos = {}
    $('#formFoto').submit();
    $('.form').each(function () {
        if (typeof ($(this).attr('name')) != 'undefined') {
            if (typeof ($(this).val()) != 'undefined' && $(this).val() != null) {
                campos[$(this).attr('name')] = $(this).val();
            }
        }
    });

    $.ajax({
        url: '/cadastrarForm',
        method: 'PUT',
        data: { campos: campos },
        beforeSend: function () {
            $('.divLoader').css('display', '')
        },
        success: function (data) {
            Swal.fire({
                title: 'Dados enviados para análise!',
                text: data.message,
                type: 'success',
                confirmButtonColor: '#800080',
                timer: 3000
            }).then((result) => {
                $('.divLoader').css('display', '');
                location.reload()
            })
            $('.divLoader').css('display', 'none');
        },
        error: function (data) {
            msgswal('Erro ao enviar para análise!', data.message, 'error', 3500);
            $('.divLoader').css('display', 'none');
        }
    })
})

$(document).on('click', '.btnCancelSol', function () {
    $('.btnEditarPerfil').attr('style', 'display: flex !important');
    $('.btnEnviarSol, .btnCancelSol').attr('style', 'display: none !important');
})

// mascaras de inputs 
function inputHandler(masks, max, event) {
    var c = event.target;
    var v = c.value.replace(/\D/g, '');
    var m = c.value.length > max ? 1 : 0;
    VMasker(c).unMask();
    VMasker(c).maskPattern(masks[m]);
    c.value = VMasker.toPattern(v, masks[m]);
}

var telMask = ['(99) 9999-99999', '(99) 99999-9999'];
var tel = document.querySelector('#telProfile');
VMasker(tel).maskPattern(telMask[0]);
tel.addEventListener('input', inputHandler.bind(undefined, telMask, 14), false);

var docMask = ['999.999.999-999', '99.999.999/9999-99'];
var doc = document.querySelector('#cpfcnpj');
VMasker(doc).maskPattern(docMask[0]);
doc.addEventListener('input', inputHandler.bind(undefined, docMask, 14), false);

$(document).ready(function () {
    $('.divLoader').css('display', 'none')
    $('.tooltipped').tooltip();
    $('.materialboxed').materialbox()

});