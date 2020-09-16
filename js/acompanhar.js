function msgswal(title, text, icon, timer, funcao) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: timer,
        confirmButtonColor: "#800080",
        onClose: () => {
            funcao
        }
    })
}

function msgswalplus(title, text, icon, timer, funcao) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: timer,
        confirmButtonColor: "#800080",
        onClose: () => {
            funcao
        }
    })
}

function inicioDados() {
    $.ajax({
        url: '/listarPedidosUsuarios/'+$('.codpedido').val(),
        type: 'GET',
        success: function (data) {
            Cookies.set('tokenUsuario',data.refreshToken);
            let dataped = data.pedidos.createdAt;
            let dat = moment(dataped).format('DD/MM/YYYY - HH:mm');
            var resultado = moment(dat, 'HH:mm').add(parseInt(data.pedidostempoentrega), 'minutes').format('HH:mm')
            $('.horarealizado').text(dataped.substr(11, 5));
            $('.previsao').text((dataped).substr(8, 2) + '/' + (dataped).substr(5, 2) + '/' + (dataped).substr(0, 4) + '  ' + dataped.substr(11, 5) + ' - ' + resultado);
            $(".nomelocal").text(data.pedidos.restaurante.nomefantasia);
            $('.detalhes-pedido').attr('data-id', data.id);
            let stts = parseInt(data.pedidos.codstatuspedido);
            stts == 1 ? $('.circulo1').addClass('ativo') : stts == 9 ? $('.circulo1,.circulo2').addClass('ativo') : stts == 5 ? $('.circulo1,.circulo2,.circulo3, .entrega-icon').addClass('ativo') : $('.circulo1,.circulo2,.circulo3,.entrega-icon').removeClass('ativo');

            $('.dv-loader').hide()

        },
        error: function (data) {
            $('.dv-loader').hide()
        }
    })
}

function detalhesPedido(id) {
    let valor_prods = [],
        soma = 0,
        taxa = 0;
    $('.dv-itens').empty();
    $.ajax({
        url: '/listarPedidoUsuario/' + id,
        cache: false,
        dataType: 'json',
        beforeSend: function () {
            $('.loader-side-detahes').css('display', 'flex');
        },
        success: (data) => {
            $('.loader-side-detahes').css('display', 'none');
            let produtos = JSON.parse(data.pedidos.produtos);
            for (let i = 0; i < produtos.length; i++) {

                $('.dv-itens').append('<div class="item"> <div class="dv-nome-item"><span class="produto">' + produtos[i].produto + '</span><span class="comentario"></span> </div><div class="dv-valor-item"><span class="valor-produto">' + produtos[i].valor + '</span> </div></div>');
            }
            $('.local-info').text(data.pedidos.endereco.rua + ', Nº: ' + data.pedidos.endereco.nmrcasa + ', ' + data.pedidos.endereco.bairro);
            $('.numero-pedido-info').text(data.pedidos.id);
            $('.data-pedido-info').text();
            let dataped = data.pedidos.createdAt;
            let dat = moment(data.pedidos.createdAt).format('DD/MM/YYYY - HH:mm');

            var resultado = moment(dat, 'HH:mm').add(parseInt(data.pedidos.restaurante.tempoentrega), 'minutes').format('HH:mm');
            $('.hora-info').text((dataped).substr(8, 2) + '/' + (dataped).substr(5, 2) + '/' + (dataped).substr(0, 4) + '  ' + dataped.substr(11, 5) + ' - ' + resultado)
            $('.data-pedido-info').text((dataped).substr(8, 2) + '/' + (dataped).substr(5, 2) + '/' + (dataped).substr(0, 4));

            $('.status-pedido-info').text(data.pedidos.statuspedido.statuspedido);
            $('.nomedolocal').text(data.pedidos.restaurante.nomefantasia);
            $('.pagamento-pedido-info').text(data.pedidos.tipopagamento.tipopagamento);
            // $('.total-valor').text('R$ '+data.pedidos.valor)
            $('.cardapio').attr("href", "/lista-restaurante/" + data.pedidos.restaurante.id);
            $('.dv-itens .item').each(function () {
                valor_prods.push($(this).find('.valor-produto').text().replace('R$ ', '').replace(',', '.'))
            })

            for (var i = 0; i < valor_prods.length; i++) {
                soma += parseFloat(valor_prods[i])
            }
            taxa = parseFloat($('.taxa-valor').text().replace('R$ ', '').replace(',', '.'))

            $('.subtotal-valor').text('R$ ' + parseFloat(soma).toFixed(2).replace('.', ','))
            $('.total-valor').text('R$ ' + (soma + taxa).toFixed(2).replace('.', ','))
            // 
        }
    });


}

function VerificarLogin() {
    let a = "";
    $('.log-check, .log-check-mobile').empty();
    Cookies.get('tokenUsuario') ? $('<a class="col l5 item-menu waves-effect waves-light btn-perfil drop-perfil-trigger" data-target="dropdown-perfil-log"><i class="icon-perfil" ></i><span>Perfil</span></a >').appendTo('.log-check') && $('<i class="icon-perfil"></i><span class="legenda-tab-menu cor-primaria">Perfil</span>').appendTo('.log-check-mobile') && $('.log-check-mobile').removeClass('btn-identidade') && $('.log-check-mobile').addClass('btn-perfil-mobile') : $('<a class="col l5 item-menu waves-effect waves-light btn-identidade"><i class="icon-logout"></i> <span>Identifique-se</span></a >').appendTo('.log-check') && $('<i class="icon-logout"></i><span class="legenda-tab-menu cor-primaria">Entrar</span>').appendTo('.log-check-mobile') && $('.log-check-mobile').addClass('btn-identidade') && $('.log-check-mobile').removeClass('btn-perfil-mobile');

    Cookies.get('infoRest') ? a = Cookies.get('infoRest').split(',') : null;
    Cookies.get('token') ? $('.dv-rest-logado').show() && $('.nome-estab-log').text(a[0]) && $('.email-esta-log').text(a[1]) : $('.dv-rest-logado').hide(100, Cookies.remove('infoRest'));
}


// CONTROLADOR SELECT2 > MODAL > ENDEREÇO
$(document).on('change', '.selectUF, .selectLOC', function () {
    $('.selectUF option:selected').val() == "" ? $('.selectLOC').attr('disabled', 'disabled') && $('.selectLOC').val('').trigger('change.select2') : $('.selectLOC').removeAttr('disabled');
    $('.selectUF option:selected').val() !== "" && $('.selectLOC option:selected').val() !== "" ? $('.btnconfirmLOC').removeAttr('disabled') : $('.btnconfirmLOC').attr('disabled', 'disabled');
})
// CLIQUE BOTÃO CONFIRMAR MODAL > ENDERECO
$(document).on('click', '.btnconfirmLOC', function () {
    let dadosloc = [],
        arrayend;
    dadosloc.push($('.selectUF').val(), $('.selectLOC option:selected').html(), $('.selectLOC').val())
    Cookies.set('endereco', JSON.stringify(dadosloc))
    arrayend = Cookies.get('endereco')
    $('.endereco-cadastrado-mobile span:first, .endereco-cadastrado span:first').html('Entregar em: ')
    $('.endereco-cadastrado-mobile span:last, .endereco-cadastrado span:last').html(JSON.parse(arrayend)[1] + ' - ' + JSON.parse(arrayend)[0])
    $('.locatual').text(JSON.parse(arrayend)[1])
    $('#modalEntrada').modal('close')
})
// Corrigir Input Select2 > MODAL > ENDERECO
$(document).on('focus', '#modalEntrada .select2-search__field', function () {
    $(this).addClass('browser-default');
});
/* Carrinho > Mobile */
$(document).on('click', '#bt-tab-carrinho', function () {
    $('.sidenav-carrinho').sidenav('open');
});
/* Fechar > Carrinho > Mobile */
$(document).on('click', '.fechar_carrinho', function () {
    $('.sidenav').sidenav('close');
});
/* Botao > Pesquisar */
$(document).on('click', '.botao', function () {
    $("#navbar-pesquisar").css({
        "opacity": "0",
    }, $('#navbar-pesquisar').removeClass('hide')).animate({
        opacity: 1
    })
    $('#search').focus();
    $('#navbar-pesquisar #search').val() <= 0 ? $('.limpar-pesquisa').hide(300) : $('.limpar-pesquisa').show(300)
});
/* Ocultar/Exibir > Limpar pesquisa */
$(document).on('input', '#navbar-pesquisar #search', function () {
    $(this).val() <= 0 ? $('.limpar-pesquisa').hide(300) : $('.limpar-pesquisa').show(300)
})
/* Botao > Pesquisa > Voltar */
$(document).on('click', '.inicio', function () {
    $("#navbar-pesquisar").css({
        "opacity": "1",
    }).animate({
        opacity: 0
    }, function () {
        $('#navbar-pesquisar').addClass('hide')
    })
});
/* Limpar pesquisa */
$(document).on('click', '.limpar-pesquisa', function () {
    $('#navbar-pesquisar #search').val('')
    $('#search').focus();
    $('#navbar-pesquisar #search').val() <= 0 ? $('.limpar-pesquisa').hide(300) : $('.limpar-pesquisa').show(300)
})
/* Blur da pesquisa */
$(document).on('blur', '#navbar-pesquisar #search', function () {
    $(this).val().trim().length <= 0 ? $(this).val('') && $('.inicio').click() : null;
});

function AddtToCart() {
    $('.carrinho_itens, .carrinho_itens_side').empty()
    if (Cookies.get('carrinho')) {
        let carro = JSON.parse(Cookies.get('carrinho')),
            i = 0;
        if (Array.isArray(JSON.parse(Cookies.get("carrinho")))) {
            for (i == 0; i < carro.length; i++) {
                $('<div data-uuid=' + carro[i].uuid + ' data-id=' + carro[i].id + ' class="item-carrinho"><div><span>' + carro[i].nomeProduto + '</span><span>R$ ' + carro[i].valor + '</span></div><div><span>' + carro[i].adicionais + '</span></div><div><span class="removeritem">Remover</span></div></div>').appendTo('.carrinho_itens, .carrinho_itens_side')
            }
            VerificarCart()
        } else {
            $('<div data-uuid=' + carro.uuid + ' data-id=' + carro.id + ' class="item-carrinho"><div><span>' + carro.nomeProduto + '</span><span>R$ ' + carro.valor + '</span></div><div><span>' + carro.adicionais + '</span></div><div><span class="removeritem">Remover</span></div></div>').appendTo('.carrinho_itens, .carrinho_itens_side')
            VerificarCart()
        }
    } else {
        VerificarCart()
    }
}

function VerificarCart() {
    // $('.carrinho_itens, .carrinho_itens_side').empty()
    let qnt = 0,
        nomerest;
    $('.carrinho_itens').find('.item-carrinho').each(function () {
        qnt++;
    })

    Cookies.get('carrinho') ? Array.isArray(JSON.parse(Cookies.get('carrinho'))) ? nomerest = JSON.parse(Cookies.get('carrinho'))[0].nomerestaurante : nomerest = JSON.parse(Cookies.get('carrinho')).nomerestaurante : null;

    qnt <= 0 ? $('.carrinho_itens, .carrinho_itens_side').append('<div class="grey lighten-5 center-align center circulo-vazio no-select"><i class="icon-carrinho_vazio"></i></div><span class="legenda-vazio">Seu carrinho está vazio <br>Adicione itens</span>') && $('.titulo-limpar-pedido, .titulo-pedido').hide() && $('.btn-finalizar-pedido').attr('disabled', 'disabled') && $('.titulo-pedido-restaurante').html('') : $('.titulo-limpar-pedido, .titulo-pedido').show() && $('.btn-finalizar-pedido').removeAttr('disabled') && $('.titulo-pedido-restaurante').html(nomerest)
}

$(document).on('click', '.btn-identidade', function () {
    $('.sidenav-login').sidenav('open') && $('#emaillog').focus();
})

// CALCULA OS VALORES DA SACOLA > SUBTOTAL | ENTREGA | TOTAL 
$(document).on('click', '#bt-topo-carrinho, #bt-tab-carrinho, .removeritem', function () {

    setTimeout(() => {
        let i = 0,
            valores = [],
            carro;

        $(this).find('span:first').attr('class') == "carrinho-sup" ? carro = ".carrinho_itens" : carro = ".carrinho_itens_side";

        $(carro).find('.item-carrinho').each(function () {
            i++;
            valores.push($(this).find('div:first').find('span:last').html().substr(3).replace('R$ ', '').replace(',', '.'))
        })

        let soma = 0;
        for (ii = 0; ii < valores.length; ii++) {
            soma += parseFloat(valores[ii])
        }

        let entrega = parseFloat($('.entrega-top').text().replace('R$ ', '').replace(',', '.'))

        i >= 1 ? $('.subtotal-top').text('R$ ' + (soma.toFixed(2)).replace('.', ',')) && $('.total-top').text('R$ ' + (soma + entrega).toFixed(2).replace('.', ',')) : $('.subtotal-top').text('R$ 0,00') && $('.entrega-top').text('R$ 0,00') && $('.total-top').text('R$ 0,00');
    }, 400);
})

$(document).on('click', '.bt-logar', function () {
    $('.dv-cad-email, .dv-cad-rest').hide(400);
    $('.dv-logar').show(400);
})

// apenas numeros > verificação codigo email
$(document).on('keyup input', '.fm-verificar-code > div > div > input', function (e) {
    if (/\D/g.test(this.value)) {
        this.value = this.value.replace(/\D/g, '');
    }
});

$(document).on('click', '.bt-cadastrar', function () {
    Swal.fire({
        title: 'Cadastrar como...',
        icon: 'info',
        html: '<br><button class="sw-bt-cad-cli waves-effect waves-light btn-small purple darken-2" style="margin-right: 5px">' + 'Cliente' + '</button>' +
            '<button class="sw-bt-cad-rest waves-effect waves-light btn-small purple darken3" style="margin-left: 5px">' + 'Restaurante' + '</button>',
        showCancelButton: false,
        showConfirmButton: false,
        timer: 0
    })
})

$(document).on('click', '.sw-bt-cad-cli, .sw-bt-cad-rest', function () {
    swal.close()
    $('.dv-logar').hide(400);
    $(this).text() == "Cliente" ? $('.dv-cad-email').show(400) : $('.dv-cad-rest').show(400);
})

$(document).on('click', '.sw-bt-entrar-cliente', function () {
    swal.close();
    $.ajax({
        type: 'POST',
        url: '/login',
        beforeSend: function () {
            $('.bt-entrar > button').text('Entrando').attr('disabled', 'disabled')
        },
        dataType: 'json',
        data: {
            email: $('#emaillog').val(),
            senha: $('#senhalog').val()
        },
        success: (data) => {
            Cookies.set('tokenUsuario', data.token);
            Cookies.remove('token');
            $('.bt-entrar > button').text('Entrar').removeAttr('disabled');
            $('.sidenav-login').sidenav('close');
            $('.sidenav-login input').each(function () {
                $(this).val('').removeClass('invalid,valid')
            })
            VerificarLogin();
            $('.drop-perfil-trigger').dropdown({
                coverTrigger: false
            })
        },
        error: (error) => {
            $('.bt-entrar > button').text('Ops...')
            msgswal('Erro!', error.responseJSON.message, 'error', 4000, $('.bt-entrar > button').text('Entrar').removeAttr('disabled'))
            return false;
        }
    })
})

$(document).on('click', '.sw-bt-entrar-rest', function () {
    swal.close();
    if (Cookies.get('token')) {
        window.location.href = '/admin_start';
    } else {
        $.ajax({
            url: '/log_rest',
            type: 'POST',
            dataType: 'json',
            data: {
                email: $('#emaillog').val(),
                senha: $('#senhalog').val()
            },
            beforeSend: function () {
                $('.bt-entrar > button').text('Entrando').attr('disabled', 'disabled')
            },
            success: function (data) {
                var minuto = new Date(new Date().getTime() + 30 * 60 * 1000);
                Cookies.remove('tokenUsuario');
                Cookies.set('token', data.token, {
                    expires: minuto
                });
                window.location.href = '/admin_start';
                $('.bt-entrar > button').text('Entrar').removeAttr('disabled');
            },
            error: (error) => {
                $('.bt-entrar > button').text('Ops...')
                msgswal('Erro!', error.responseJSON.message, 'error', 4000, $('.bt-entrar > button').text('Entrar').removeAttr('disabled'))
                return false;
            }
        })
    }
})

$(document).on('click', '.bt-entrar > button', function () {
    let cont = 0;
    $('.fm-logar').find('input').each(function () {
        $(this).val() == '' && $(this).attr('required') || $(this).hasClass('invalid') ? $(this).addClass('invalid') && cont++ : null;
    })
    if (cont <= 0) {

        Swal.fire({
            title: 'Entrar como...',
            icon: 'info',
            html: '<br><button class="sw-bt-entrar-cliente waves-effect waves-light btn-small purple darken-2" style="margin-right: 5px">' + 'Cliente' + '</button>' +
                '<button class="sw-bt-entrar-rest waves-effect waves-light btn-small purple darken3" style="margin-left: 5px">' + 'Restaurante' + '</button>',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 0
        })
        return false;
    } else {
        msgswal('Erro!', 'Há campos inválidos ou vazios', 'error', 3500)
        return false;
    }
})

$(document).on("click", ".bt-aut-cadastro > button", function () {
    if ($('#emailautcad').val() == "" || $('#emailautcad').hasClass('invalid')) {
        $(this).addClass('invalid');
        msgswal('Campo vazio ou inválido!', 'Preencha corretamente o campo email', 'error', 4500)
        return false;
    } else {
        $.ajax({
            type: 'POST',
            url: '/verificarEmail',
            beforeSend: function () {
                $('.bt-aut-cadastro > button').text('Enviando').attr('disabled', 'disabled')
            },
            data: {
                email: $('#emailautcad').val()
            },
            success: function (data) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: data.message,
                    icon: 'success',
                    timer: 4000,
                    confirmButtonColor: '#800080'
                }).then(() => {
                    $('.bt-aut-cadastro > button').text('Enviar').removeAttr('disabled');
                    $('.enviado-para').text($('#emailautcad').val())
                    $('.dv-cad-email').hide(400);
                    $('.dv-verificar-code').show(400, function () {
                        $('#code1').focus()
                    });
                    $('.inputscode input').each(function () {
                        $(this).val('')
                    });
                })
            },
            error: function (data) {
                msgswal('Erro!', data.message, 'error')
                $('.bt-aut-cadastro > button').text('Enviar').removeAttr('disabled')
                return false;
            }
        })
    }
});

// VALIDAR EMAIL
$(document).on('keyup input focus', '#senhalog', function () {
    $(this).val().length < 6 ? $(this).addClass('invalid').removeClass('valid') : $(this).addClass('valid').removeClass('invalid');
})

// VALIDAR EMAIL
$(document).on('keyup input focus', 'input[type=email]', function () {
    validateEmail($(this).val()) ? $(this).addClass('valid').removeClass('invalid') : $(this).addClass('invalid').removeClass('valid');
})

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$(document).on('keyup', '[id^="code"]', function (e) {
    let cont = 0,
        tecla = e.keyCode || e.which;

    $('.inputscode input').each(function () {

        if (tecla == 8 || tecla == 46) {
            $('.inputscode input').each(function () {
                $(this).val().length > 0 ? $(this).select() : null;
            })
        } else if ($(this).val().length > 0) {
            cont++;
            cont == 5 ? $('.bt-enviar-code > button').click() && $(this).blur() : $(this).next().focus();
        } else {
            $(this).focus();
            return false;
        }
    })
})

$(document).on("click", ".bt-enviar-code > button", function () {
    let resultado = "",
        cont = 0;
    $('.inputscode div input').each(function () {
        $(this).val == "" ? cont++ : null;
        resultado += $(this).val();
    })

    if (cont <= 0) {
        $.ajax({
            url: '/verificarCodigo',
            beforeSend: function () {
                $('.bt-enviar-code > button').attr('disabled', 'disabled').text('Verificando');
            },
            type: 'POST',
            data: {
                resultado: resultado,
                email: $('.enviado-para').text()
            },
            success: () => {
                $('.bt-enviar-code > button').attr('disabled', 'disabled').text('Confirmado!');
                $('.dv-verificar-code').hide(400);
                $('.inputscode input').each(function () {
                    $(this).val('')
                });
                $('#emailcad').val($('.enviado-para').text());
                $('.dv-cadastrar').show(400, function () {
                    $('#nome').focus()
                });
            },
            error: () => {
                msgswal('Erro!', 'Ocorreu um erro, por favor, verifique o seu código e tente novamente', 'error', 5000, $('.bt-enviar-code > button').removeAttr('disabled').text('Enviar'));
            }
        })
    } else {
        msgswal('Há campos vazios', 'Tenha certeza de que preencheu todos os campos', 'error', 3000)
        return false;
    }
})

// VALIDAR NOME
$(document).on('input focus', '#nome', function () {
    /\w+\s+\w+/.test($(this).val()) ? $(this).addClass('valid').removeClass('invalid') : $(this).addClass('invalid').removeClass('valid');
})
$(document).on('input focus', '#nome_rest', function () {
    $(this).val().length > 0 ? $(this).addClass('valid').removeClass('invalid') : $(this).addClass('invalid').removeClass('valid');
})

// MASCARA TELEFONE
$(document).on('input focus', '#telefone, #telefone_rest', function () {
    let val = $(this).val();
    val.length >= 10 ? $(this).addClass('valid').removeClass('invalid') : $(this).addClass('invalid').removeClass('valid');
})
$(document).on('blur', '#telefone, #telefone_rest', function () {
    let val = $(this).val();
    val.length == 10 ? $(this).val('(' + val.substr(0, 2) + ') ' + val.substr(2, 4) + '-' + val.substr(6, 4)) : val.length == 11 ? $(this).val('(' + val.substr(0, 2) + ') ' + val.substr(2, 5) + '-' + val.substr(7, 4)) : null;
})
$(document).on('focus', '#telefone, #telefone_rest', function () {
    $(this).val($(this).val().replace(/[_\W]+/g, ''));
})


// VERIFICAR SENHAS
$(document).on('input focus', '#senhacad, #confsenhacad', function () {
    let sc = $('#senhacad').val(),
        cfsc = $('#confsenhacad').val();
    sc.length >= 6 && cfsc.length >= 6 && sc == cfsc ? $('#senhacad,#confsenhacad').addClass('valid').removeClass('invalid') : $('#senhacad,#confsenhacad').addClass('invalid').removeClass('valid');
})

// ENVIAR FORMULÁRIO
$(document).on('click', ".bt-conf-cadastrar > button", function () {
    let cont = 0,
        valores = [];

    $('.fm-cadastrar .input-field input').each(function () {
        $(this).attr('required') && $(this).hasClass('invalid') || $(this).val().length <= 0 ? $(this).addClass('invalid').removeClass('valid') && cont++ : null;
        valores.push($(this).val())
    })

    if (cont <= 0) {
        $.ajax({
            url: '/cadastrarUsuario',
            type: 'POST',
            data: {
                nome: valores[0],
                email: valores[2],
                numero: valores[1],
                senha: valores[3],
                senhaConfirm: valores[4],
                idfacebook: $(".idFacebook").val(),
                receber_novidades: $('.check-news').is(':checked')
            },
            beforeSend: function () {
                $('.bt-conf-cadastrar > button').html('Enviando').attr('disabled', 'disabled')
            },
            success: function () {
                $('.bt-conf-cadastrar > button').html('Sucesso').attr('disabled', 'disabled')
                msgswalplus('Sucesso', 'Cadastro efetuado', 'success', 4000, setTimeout(() => {
                    $('.dv-cadastrar').hide(400);
                    $('.dv-logar').show(400)
                }, 4000))
            },
            error: function () {
                $('.bt-conf-cadastrar > button').html('Cadastrar').removeAttr('disabled')
                msgswal('Erro!', 'Ocorreu um erro, tente novamente', 'error', 3000)
                return false;
            }
        })
    } else {
        msgswal('Erro', 'Há campos inválidos', 'error', 3000)
        return false;
    }
})

$(document).on('click', '.bt-recuperar', function () {
    $('.swal2-input').attr('autocomplete')
    Swal.fire({
        validationMessage: 'Endereço de email inválido',
        html: '<p style="font-size: 27px">Digite seu email para recuperar a senha<p><br>',
        inputPlaceholder: 'Email',
        input: 'email',
        showCancelButton: true,
        cancelButtonColor: '#333',
        cancelButtonText: 'Cancelar',
        imageUrl: 'https://cdn1.iconfinder.com/data/icons/flat-business-icons/128/mail-512.png',
        imageHeight: 150,
        confirmButtonColor: '#800080',
        confirmButtonText: 'Enviar',
        allowOutsideClick: true,
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
            var promise1 = new Promise(function (resolve, reject) {
                $.ajax({
                    type: 'POST',
                    url: '/redefinirSenhaCliente',
                    beforeSend: function () {
                        $('.swal2-confirm').addClass('disabled').html('Enviando');
                    },
                    data: {
                        'email': login
                    },
                    cache: false,
                    success: function (response) {
                        $('.swal2-confirm').removeClass('disabled').html('Enviar');
                        msgswal('Sucesso!', response.message, 'success', 3000)
                        resolve();
                    },
                    error: function (data) {
                        $('.swal2-confirm').removeClass('disabled').html('Enviar');
                        msgswal('Erro!', data.responseJSON.message, 'error', 3000)
                        reject();
                    }
                })
            })
            return false;
        }
    })
});

$(document).on('click', '.bt-editaremail', function () {
    $('.dv-verificar-code input').each(function () {
        $(this).val('')
    });
    $('.dv-verificar-code').hide(400)
    $('.dv-cad-email').show(400, function () {
        $('#emailautcad').focus()
    })
})

$(document).on('click', '.btn-perfil-mobile', function () {
    $('.side-perfil-log').sidenav('open')
})

$(document).on('click', '.dv-sair-app, .bt-sair-app', function () {
    Cookies.remove('tokenUsuario');
    $('.drop-perfil-trigger').dropdown('close');
    $('.side-perfil-log').sidenav('close');
    VerificarLogin();
    window.location.href = '/comeae'
})

$(document).on('click', '.bt-sessao-sair', function () {
    $('.sidenav-login').sidenav('close');
    Cookies.remove('token');
    VerificarLogin();
    window.location.href = '/comeae'
})

$(document).on('click', '.bt-conf-cad-rest', function () {
    let cont = 0;
    $('.fm-cad-rest input').each(function () {
        $(this).val().length <= 0 || $(this).attr('invalid') ? cont++ : null;
    })

    if (cont > 0 || $(this).attr('invalid')) {
        msgswal('Erro', 'Há campos vazios ou inválidos', 'error', 3500);
        return false;
    } else {
        $('.bt-conf-cad-rest button').attr('disabled', 'disabled');
        $('.fm-cad-rest').submit();
    }
})

$(document).on('input focus', '#txta-problema', function () {
    $(this).val().length <= 0 ? $(this).addClass('invalid').removeClass('valid') : $(this).addClass('valid').removeClass('invalid');
})

$(document).on('click', '.bt-enviar-problema', function () {
    let id = window.location.pathname;
        id = id.split("/");
        let i = id[2]
    if ($('#txta-problema').val().length <= 0 || $('#txta-problema').hasClass('invalid')) {
        $('#txta-problema').addClass('invalid');
        msgswal('Erro', 'O campo está vazio ou inválido', 'error', 3500)
    } else {
        $.ajax({
            type: 'POST',
            url: '/createReclamacoes',
            data:{codpedido:i,motivo_reclamacao:$('#txta-problema').val()},
            beforeSend: function () {
                $('.bt-enviar-problema').attr('disabled', 'disabled').html('Enviando');
                $('.bt-cancelar-prob').attr('disabled', 'disabled');
            },
            success: (data) => {
                console.log(data)
                $('#txta-problema').val('');
                $('.bt-enviar-problema').removeAttr('disabled').html('Enviar');
                $('.bt-cancelar-prob').removeAttr('disabled');
                msgswal('Sucesso', 'O seu problema foi enviado para a nossa equipe, aguarde resposta em seu email', 'success', 0);
                $('#modalProblemaPedido').modal('close');
            }
        })
        return false;
    }
})

$(document).on('click', '.dv-botoes > button', function () {
    inicioDados();
})

$(document).ready(function () {

    inicioDados();

    var socket = io('https://comeaee.herokuapp.com');
    socket.emit("entrar pedidos", $('.cod').val(), function (valido) {
    });
    socket.on('atualizar pedidos', function (message) {
        inicioDados();
        Push.create("Comeaê", {
            body: message,
            icon: '/views/img/logocompletaroxo.png',
            requireInteraction: true,
            onClick: function () {
                window.location.href = '/acompanhar';
                this.close();
            }
        });
    })
    $('#modalProblemaPedido').modal()
    $('textarea#txta-problema').characterCounter();

    $(function () {
        $.ajax({
            type: 'GET',
            url: '/buscarTotal',
            success: function (data) {
                var countryArray = data;
                var dataCountry = {};
                for (var i = 0; i < countryArray.length; i++) {
                    dataCountry[countryArray[i].nomefantasia] = countryArray[i].nomefantasia;
                    dataCountry[countryArray[i].nomefantasia] = countryArray[i].caminhofoto;
                }
                $('input.autocomplete-busca').autocomplete({
                    data: dataCountry,
                    limit: 5,
                    onAutocomplete: function () {
                        $(window).width() >= 993 ? $('.fm-busca').submit() : $('.fm-busca-mobile').submit();
                    },
                    minLength: 3
                })
            }
        })
    });
    $(document).on('click', '.detalhes-pedido', function () {
        $('.sidenav-detalhe').sidenav('open');
        let id = $(this).attr("data-id");
        detalhesPedido(id);
    })
    $('.sidenav-login').sidenav();
    $('.sidenav-detalhe').sidenav();
    AddtToCart()

    $('.busca').click(function () {
        let comida = $(this).attr('data-comida');
        AddPesquisa(comida);
    })

    /* Carrinho */
    $('.sidenav-carrinho').sidenav({
        draggable: false,
        edge: 'right',
        inDuration: 150,
        outDuration: 100
    });
    /* Perfil */
    $('.sidenav-perfil').sidenav({
        draggable: false,
        edge: 'left',
        inDuration: 150,
        outDuration: 100
    });
    /* Carrinho > Desktop */
    $('#bt-topo-carrinho').dropdown({
        closeOnClick: false,
        coverTrigger: false,
        alignment: 'right',
        onOpenStart: function () {
            $('#bt-topo-carrinho').addClass('menu-topo-ativo');
        },
        onCloseStart: function () {
            $('#bt-topo-carrinho').removeClass('menu-topo-ativo');
        }
    });
    /* Modal > Entrada */
    $('#modalEntrada').modal();
    /* Select2 > Modal > Endereco */
    $('.js-example-basic-single').select2({
        dropdownParent: "#modalEntrada",
        "language": {
            "noResults": function () {
                return "Nada encontrado!";
            }
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        dropdownAutoWidth: true
    });

    if (Cookies.get('endereco')) {
        let arrayend = Cookies.get('endereco')
        $('.selectUF').val(JSON.parse(arrayend)[0])
        $('.selectLOC').val(JSON.parse(arrayend)[2])
        $('.nomeCidade').text(JSON.parse(arrayend)[1])
        $('.endereco-cadastrado-mobile span:last, .endereco-cadastrado span:last').html(JSON.parse(arrayend)[1] + ' - ' + JSON.parse(arrayend)[0])
        $('.locatual').text(JSON.parse(arrayend)[1])
        $('.selectUF, .selectLOC').trigger('change')
        $('<i class="modal-close material-icons purple-text text-darken-2">close</i>').appendTo('#modalEntrada > div:first')
    } else {
        $('.endereco-cadastrado-mobile span:first, .endereco-cadastrado span:first').html('Sem localização')
        $('.endereco-cadastrado-mobile span:last, .endereco-cadastrado span:last').html('')
        $('.locatual').text('Não definido')
        $('#modalEntrada').modal('open')
        $('#modalEntrada').find('.nomeCidade').text('Não definido')
        $('<div><div class="center""><a class="center" href="/ent_cad">Entrar ou Cadastrar</a></div></div>').appendTo('.divlocselect');
    }

    //Verificar Login
    VerificarLogin();

    $('.side-perfil-log').sidenav()

});

$(window).scroll(function () {
    var Scroll = $(window).scrollTop() + 1,
        posicao = -1;
    if (Scroll >= posicao) {
        $('nav').css('position', 'sticky');
        $('nav').css('top', 0);
        $('nav').css('z-index', 1001);
    } else {
        $('nav').removeAttr('position');
    }
});