// ATUALIZAR USUARIO
function atualizarUsuario() {
    $.ajax({
        type: 'PUT',
        url: '/atualizarUsuario',
        cache: false,
        data: {
            nome: $('#username').val(),
            cpf: $("#usercpf").val(),
            numero: $('#usercelular').val(),
            fotocaminho: $("input[name='fotocaminho']").val()
        },
        beforeSend: function () {
            $('.form-dados').find('input').each(function () {
                $(this).attr('disabled', 'disabled')
            })
        },
        success: (data) => {
            $('.form-dados').find('input').not(':last').each(function () {
                $(this).removeAttr('disabled')
            })
            listarUsuario()
            avatarText()
            verificarImagem()
            msgswal('Confirmação', 'Dados atualizados com sucesso', 'success')
        },
        error: (data) => {
            $('.form-dados').find('input').not(':last').each(function () {
                $(this).removeAttr('disabled')
            })
            msgswal('Erro', 'Ocorreu algum erro, tente novamente mais tarde', 'error')
        }
    })
}

// LISTAR USUARIO
function listarUsuario() {
    $.ajax({
        url: '/listarUsuario',
        type: 'GET',
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        headers: {
            'Authorization': Cookies.get('tokenUsuario')
        },
        beforeSend: function () {
            $('.form-dados').find('input').each(function () {
                $(this).attr('disabled', 'disabled')
            })
        },
        success: (data) => {
            if (data.fotousuario != null) {
                $('.img-user-perfil').attr('src', data.fotousuario.replace('/app', ''));
            }

            $('#username').val(data.nomeusuario);
            $('.nameside').html(data.nomeusuario);
            $('#usercpf').val(data.cpf);
            $('#usercelular').val(data.numerousuario);
            $('.telefoneside').html(data.numerousuario);
            $('#useremail').val(data.emailusuario);
            $('.emailside').html(data.emailusuario);
            $('.form-dados').find('input').not(':last').each(function () {
                $(this).removeAttr('disabled')
            });
            avatarText();
            verificarImagem();
        }
    })
}

// MENSAGEM SWAL
function msgswal(title, text, type) {
    Swal.fire({
        title: title,
        text: text,
        timer: 3500,
        icon: type,
        confirmButtonColor: '#800080'
    })
}

// BOTÃO DE SAIR >> LOGGOUT
$(document).on('click', '.bt-sair, .bt-sair-side', function () {
    Swal.fire({
        title: 'Saindo...',
        text: 'Deseja realmente sair?',
        icon: 'warning',
        confirmButtonText: 'Sim',
        confirmButtonColor: '#800080',
        cancelButtonText: 'Não',
        cancelButtonColor: '#333',
        showCancelButton: true
    }).then((result) => {
        if (result.value) {
            Cookies.remove('tokenUsuario');
            window.location.href = "/comeae";
        } else {
            return false;
        }
    })
})

// SUBMIT FORM > DADOS USUARIO
$('.form-dados').submit(function () {
    let dados_form = []
    $('.form-dados').find('input').each(function () {
        dados_form.push($(this).val())
    })
    if (dados_form[0] == '' || dados_form[2] == '' || dados_form[3] == '') {
        msgswal('Erro', 'Há campo(s) obrigatório(s) vazio(s)!', 'error');
        return false;
    } else if ($('#username').hasClass('invalid') || $('#usercpf').hasClass('invalid') || $('#usercelular').hasClass('invalid') || $('#useremail').hasClass('invalid')) {
        msgswal('Erro', 'Há campo(s) inválido(s)!', 'error');
        return false;
    } else {
        atualizarUsuario();
        return false;
    }
})

// VERIFICAÇÃO USERCPF
$(document).on('blur', '#usercpf', function () {
    $(this).val().length > 0 && $(this).val().length < 14 ? $(this).addClass('invalid').removeClass('valid') : $(this).addClass('valid').removeClass('invalid');
})
// VERIFICAÇÃO USER CELULAR
$(document).on('blur', '#usercelular', function () {
    $(this).val().length >= 0 && $(this).val().length < 16 ? $(this).addClass('invalid').removeClass('valid') : $(this).addClass('valid').removeClass('invalid');
})
// FUNCTION VERIFICAR IMAGEM USER
function verificarImagem() {
    $('.img-user-perfil').attr('src') == "" ? $('.lbl-textavatar, .dv-avatar-side').show() : $('.lbl-textavatar, .dv-avatar-side').hide() && $('.img-user-side').attr('src', $('.img-user-perfil').attr('src'))
}

// BOTÃO OCULTO IMAGEM >> AO MUDAR > MODAL
$('#btninput').on('change', function () {
    var reader = new FileReader();
    reader.onload = function (event) {
        $image_crop.croppie('bind', {
            url: event.target.result
        })
    }
    reader.readAsDataURL(this.files[0]);
    $('#modalCropUser').modal('open');
});

// CONFIRMAÇÃO CROP IMAGEM USER
$('.crop_image').on('click', function (event) {
    $image_crop.croppie('result', {
        type: 'base64',
        format: 'jpg' | 'png' | 'webp',
        size: 'viewport',
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
        // console.log('uploadfile', uploadfile, uploadfile.type, response);
        $.ajax({
            url: '/cadastrarFotoProduto',
            method: 'POST',
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            beforeSend: () => {
                $('.bt-salvar-dados').attr('disabled', 'disabled').html('Aguarde...');
            },
            success: function (data) {
                $('.bt-salvar-dados').removeAttr('disabled').html('Salvar');
                $("input[name='fotocaminho']").val(data.message);
                msgswal('Sucesso', 'Salve seu perfil', 'success');
            },
            error: function (msg) { }
        })

        function imageIsLoaded(e) {
            $('#imgInside').attr('src', e.target.result);
            $('#btninput').attr('src', e.target.result);
        }
        verificarImagem()
    });
});

function avatarText() {
    $('.textavatar').textAvatar({
        width: 150,
        name: $('#username').val()
    });
    $('.textavatarside').textAvatar({
        width: 64,
        name: $('#username').val()
    });
}

// MODIFICAR SENHA
$(document).on('click', '.bt-modificar-senha', function () {
    Swal.mixin({
        input: 'password',
        confirmButtonText: 'Próximo &rarr;',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#333',
        confirmButtonColor: "#800080",
        showCancelButton: true,
        progressSteps: ['1', '2', '3']
    }).queue([
        {
            title: 'Senha atual',
            text: 'Digite sua senha atual (6 caracteres ou mais)'
        },
        {
            title: 'Nova senha',
            text: 'Digite a nova senha (6 caracteres ou mais)'
        },
        {
            title: 'Nova senha novamente',
            text: 'Digite a nova senha novamente (6 caracteres ou mais)'
        }
    ]).then((result) => {
        let val = [];
        if (result.value) {
            for (var i = 0; i < result.value.length; i++) { val.push(result.value[i]) }
            if (val[0] == val[1] && val[1] == val[2]) {
                msgswal('Erro', 'A sua nova senha não pode ser igual a atual', 'error', 0)
                return false;
            } else if (val[1] != val[2]) {
                msgswal('Erro', 'A nova senha não corresponde ao campo de confirmação', 'error', 0)
                return false;
            } else if (val[0].length < 6 || val[1].length < 6) {
                msgswal('Erro', 'A senha não tem o mínimo permitido (6 caracteres)', 'error', 0);
                return false;
            } else {
                // MODIFICAR SENHA
                $.ajax({
                    type: 'PUT',
                    url: '/AlterarSenhaUsuario',
                    cache: false,
                    data: { senha: val[1], senhaantiga: val[0] },
                    beforeSend: () => {
                        Swal.fire({
                            title: 'Aguardando confirmação...',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: false,
                            showConfirmButton: false
                        })
                    },
                    success: (data) => {
                        msgswal('Confirmação', 'Sua senha foi modificada com sucesso.', 'success', 4000)
                    },
                    error: (data) => {
                        msgswal('Erro', data.responseJSON.message
                            , 'error', 4000);
                    }
                })
            }
        }
    })
})

$(document).ready(function () {

    var socket = io('https://comeaee.herokuapp.com/');
    socket.emit("entrar pedidos", $('.cod').val(), function (valido) {

    });
    socket.on('atualizar pedidos', function (message) {
        Push.create("Comeaê", {
            body: message,
            icon: '/views/img/logocompletaroxo.png',
            timeout: 4000,
            onClick: function () {
                window.focus();
                this.close();
            }
        });
    })

    listarUsuario();

    var socket = io('http://localhost:3000');

    socket.on('atualizar pedidos', function (message) {
        Push.create("Comeaê", {
            body: message,
            icon: '/views/img/logocompletaroxo.png',
            timeout: 4000,
            onClick: function () {
                window.focus();
                this.close();
            }
        });
    })

    // INICIALIZADOR CROP IMAGEM
    $image_crop = $('#image_demo').croppie({
        enableExif: true,
        viewport: {
            width: 180,
            height: 180,
            type: 'circle', //square
            quality: 1,
        },
        boundary: {
            width: 290,
            height: 290,
            enforceBoundary: true
        }
    });

    // MODAL > CROP > IMG USER
    $('#modalCropUser').modal({
        onOpenStart: function () {
            $('.rodape-mobile').css('z-index', '99')
        },
        onCloseStart: function () {
            $('.rodape-mobile').css('z-index', '9999')
        }
    })

    // AVATAR NAME USER
    verificarImagem()
    avatarText()

});

//INICIALIZADOR MASK CPF/CNPJ - TELEFONE
function inputHandler(masks, max, event) {
    var c = event.target;
    var v = c.value.replace(/\D/g, '');
    var m = c.value.length > max ? 1 : 0;
    VMasker(c).unMask();
    VMasker(c).maskPattern(masks[m]);
    c.value = VMasker.toPattern(v, masks[m]);
}
// CPF MASK
var docMask = ['999.999.999-999', '99.999.999/9999-99'];
var doc2 = document.querySelector('#usercpf');
VMasker(doc2).maskPattern(docMask[0]);
doc2.addEventListener('input', inputHandler.bind(undefined, docMask, 14), false);
// TELEFONE MASK
var telMask = ['(99) 9 9999-9999'];
var tel = document.querySelector('#usercelular');
VMasker(tel).maskPattern(telMask[0]);
tel.addEventListener('input', inputHandler.bind(undefined, telMask, 16), false);