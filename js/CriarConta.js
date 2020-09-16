

$(document).on('focus input', '#formIni input', function () {
    let addValid = $(this).not('#Grupo4 > div > div > input').addClass('valid').removeClass('invalid');

    $(this).attr('required') && $(this).val().length <= 0 ? $(this).addClass('invalid').removeClass('valid') : addValid;
})

$(document).on('input blur focus', '#tel, #cpfcnpj, #cep, #cpf, #tel2', function () {
    let obg = $(this).attr('alt'), addInvalid = $(this).addClass('invalid').removeClass('valid'), val = $(this).val().length;

    if (obg == 'tel' || obg == 'tel2') {
        val == 0 || val > 0 && val < 14 ? addInvalid : $(this).addClass('valid').removeClass('invalid')
    } else if (obg == 'cpfcnpj' || obg == 'cpf') {
        val == 0 || val > 0 && val < 14 || val > 14 && val < 18 ? addInvalid : $(this).addClass('valid').removeClass('invalid')
    } else {
        val == 0 || val > 0 && val < 9 ? addInvalid : $(this).addClass('valid').removeClass('invalid')
    }
})

// ENVIAR DADOS E CADASTRAR
$(document).on('click', '#btnCriarConta', function () {
    var campos = {}, Verify = [];
    $('.form').each(function () {
        if (typeof ($(this).attr('name')) != 'undefined') {
            if (typeof ($(this).val()) != 'undefined' && $(this).val() != null) {
                campos[$(this).attr('name')] = $(this).val();
            }
        }
    });

    $('#formIni input').each(function () {
        $(this).focus().blur();
        $(this).attr('required') && $(this).hasClass('valid') ? Verify.push($(this).val()) : null;
    })

    if (Verify.length >= 16) {
        $.ajax({
            url: '/cadastrarRestaurante',
            type: 'POST',
            dataType: 'json',
            data: { campos: campos },
            beforeSend: () => {
                $(this).html('Enviando ...').attr('disabled', 'disabled');
                $('.divLoader').css('display', '')
            },
            error: (data) => {
                $(this).html('Confirmar').removeAttr('disabled');
                Swal.fire({
                    title: 'Aviso!',
                    html: data.responseJSON.validacao[0].msg,
                    icon: 'error',
                    confirmButtonColor: '#800080',
                    timer: 3000
                });
                $('.divLoader').css('display', 'none')
                $(this).focus()
            },
            success: (data) => {
                Swal.fire({
                    title: 'Confirmação!',
                    html: data.message,
                    icon: 'success',
                    confirmButtonColor: '#800080',
                    timer: 3000
                }).then(function () {
                    $('.divLoader').css('display', '')
                    $(this).html('Confirmar').attr('disabled', 'disabled');
                    $('#formEditarFoto').submit();
                    window.location.href = '/comeae'
                });
                $('.divLoader').css('display', 'none')
            }
        });
    } else {
        msgswal('Erro', 'Ainda há campos obrigatórios a serem preenchidos', 'error');
    }

});

// LIMITADOR ESPECIALIDADE (2)
$(document).on('change blur', '#especialidade', function () {
    var selecionados = $(this).val(), select_item = $('#Grupo4 > div > div > input')

    selecionados.length > 0 ? select_item.addClass('valid') : select_item.removeClass('valid');

    if (selecionados.length > 2) {
        msgswal('Máximo atingido', 'Você só pode selecionar até 2 especialidades', 'info')
        selecionados = selecionados.slice(0, 2);
        $('#especialidade').val(selecionados).formSelect();
    }
})

// APENAS LETRA #UF
$(document).on('input', '#uf', function () {
    $(this).val($(this).val().replace(/[^a-zA-Z]/g, ''));
    let ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'], i = 0, cont = 0;
    for (i == 0; i < ufs.length; i++) {
        $(this).val().toUpperCase() == ufs[i] ? cont++ : null;
    }
    cont == 1 ? $(this).addClass('valid').removeClass('invalid') : $(this).addClass('invalid').removeClass('valid');
})

// VALIDAR EMAIL
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function validate() {
    var email = $("#emailProp").val();
    validateEmail(email) ? $("#emailProp").addClass('valid').removeClass('invalid') : $("#emailProp").addClass('invalid').removeClass('valid');
    return false;
}

// BOTÃO OCULTO IMAGEM >> AO MUDAR > MODAL
$('[id*="btninput"]').on('change', function () {
    var reader = new FileReader();
    reader.onload = function (event) {
        $image_crop.croppie('bind', {
            url: event.target.result
        })
    }
    reader.readAsDataURL(this.files[0]);
    $('#modalCropUser').modal('open');
});

$(document).on('click', '[id*="btninput"]', function () {
    if ($(this).parents('.dv-imagem-user').find('[id*="imgInside"]').attr('src') !== '/views/img/base.png' && $(this).hasClass('sw-ok')) {
        Swal.fire({
            title: 'O que deseja?',
            html: "<br>" +
                '<div><button class="waves-effect waves-block btn-small bt-sw-nova green kit-flex fonte-primaria">' + 'Nova Image' + '</button>' +
                '<button class="waves-effect waves-block btn-small bt-sw-del red kit-flex fonte-primaria">' + 'Remover' + '</button></div>',
            showCancelButton: false,
            showConfirmButton: false,
            allowEscapeKey: false,
        })
        return false;
    }
})

// CONFIRMAÇÃO CROP IMAGEM USER
$('.crop_image').on('click', function (event) {
    $('#btninput,#btninput2,#btninput3').addClass('sw-ok')
    $image_crop.croppie('result', {
        type: 'base64',
        format: 'jpeg' | 'png' | 'webp',
        size: 'original',
        quality: 1
    }).then(function (response) {
        if ($('#modalProcentagem').hasClass('open')) {
            $('#imgInside').attr('src', response);
        } else if ($('#modalValor').hasClass('open')) {
            $('#imgInside2').attr('src', response);
        } else {
            $('#imgInside3').attr('src', response);
        }
        $('#modalCropUser').modal('close');

        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
        var uploadfile = $("input[name=imgPerfil]")[0].files[0];
        var formData = new FormData();
        formData.append("imgPerfil", uploadfile);
        
        $.ajax({
            url: '/cadastrarFotoProduto',
            method: 'POST',
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
             
                $("input[name='fotocaminho']").val(data.message);
                msgswal('Sucesso', 'Imagem modificada', 'success')
            },
            error: function (msg) { }
        })

        function imageIsLoaded(e) {
            // $('#imgInside').attr('src', e.target.result);
            // $('#btninput').attr('src', e.target.result);
        }
        // verificarImagem()
    });
});

$(document).on('click', '.bt-sw-nova', function () {
    if ($('#modalProcentagem').hasClass('open')) {
        $('#btninput').removeClass('sw-ok');
        $('#btninput').click()
        $('#btninput').addClass('sw-ok');
        Swal.close();
    } else if ($('#modalValor').hasClass('open')) {
        $('#btninput2').removeClass('sw-ok');
        $('#btninput2').click()
        $('#btninput2').addClass('sw-ok');
        Swal.close();
    } else {
        $('#btninput3').removeClass('sw-ok');
        $('#btninput3').click()
        $('#btninput3').addClass('sw-ok');
        Swal.close();
    }
    return false;
})

$(document).on('click', '.bt-sw-del', function () {
    $('[id*="imgInside"]').attr('src', '/views/img/base.png')
    $('#btninput,#btninput2,#btninput3').removeClass('sw-ok');
    Swal.close();
})

// CONFIRMAÇÃO CROP IMAGEM USER
$('.crop_image').on('click', function (event) {
    $('#btninput,#btninput2,#btninput3').addClass('sw-ok')
    $image_crop.croppie('result', {
        type: 'base64',
        format: 'jpeg' | 'png' | 'webp',
        size: 'original',
        quality: 1
    }).then(function (response) {
        $('#imgInside').attr('src', response);
        $('#modalCropUser').modal('close');

        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
        var uploadfile = $("input[name=imgPerfil]")[0].files[0];
        var formData = new FormData();
        formData.append("imgPerfil", uploadfile);

        $.ajax({
            url: '/cadastrarFotoProduto',
            method: 'POST',
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                console.log(data)
                $("input[name='fotocaminho']").val(data.message);
                msgswal('Sucesso', 'Imagem modificada', 'success')
            },
            error: function (msg) { }
        })

        function imageIsLoaded(e) {
            // $('#imgInside').attr('src', e.target.result);
            // $('#btninput').attr('src', e.target.result);
        }
    });
});

$(document).ready(function () {

    $('#tel').val($('#tel').attr('value'))

    $('.divLoader').css('display', 'none')

    // AUTOCOMPLETE UF
    $('#uf.autocomplete').autocomplete({
        data: {
            'AC': null,
            'AL': null,
            'AM': null,
            'AP': null,
            'BA': null,
            'CE': null,
            'DF': null,
            'ES': null,
            'GO': null,
            'MA': null,
            'MG': null,
            'MS': null,
            'MT': null,
            'PA': null,
            'PB': null,
            'PE': null,
            'PI': null,
            'PR': null,
            'RJ': null,
            'RN': null,
            'RS': null,
            'RO': null,
            'RR': null,
            'SC': null,
            'SE': null,
            'SP': null,
            'TO': null
        },
    });

    // MODAL > CROP > IMG USER
    $('#modalCropUser').modal({
        dismissible: false,
        onOpenStart: function () {
        },
        onCloseStart: function () {
        }
    })

    // INICIALIZADOR CROP IMAGEM
    $image_crop = $('#image_demo').croppie({
        enableExif: true,
        viewport: {
            width: 150,
            height: 150,
            type: 'square', //square
            quality: 1
        },
        boundary: {
            width: 300,
            height: 300,
            enforceBoundary: true
        }
    });

});

$('#especialidade').formSelect();

// MSG SWAL
function msgswal(title, text, icon) {
    Swal.fire({
        title: title,
        html: text,
        icon: icon,
        timer: 4000,
        confirmButtonColor: "#800080"
    })
}

// VIA CEP VERIFICAÇÃO
function limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    document.getElementById('rua').value = ("");
    document.getElementById('bairro').value = ("");
    document.getElementById('cidade').value = ("");
    document.getElementById('uf').value = ("");
}
function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
        document.getElementById('rua').value = (conteudo.logradouro);
        document.getElementById('bairro').value = (conteudo.bairro);
        document.getElementById('cidade').value = (conteudo.localidade);
        document.getElementById('uf').value = (conteudo.uf);

        $('#formIni').find('#rua,#bairro,#cidade,#uf').each(function () {
            $(this).val().length > 0 ? $(this).addClass('valid').removeClass('invalid') : $(this).addClass('invalid').removeClass('valid');
        })
    } else {
        limpa_formulário_cep();
        msgswal('CEP não encontrado!', 'Verifique o CEP informado', 'error')
    }
}
function pesquisacep(valor) {

    var cep = valor.replace(/\D/g, '');
    if (cep != "") {

        var validacep = /^[0-9]{8}$/;
        if (validacep.test(cep)) {

            document.getElementById('rua').value = "...";
            document.getElementById('bairro').value = "...";
            document.getElementById('cidade').value = "...";
            document.getElementById('uf').value = "...";

            var script = document.createElement('script');
            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';
            document.body.appendChild(script);

        }
        else {
            limpa_formulário_cep();
            msgswal('CEP inválido!', 'Verifique o CEP informado', 'error')
        }
    }
    else {
        limpa_formulário_cep();
    }
}

// MASCARAS
function inputHandler(masks, max, event) {
    var c = event.target;
    var v = c.value.replace(/\D/g, '');
    var m = c.value.length > max ? 1 : 0;
    VMasker(c).unMask();
    VMasker(c).maskPattern(masks[m]);
    c.value = VMasker.toPattern(v, masks[m]);
}
// TELEFONE REST
var telMask = ['(99) 9999-9999', '(99) 99999-9999'];
var tel = document.querySelector('#tel');
VMasker(tel).maskPattern(telMask[0]);
tel.addEventListener('input', inputHandler.bind(undefined, telMask, 14), false);
// TELEFONE USUARIO
var telMask = ['(99) 9999-9999', '(99) 99999-9999'];
var tel = document.querySelector('#tel2');
VMasker(tel).maskPattern(telMask[0]);
tel.addEventListener('input', inputHandler.bind(undefined, telMask, 14), false);
// CPF/CNPJ REST
var docMask = ['999.999.999-999', '99.999.999/9999-99'];
var doc = document.querySelector('#cpfcnpj');
VMasker(doc).maskPattern(docMask[0]);
doc.addEventListener('input', inputHandler.bind(undefined, docMask, 14), false);
// CPF USUARIO
var docMask = ['999.999.999-99'];
var doc = document.querySelector('#cpf');
VMasker(doc).maskPattern(docMask[0]);
doc.addEventListener('input', inputHandler.bind(undefined, docMask, 14), false);
// CEP LOCAL
var docMask = ['99999-999'];
var doc = document.querySelector('#cep');
VMasker(doc).maskPattern(docMask[0]);
doc.addEventListener('input', inputHandler.bind(undefined, docMask, 9), false);
