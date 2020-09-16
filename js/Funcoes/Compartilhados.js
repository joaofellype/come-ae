
function msgswal(title, html, icon, timer) {
    Swal.fire({
        title: title,
        html: html,
        icon: icon,
        timer: timer,
        confirmButtonColor: "#800080",
    })
}

// RECEBER DADOS NOVA CIDADE
function sweetCidade(uf, local) {
    Swal.mixin({
        input: 'text',
        confirmButtonText: 'Próximo',
        confirmButtonColor: '#800080',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#333',
        showCancelButton: true,
        customClass: {
            input: 'bt-local-feedback',
        },
        progressSteps: ['1']
    }).queue([
        {
            title: 'Qual o seu bairro?',
            html: 'Preencha o campo corretamente, o dado será fundamental para análise e inclusão do seu endereço em nosso sistema.'
        }
    ]).then((result) => {
        let resp = result.value;
        if (result.value) {
            if (resp[0] == "") {
                Swal.fire({
                    title: 'O campo está vazio',
                    text: 'Tentar novamente?',
                    icon: 'error',
                    confirmButtonColor: '#800080',
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Não',
                    cancelButtonColor: '#333',
                    showCancelButton: true
                }).then((result) => {
                    if (result.value) {
                        sweetCidade(uf, local);
                    }
                })
            } else {
                Swal.fire({
                    title: 'Confirme os dados',
                    html: '' + uf + ' &rarr; ' + local + ' &rarr; ' + resp[0] + '<br><br><b>Tudo correto</b>?',
                    icon: 'warning',
                    confirmButtonColor: '#800080',
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Não, refazer',
                    cancelButtonColor: '#333',
                    showCancelButton: true
                }).then((result) => {
                    if (result.value) {
                        $.ajax({
                            type: 'GET',
                            url: 'https://reqres.in/api/users?page=2',
                            dataType: 'json',
                            cache: false,
                            contentType: "application/json; charset=utf-8",
                            data: { uf: uf, cidade: local, bairro: resp[0] },
                            beforeSend: () => {
                                Swal.fire({
                                    title: 'Aguarde...',
                                    showConfirmButton: false
                                })
                            },
                            success: (data) => {
                                msgswal('Confirmação', 'Os dados foram recebidos, agora é com a nossa equipe', 'success', 7000);
                                $('.loaderMaster').remove();
                            }
                        })
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        sweetCidade(uf, local);
                    }
                })
            }
        }
    })
}

// VERIFICAR LOGIN
function VerificarLogin() {
    let a = "";
    $('.log-check, .log-check-mobile').empty();
    Cookies.get('tokenUsuario') ? $('<a class="col l5 item-menu waves-effect waves-light btn-perfil drop-perfil-trigger" data-target="dropdown-perfil-log"><i class="icon-perfil" ></i><span>' + Cookies.get('nomeusuario') + '</span></a >').appendTo('.log-check') && $('<i class="icon-perfil"></i><span class="legenda-tab-menu cor-primaria">Perfil</span>').appendTo('.log-check-mobile') && $('.log-check-mobile').removeClass('btn-identidade') && $('.log-check-mobile').addClass('btn-perfil-mobile') && $('.nomeUsuario').text(Cookies.get('nomeusuario')) : $('<a class="col l5 item-menu waves-effect waves-light btn-identidade"><i class="icon-logout"></i> <span>Identifique-se</span></a >').appendTo('.log-check') && $('<i class="icon-logout"></i><span class="legenda-tab-menu cor-primaria">Entrar</span>').appendTo('.log-check-mobile') && $('.log-check-mobile').addClass('btn-identidade') && $('.log-check-mobile').removeClass('btn-perfil-mobile');

    Cookies.get('infoRest') ? a = JSON.parse(Cookies.get('infoRest')) : null;
    Cookies.get('token') ? $('.dv-rest-logado').show() && $('.nome-estab-log').text(a[0]) && $('.email-esta-log').text(a[1]) : $('.dv-rest-logado').hide(100, Cookies.remove('infoRest'));
}

// ADICIONAR AO CARRINHO
function AddToCart() {
    $('.carrinho_itens, .carrinho_itens_side').empty()
    if (Cookies.get('carrinho')) {
        let carro = JSON.parse(Cookies.get('carrinho')),
            i = 0;

        if (Array.isArray(JSON.parse(Cookies.get("carrinho")))) {
            for (i == 0; i < carro.length; i++) {

                $('<div data-uuid=' + carro[i].uuid + ' data-id=' + carro[i].id + ' class="item-carrinho"><div><span>' + '(' + carro[i].quantidade + 'x) ' + carro[i].nomeProduto + '</span><span>R$ ' + carro[i].valor + '</span></div><div><span>' + carro[i].adicionais + '</span></div><div><span>' + carro[i].observacao + '</span></div><div><span data-id=' + carro[i].id + ' class="editaritem modal-trigger" href="#modalPedidos3">Editar</span><span class="removeritem">Remover</span></div></div>').appendTo('.carrinho_itens, .carrinho_itens_side')
            }
            VerificarCart();
        } else {
            $('<div data-uuid=' + carro.uuid + ' data-id=' + carro.id + ' class="item-carrinho"><div><span>' + '(' + carro.quantidade + 'x) ' + carro.nomeProduto + '</span><span>R$ ' + carro.valor + '</span></div><div><span>' + carro.adicionais + '</span></div><div><span>' + carro.observacao + '</span></div><div><span data-id=' + carro.id + ' class="editaritem modal-trigger" href="#modalPedidos3">Editar</span><span class="removeritem">Remover</span></div></div>').appendTo('.carrinho_itens, .carrinho_itens_side')
            VerificarCart();
        }
    } else {
        VerificarCart();
    }
}

// VERIFICAR CARRINHO
function VerificarCart() {
    // $('.carrinho_itens, .carrinho_itens_side').empty()
    let qnt = 0,
        nomerest;
    $('.carrinho_itens').find('.item-carrinho').each(function () {
        qnt++;
    })

    Cookies.get('carrinho') ? Array.isArray(JSON.parse(Cookies.get('carrinho'))) ? nomerest = JSON.parse(Cookies.get('carrinho'))[0].nomerestaurante : nomerest = JSON.parse(Cookies.get('carrinho')).nomerestaurante : null;

    qnt <= 0 ? $('.carrinho_itens, .carrinho_itens_side').append('<div class="grey lighten-5 center-align center circulo-vazio no-select"><i class="icon-carrinho_vazio"></i></div><span class="legenda-vazio">Seu carrinho está vazio <br>Adicione itens</span>') && $('.titulo-limpar-pedido, .titulo-pedido, .titulo-pedido-restaurante').hide() && $('.btn-finalizar-pedido').attr('disabled', 'disabled') && $('.titulo-pedido-restaurante').html('') : $('.titulo-limpar-pedido, .titulo-pedido, .titulo-pedido-restaurante').show() && $('.btn-finalizar-pedido').removeAttr('disabled') && $('.titulo-pedido-restaurante').html(nomerest)
}

function verificarEnderecoModal() {
    if (Cookies.get('tokenUsuario')) {
        $('.bt-logar > a').hide();
        $('.dv-end-save').show();
        $('#modalEntrada').addClass('over');
        $.ajax({
            url: '/listarEnderecosUsuarios',
            type: 'GET',
            cache: false,
            beforeSend: () => {
                $('.endereco-cadastrado-mobile span:last, .endereco-cadastrado span:last, .locatual').html('...')
            },
            success: (data) => {
                data.forEach(el => {
                    if (el.principal == true) {
                        $('.endereco-cadastrado-mobile span:last, .endereco-cadastrado span:last, .locatual').html(el.rua + ', Nº ' + el.nmrcasa + ' ' + el.bairro + ' - ' + el.cidade + ' - ' + el.uf);
                        $('.endereco-cadastrado-mobile span:last, .endereco-cadastrado span:last, .locatual').attr('data-id', el.id)
                        $('<i class="modal-close material-icons cor-secundaria">close</i>').appendTo('#modalEntrada > div:first');

                        $('.selectUF').val(el.uf)
                        $('.selectLOC').val(el.cidade)
                        $('.selectUF, .selectLOC').trigger('change')

                        let enderec = [];

                        enderec.push(el.cidade)
                        enderec.push(el.uf)
                        enderec.push(el.bairro)


                        Cookies.set('endereco', JSON.stringify(enderec));
                        $('.btn-vejamais-restaurantes').click();

                        setTimeout(() => {
                            $('#modalEntrada .dv-end-save').find('.dv-end').each(function () {
                                $(this).find('input').attr('id') == el.id ? $(this).find('input').prop('checked', true) && $(this).find('input').attr('checked', true) : null;
                            })
                        }, 500);
                        return;
                    } else {
                        $('.endereco-cadastrado-mobile span:last, .endereco-cadastrado span:last, .locatual').html(el.rua + ', Nº ' + el.nmrcasa + ' ' + el.bairro + ' - ' + el.cidade + ' - ' + el.uf);
                        $('.endereco-cadastrado-mobile span:last, .endereco-cadastrado span:last, .locatual').attr('data-id', el.id)
                        $('<i class="modal-close material-icons cor-secundaria">close</i>').appendTo('#modalEntrada > div:first');

                        $('.selectUF').val(el.uf)
                        $('.selectLOC').val(el.cidade)
                        $('.selectUF, .selectLOC').trigger('change')

                        let enderec = [];

                        enderec.push(el.cidade)
                        enderec.push(el.uf)
                        enderec.push(el.bairro)

                        Cookies.set('endereco', JSON.stringify(enderec));
                        $('.btn-vejamais-restaurantes').click();

                        setTimeout(() => {
                            $('#modalEntrada .dv-end-save').find('.dv-end').each(function () {
                                $(this).find('input').attr('id') == el.id ? $(this).find('input').prop('checked', true) && $(this).find('input').attr('checked', true) : null;
                            })
                        }, 500);
                    }
                })
                $('.loaderMaster').remove();
            },
            error: (data) => { 
            }
        })

        $.ajax({
            type: 'GET',
            url: '/listarEnderecosUsuarios',
            dataType: 'json',
            cache: false,
            contentType: "application/json; charset=utf-8",
            beforeSend: () => {
                $('.dv-corpo-endvisu').empty();
                $('.dv-enderecos-geral > :not(".fonte-primaria")').remove();
            },
            success: (retorno) => {
                retorno.forEach(enderecos => {

                    enderecos.complemento = enderecos.complemento == "" ? 'Sem complemento' : enderecos.complemento;
                    comp = enderecos.complemento == "Sem complemento" ? "" : enderecos.complemento;

                    let registro = `<div class="dv-end"><p><label><input id="${enderecos.id}" name="checkend" class="with-gap" type="radio" /><span></span></label></p><label for="${enderecos.id}"><span class="forte cor-primaria">${enderecos.rua} ${comp} ${enderecos.nmrcasa}</span><br><span>CEP: 65067645 - ${enderecos.bairro} - ${enderecos.cidade}/${enderecos.uf}</span></label></div>`;
                    let registroedit = `<div class="dv-end"><p><label><input id="${enderecos.id}" name="checkend-edit" class="with-gap checkend-edit modal-trigger" href="#editarEndereco" type="radio" /><span></span></label></p><label><span class="forte cor-primaria">${enderecos.rua} ${comp} ${enderecos.nmrcasa}</span><br><span>CEP: 65067645 - ${enderecos.bairro} - ${enderecos.cidade}/${enderecos.uf}</span></label></div>`;
                    $('.dv-enderecos-geral').append(registro);
                    $('.dv-corpo-endvisu').append(registroedit);
                });
                $('.loaderMaster').remove();
            }
        })

    } else if (Cookies.get('endereco') && JSON.parse(Cookies.get('endereco'))[0] != null) {
        let arrayend = Cookies.get('endereco')
        $('.selectUF').val(JSON.parse(arrayend)[1])
        $('.selectLOC').val(JSON.parse(arrayend)[0])
        $('.endereco-cadastrado-mobile span:last, .endereco-cadastrado span:last, .locatual').html(JSON.parse(arrayend)[2] + ' - ' + JSON.parse(arrayend)[0] + ' - ' + JSON.parse(arrayend)[1])
        $('.selectUF, .selectLOC').trigger('change')
        $('<i class="modal-close material-icons cor-secundaria">close</i>').appendTo('#modalEntrada > div:first')
        $('.btn-vejamais-restaurantes').click();
        $('.dv-end-save').hide();
        $('#modalEntrada').removeClass('over');
        $('.bt-logar > a').show();
    } else {
        Cookies.remove('endereco');
        $('.dv-end-save').hide();
        $('.endereco-cadastrado-mobile span:first, .endereco-cadastrado span:first').html('Sem localização')
        $('.endereco-cadastrado-mobile span:last, .endereco-cadastrado span:last').html('')
        $('.locatual').text('Não definido')
        $('#modalEntrada').modal('open')
        $('#modalEntrada').find('.nomeCidade').text('Não definido');
        $('#modalEntrada').removeClass('over');
        $('.bt-logar > a').show();
    }
}

function buscarBairros(uf, cidade, bairro) {
    $('.selectBAIRRO > *:not(:first)').remove();

    $.ajax({
        url: '/listarBairros/' + decodeURIComponent(cidade),
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        beforeSend: () => {
            $('.selectUF').removeAttr('disabled').val(uf).trigger('change.select2');
            $('.selectLOC').removeAttr('disabled').val(cidade).trigger('change.select2');
            $('.btnconfirmLOC').attr('disabled', 'disabled').html('Buscando...');
        },
        success: (data) => {

            for (let i = 0; i < data.length; i++) {
                var option = new Option((data[i].bairro), (data[i].bairro), true, true);
                $('.selectBAIRRO').append(option).trigger('change');
            }

            $('.selectBAIRRO option').each(function () {
                if (bairro == "") {
                    msgswal('Bairro não encontrado pelo CEP', 'Por favor, tente por meio do botão abaixo <b>Não sei meu CEP</b> e busque manualmente', 'error', 0);
                    $('.btnconfirmLOC').html('Confirmar');
                    return false;
                } else {
                    $('.btnconfirmLOC').html('Confirmar');
                    $('.selectBAIRRO').removeAttr('disabled').val(bairro).trigger('change.select2');
                    return false;
                }
            })

            $('.selectBAIRRO').select2({
                dropdownParent: "#modalEntrada",
                "language": {
                    "noResults": function () {
                        return "Nada encontrado!";
                    }
                },
                escapeMarkup: function (markup) {
                    return markup;
                },
                dropdownAutoWidth: true,
                matcher: function (params, data) {
                    if (!params.term) return data;
                    else {
                        var text = data.text.toLowerCase(),
                            term = params.term.toLowerCase();
                        if (text.replace(/\b\s+\b/g, " ").indexOf(term) > -1) return data;
                        if (text.replace(/\s/g, " ").indexOf(term) > -1) return data;
                        return null;
                    }
                }

            });
            $('.loaderMaster').remove();
        }
    })
}



// BOTAO ABRIR LOGIN SIDENAV
$(document).on('click', '.btn-identidade', function () {
    $('.sidenav-login').sidenav('open');
    $('.dv-verificar-code,.dv-cad-email,.dv-cadastrar,.dv-cad-rest').hide(600);
    $('.dv-logar').show(800);
})

// apenas numeros > verificação codigo email
$(document).on('keyup input', '.fm-verificar-code > div > div > input', function (e) {
    if (/\D/g.test(this.value)) {
        this.value = this.value.replace(/\D/g, '');
    }
});

// BOTÃO LOGAR
$(document).on('click', '.bt-logar', function () {
    $('.dv-cad-email, .dv-cad-rest').hide(400);
    $('.dv-logar').show(400);
})

// SWAL BOTAO (CADASTRAR) CLIENTE/RESTAURANTE
$(document).on('click', '.sw-bt-cad-cli, .sw-bt-cad-rest', function () {
    swal.close()
    $('.dv-logar').hide(400);
    $(this).text() == "Cliente" ? $('.dv-cad-email').show(400) : $('.dv-cad-rest').show(400);
})

// BOTAO (CADASTRAR) COMO (CLIENTE/REST)
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

// BOTAO (ENTRAR) COMO (CLIENTE/REST)
$(document).on('click', '.bt-entrar > button', function () {
    let cont = 0;
    $('.fm-logar').find('input').each(function () {
        $(this).val() == '' && $(this).attr('required') || $(this).hasClass('invalid') ? $(this).addClass('invalid') && cont++ : null;
    })
    if (cont <= 0) {
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
                if (data.login == 'Usuario') {
                    Cookies.set('tokenUsuario', data.token);
                    Cookies.set('nomeusuario', data.nomeusuario);

                    Cookies.remove('token');
                    $('.bt-entrar > button').text('Sucesso');
                    window.location.reload()
                } else {
                    Cookies.set('token', data.token);
                    Cookies.set('permissao',data.permissao);
                    Cookies.remove('tokenUsuario');
                    $('.bt-entrar > button').text('Sucesso');
                    window.location.href = '/admin_start';

                }
                $('.loaderMaster').remove();
            },
            error: (error) => {
                $('.bt-entrar > button').text('Entrar').removeAttr('disabled');
                msgswal('Erro!', error.responseJSON.message, 'error', 4000, $('.bt-entrar > button').text('Entrar').removeAttr('disabled'))
                return false;
                $('.loaderMaster').remove();
            }
        })
        return false;
    } else {
        msgswal('Erro!', 'Há campos inválidos ou vazios', 'error', 3500)
        return false;
    }
})



// BOTAO VERIFICAR EMAIL
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
                $('.loaderMaster').remove();
            },
            error: function (data) {
                msgswal('Erro!', data.responseJSON.data, 'error')
                $('.bt-aut-cadastro > button').text('Enviar').removeAttr('disabled')
                return false;
                $('.loaderMaster').remove();
            }
        })
    }
});

// VALIDAR EMAIL
$(document).on('keyup input focus', '#senhalog', function () {
    $(this).val().length < 6 ? $(this).addClass('invalid').removeClass('valid') : $(this).addClass('valid').removeClass('invalid');
})
$(document).on('keyup input focus', 'input[type=email]', function () {
    validateEmail($(this).val()) ? $(this).addClass('valid').removeClass('invalid') : $(this).addClass('invalid').removeClass('valid');
})

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// MANIPULADOR CAMPOS -> CODIGO VERIFICAÇÃO
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

// BOTAO ENVIAR CODIGO P/ EMAIL
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
                $('.loaderMaster').remove();
            },
            error: () => {
                msgswal('Erro!', 'Ocorreu um erro, por favor, verifique o seu código e tente novamente', 'error', 5000, $('.bt-enviar-code > button').removeAttr('disabled').text('Enviar'));
                $('.loaderMaster').remove();
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
// ------------------

// VERIFICAR SENHAS
$(document).on('input focus', '#senhacad, #confsenhacad', function () {
    let sc = $('#senhacad').val(),
        cfsc = $('#confsenhacad').val();
    sc.length >= 6 && cfsc.length >= 6 && sc == cfsc ? $('#senhacad,#confsenhacad').addClass('valid').removeClass('invalid') : $('#senhacad,#confsenhacad').addClass('invalid').removeClass('valid');
})

// ENVIAR FORMULÁRIO (CADASTRO CLIENTE)
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
                }, 4000));
                $('.loaderMaster').remove();
            },
            error: function () {
                $('.bt-conf-cadastrar > button').html('Cadastrar').removeAttr('disabled')
                msgswal('Erro!', 'Ocorreu um erro, tente novamente', 'error', 3000)
                return false;
                $('.loaderMaster').remove();
            }
        })
    } else {
        msgswal('Erro', 'Há campos inválidos', 'error', 3000)
        return false;
    }
})

$(document).on('click', '.bt-recuperar', function () {
    $('.sidenav-recuperar').sidenav('open');
})

// RECUPERAR EMAIL
$(document).on('click', '.bt-recu > button', function () {
    if ($('#emailrecu').val() == "" || $('#emailrecu').hasClass('invalid')) {
        msgswal('Erro', 'Email inválido ou vázio', 'error', 3500);
        return false;
    } else {
        $.ajax({
            type: 'POST',
            url: '/redefinirSenhaCliente',
            beforeSend: function () {
                $('.bt-recu > button').attr('disabled', 'disabled').html('Enviando...')
            },
            data: {
                'email': $('#emailrecu').val()
            },
            cache: false,
            success: function (response) {
                msgswal('Sucesso!', response.message, 'success', 0);
                $('.bt-recu > button').removeAttr('disabled').html('Enviar');
                $('.loaderMaster').remove();
            },
            error: function (data) {
                msgswal('Erro!', data.responseJSON.message, 'error', 3000);
                $('.bt-recu > button').removeAttr('disabled').html('Enviar');
                $('.loaderMaster').remove();
            }
        })
    }
    return false;
});

// BOTAO MOSTRAR DIV EDITAR EMAIL
$(document).on('click', '.bt-editaremail', function () {
    $('.dv-verificar-code input').each(function () {
        $(this).val('')
    });
    $('.dv-verificar-code').hide(400)
    $('.dv-cad-email').show(400, function () {
        $('#emailautcad').focus()
    })
})

// LISTAR FAVORITOS
function ListarFavoritos() {
    $('.ul-favoritos').empty();
    $.ajax({
        type: 'GET',
        url: '/listarFavoritos',
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            var itens = `<div class="lazy-favoritos">
                            <li class="ph-item collection-item avatar">
                                <div class="ph-col-4-mod">
                                    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
                                </div>
                                <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                        <div class="ph-col-10"></div>
                                        <div class="ph-col-8"></div>
                                        <div class="ph-col-5"></div>
                                        </div>
                                </div>
                            </li>
                            <li class="ph-item collection-item avatar">
                                <div class="ph-col-4-mod">
                                    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
                                </div>
                                <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                        <div class="ph-col-10"></div>
                                        <div class="ph-col-8"></div>
                                        <div class="ph-col-5"></div>
                                        </div>
                                </div>
                            </li>
                            <li class="ph-item collection-item avatar">
                                <div class="ph-col-4-mod">
                                    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
                                </div>
                                <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                        <div class="ph-col-10"></div>
                                        <div class="ph-col-8"></div>
                                        <div class="ph-col-5"></div>
                                        </div>
                                </div>
                            </li>
                        </div>`;
            $('.ul-favoritos').append(itens);
        },
        success: (retorno) => {
            $('.lazy-favoritos').remove();
            retorno.favoritos.forEach(info => {
                let caminho = "/lista-restaurante/" + info.restaurante.id.toString();
                let registro = `<li class="collection-item avatar item-favorito">
                                    <img src='/views/img/base.png' data-src='${info.restaurante.caminhofoto}' class="circle imagem-favorito b-lazy">
                                    <div class="dv-geral-favorito" data-id="${info.id}" onclick="window.location.href='${caminho}'">
                                        <div class="dv-titulo-fav">
                                            <span class="title nome-favorito">${info.restaurante.nomefantasia}</span>
                                        </div>
                                    
                                        <div class="dv-categoria-fav">
                                            <span data-id="${info.restaurante.codcategoria}" class="title categoria-favorito"></span>
                                        </div>
                                    </div>
                                    <a class="secondary-content  bt-favorito-modal" data-id="${info.id}">
                                        <i class="material-icons">favorite</i>
                                    </a>
                            </li>`;
                $('.ul-favoritos').append(registro);
            });
            retorno.categorias.forEach(cat => {
                $('.categoria-favorito').each(function () {
                    $(this).attr('data-id') == cat.id ? $(this).text(cat.categoriarestaurante) : null;
                })
            })


            retorno.favoritos.length <= 0 ? $('.ul-favoritos').append('<div><div class="vazio-favoritos kit-flex"><span>Você não tem favoritos</span></div><div class="kit-flex"><img class="coracao-quebrado" src="/views/img/no-favorites.png"></div></div>') : null;

            let bLazy = new Blazy();
            $('.loaderMaster').remove();
        },
        error: () => {
            msgswal('Erro', 'Ocorreu um erro ao listar', 'error', 4000);
            $('.loaderMaster').remove();
        }
    })
}

// CONTROLADOR SELECT2 UF > MODAL > ENDEREÇO
$(document).on('change', '.selectUF', function () {
    $('.selectUF option:selected').val() == "" ? $('.selectLOC, .selectBAIRRO').attr('disabled', 'disabled').val('').trigger('change.select2') && $('.btnconfirmLOC').attr('disabled', 'disabled') : $('.selectLOC').removeAttr('disabled');
})
// CONTROLADOR SELECT2 LOC > MODAL > ENDEREÇO
$(document).on('change', '.selectLOC', function () {
    $('.selectLOC option:selected').val() == "" ? $('.selectBAIRRO').attr('disabled', 'disabled').val('').trigger('change.select2') && $('.btnconfirmLOC').attr('disabled', 'disabled').html('Confirmar') : $('.selectBAIRRO').removeAttr('disabled') && buscarBairros($('.selectUF').val(), $(this).val());

})
// CONTROLADOR SELECT2 BAIRRO > MODAL > ENDEREÇO
$(document).on('change', '.selectBAIRRO', function () {
    $('.selectBAIRRO option:selected').val() == "" ? $('.btnconfirmLOC').attr('disabled', 'disabled') : $('.btnconfirmLOC').removeAttr('disabled');
})

// CLIQUE BOTÃO CONFIRMAR MODAL > ENDERECO
$(document).on('click', '.btnconfirmLOC', function () {
    let dadosloc = [],
        arrayend;
    dadosloc.push($('.selectLOC option:selected').html());

    dadosloc.push($('.selectUF').val());
    dadosloc.push($('.selectBAIRRO').val());
    Cookies.set('endereco', JSON.stringify(dadosloc));
    arrayend = JSON.parse(Cookies.get('endereco'));
    $('.endereco-cadastrado-mobile span:first, .endereco-cadastrado span:first').html('Entregar em: ')
    $('.endereco-cadastrado-mobile span:last, .endereco-cadastrado span:last,.locatual').html(arrayend[2] + ' - ' + ' - ' + arrayend[0] + arrayend[1])
    location.reload();
    $('#modalEntrada').modal('close')
})

$(".js-example-basic-single").select2().on("select2:open", function (e) {
    $(this).parent().parent().parent().find('input').addClass('browser-default')
});

// CALCULA OS VALORES DA SACOLA > SUBTOTAL | ENTREGA | TOTAL 
$(document).on('click', '#bt-topo-carrinho, #bt-tab-carrinho, .removeritem, .btnconfirmarped', function () {
    calcular();
})

function calcular() {
    setTimeout(() => {
        let i = 0,
            valores = [];

        $('.carrinho_itens_side').find('.item-carrinho').each(function () {
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
}

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

// BOTAO PERFIL MOBILE
$(document).on('click', '.btn-perfil-mobile', function () {
    $('.side-perfil-log').sidenav('open')
})

// BOTÃO SAIR DA SESSAO (CLIENTE)
$(document).on('click', '.dv-sair-app, .bt-sair-app', function () {
    Cookies.remove('tokenUsuario');
    $('.drop-perfil-trigger').dropdown('close');
    $('.side-perfil-log').sidenav('close');
    VerificarLogin();
    location.reload();
})

// BOTAO SAIR DA SESSAO (RESTAURANTE)
$(document).on('click', '.bt-sessao-sair', function () {
    $('.sidenav-login').sidenav('close');
    Cookies.remove('token');
    VerificarLogin();
})

// BOTÃO CONFIRMAR CADASTRO RESTAURANTE
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

// REMOVER FAVORITO PELO MODAL
$(document).on('click', '.bt-favorito-modal', function () {
    let nome = $(this).prev().find('.nome-favorito').text();
    let id = $(this).attr('data-id');
    Swal.fire({
        title: 'Remover favorito',
        html: 'Deseja realmente desfavoritar<br><b class="purple-text">' + nome + '</b> ?',
        icon: 'warning',
        confirmButtonColor: '#800080',
        cancelButtonColor: '#333',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        showCancelButton: true
    }).then((result) => {
        if (result.value) {

            $.ajax({
                type: 'PUT',
                url: '/deletarFavoritos/' + id,
                cache: false,
                beforeSend: () => {
                    $('.ul-favoritos').empty();
                    $('.ul-favoritos').append('<div class="modal-fav-aguarde kit-flex"><span>Aguarde...</span></div>');
                },
                success: () => {
                    ListarFavoritos();
                    $('.loaderMaster').remove();
                }
            })
        }
    })
})

// FINALIZAR PEDIDO CARRINHO
$(document).on('click', '.btn-finalizar-pedido', function () {
    if (!Cookies.get('tokenUsuario')) {
        msgswal('Login necessário', 'Você precisar <u class="purple-text text-darken-2 bt-entrar-sw" style="cursor:pointer">Entrar</u> ou <u class="purple-text text-darken-2 bt-cadastrar-sw" style="cursor:pointer">Cadastrar</u> para adicionar', 'error', 0)
        return false;
    } else {
        window.location.href = '/finalizarPedido'
    }
})

$(document).on('click', '.bt-entrar-sw', function () {
    Swal.close();
    $('#modalPedidos3').modal('close');
    $('.sidenav-login').sidenav('open');
    setTimeout(() => {
        $('#emaillog').focus()
    }, 400);
})

$(document).on('click', '.bt-cadastrar-sw', function () {
    Swal.close();
    $('#modalPedidos3').modal('close');
    $('.sidenav-login').sidenav('open');
    setTimeout(() => {
        $('.bt-cadastrar').click()
    }, 400);
})

$(document).on('click', '.dv-favoritos, .bt-fav-perf-log', function () {
    $('.modalFavoritos').modal('open');
})

// REMOVE OS ITENS DOS CARRINHOS
$(document).on('click', '.removeritem', function () {
    let uuid = $(this).parents('.item-carrinho').attr('data-uuid'),
        itens = [],
        itenscookie = JSON.parse(Cookies.get('carrinho')),
        i = 0;

    for (i == 0; i < itenscookie.length; i++) {
        parseFloat(uuid) != itenscookie[i].uuid ? itens.push(itenscookie[i]) : null;
    }
    itens.length <= 0 ? Cookies.remove('carrinho') : Cookies.set('carrinho', JSON.stringify(itens))
    let qnt = 0;
    let id = $(this).parents('.item-carrinho').attr('data-uuid');
    let vazio = '<div class="grey lighten-5 center-align center circulo-vazio no-select"><i class="icon-carrinho_vazio"></i></div><span class="legenda-vazio">Seu carrinho está vazio <br>Adicione itens</span>'

    $(this).parents('.item-carrinho').hide(200);
    setTimeout(() => {
        $('.carrinho_itens, .carrinho_itens_side').find('.item-carrinho').each(function () {
            $(this).attr('data-uuid') == id ? $(this).remove() : null;
        })
        $('.carrinho_itens, .carrinho_itens').find('.item-carrinho').each(function () {
            qnt++;
        })
        qnt <= 0 ? $('.carrinho_itens, .carrinho_itens_side').empty() && $('.carrinho_itens, .carrinho_itens_side').append(vazio) && $('.titulo-limpar-pedido, .titulo-pedido-restaurante, .titulo-pedido').hide() && $('.btn-finalizar-pedido').attr('disabled', 'disabled') : $('.titulo-limpar-pedido, .titulo-pedido-restaurante, .titulo-pedido').show()
    }, 300);

})

// LIMPA OS CARRINHOS
$(document).on('click', '.titulo-limpar-pedido', function () {
    Swal.fire({
        title: 'Limpar carrinho',
        text: 'Deseja realmente fazer isso? A ação não poderá ser desfeita.',
        icon: 'warning',
        confirmButtonColor: "#800080",
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        cancelButtonColor: "#333"
    }).then((result) => {
        if (result.value) {
            let carrinho = $(this).parents('ul').find('[class^=carrinho_itens]');
            $(carrinho).find('.item-carrinho').find('.removeritem').each(function () {
                $(this).click()
            })
            $('.titulo-pedido, .titulo-limpar-pedido').hide()
            $('.titulo-pedido-restaurante').html('')
            $('.btn-finalizar-pedido').attr('disabled', 'disabled')
        }
    })
})

$(document).on('click', '.pedidos-mobile', function () {
    Cookies.get('tokenUsuario') ? window.location.href = '/pedidos' : msgswal('Login necessário', 'Você precisar <u class="purple-text text-darken-2 bt-entrar-sw">Entrar</u> ou <u class="purple-text text-darken-2 bt-cadastrar-sw">Cadastrar</u> para acessar pedidos', 'error', 0);
})

$(document).on('click', 'input[name="checkend"]', function () {

    $.ajax({
        type: 'PUT',
        url: '/atualizarEnderecoPrincipal/' + $(this).attr('id'),
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('#modalEntrada').find('input[type="radio"]').each(function () {
                $(this).attr('disabled', 'disabled')
            })
        },
        success: (data) => {
            let local = [];
            local.push(data.endereco.uf)
            local.push(data.endereco.cidade)
            local.push(data.endereco.bairro);
            Cookies.get("endereco", JSON.stringify(local))
            location.reload();
            $('.loaderMaster').remove();
        }
    })
})

$(document).on('click', '.sem-cep', function () {
    $('.dv-cep-loc').hide(300);
    $('.divlocselect').show(300);
    $('.selectUF').val('').trigger('change.select2')
    $('.selectLOC, .selectBAIRRO').attr('disabled', 'disabled').val('').trigger('change.select2');
    $('.btnconfirmLOC').attr('disabled', 'disabled');
    $(this).addClass('com-cep').removeClass('sem-cep').text('Informar CEP');
    $('#cep-mdl-loc').val('');
})
$(document).on('click', '.com-cep', function () {
    $('.dv-cep-loc').show(300);
    $('.divlocselect').hide(300);
    $('.selectUF').val('').trigger('change.select2')
    $('.selectLOC, .selectBAIRRO').attr('disabled', 'disabled').val('').trigger('change.select2');
    $('.btnconfirmLOC').attr('disabled', 'disabled');
    $(this).addClass('sem-cep').removeClass('com-cep').text('Não sei meu CEP');
    $('#cep-mdl-loc').val('');
})

$(document).on('click', '.checkend-edit', function () {
    let id = $(this).attr('id');
    $.ajax({
        url: '/listarEnderecos/' + id,
        cache: false,
        beforeSend: () => {
            $('.loaderModalEditEnd').show();
        },
        success: (data) => {
            $('#cep').val(data[0].cep)
            $('#rua').val(data[0].rua)
            $('#numero').val(data[0].nmrcasa)
            $('#quadra').val(data[0].quadra)
            $('#bairro').val(data[0].bairro)
            $('#cidade').val(data[0].cidade)
            $('#complemento').val(data[0].complemento);
            $('#UF-Endereco').val(data[0].uf);
            $('#UF-Endereco').formSelect()
            $('.bt-confirm-edit').attr('data-id', data[0].id);
            $('.loaderModalEditEnd').hide();
            data[0].principal == true ? $('.switch-principal input').prop('checked', true) : null;
            $('.loaderMaster').remove();
        }
    })
})

// ATUALIZAR ENDEREÇO

$(document).on('click', '.bt-confirm-edit', function () {

    let cont = 0;
    $('#editarEndereco input').not('.princiapal, #complemento, .numlocal').each(function () {
        $(this).val() == "" ? cont++ : null;
    })

    if (cont > 0) {
        msgswal('Erro', 'Há campos vazios ou inválidos', 'error');
        return false;
    } else {
        let id = $(this).attr('data-id'),
            url_atual = window.location.pathname;
        $.ajax({
            type: 'PUT',
            url: '/updateEndereco/' + id,
            cache: false,
            beforeSend: () => {
                $('.bt-confirm-edit').attr('disabled', 'disabled').html('Enviando')
                $('.bt-confirm-edit').prev().attr('disabled', 'disabled');
            },
            data: {
                cep: $('.cep1').val(),
                rua: $('.rua1').val(),
                nmrcasa: $('#numero').val(),
                quadra: $('#quadra').val(),
                bairro: $('#bairro').val(),
                cidade: $('#cidade').val(),
                uf: $('select#UF-Endereco').val(),
                complemento: $('#complemento').val(),
                principal: $('.switch-principal input').is(':checked')
            },
            success: (data) => {
                Cookies.set("tokenUsuario", data.refreshToken)
                $('.bt-confirm-edit').removeAttr('disabled').html('Confirmar');
                $('.bt-confirm-edit').prev().removeAttr('disabled');
                msgswal('Sucesso', 'Endereço atualizado', 'success');
                $('#editarEndereco').modal('close');
                $('#modalEnderecosEdit,#modalEntrada').modal('open');
                verificarEnderecoModal();
                url_atual == "/dados" ? listarEnderecos() : null;
                url_atual == "/finalizarPedido" ? location.reload() : null;
                $('.loaderMaster').remove();
            }
        })
    }
})

$(window).on('scroll load ready', function () {
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

window.addEventListener('load', 
  function() { 
      $('.loaderMaster').remove();
}, false);

$(document).ready(function () {

    // loader
    $('body').prepend('<div class="loaderMaster kit-flex"><div class="preloader-wrapper active"><div class="spinner-layer"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>')

    calcular();

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
                $('.loaderMaster').remove();
            }
        })
    });

    AddToCart();

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
    $('#modalEntrada').modal({
        dismissible: false,
        onCloseEnd: () => {
            $('.btnconfirmLOC').attr('disabled', 'disabled').html('Confirmar');
        },
        onOpenStart:()=>{
            $('.btnconfirmLOC').attr('disabled', 'disabled').html('Confirmar');
        }
    });

    // MODAL VISUAL ENDEREÇOS
    $('#modalEnderecosEdit').modal({
        dismissible: false
    });

    // MODAL > ENDERECOS INPUTS
    $('#editarEndereco').modal({
        onOpenStart: function () {
            $('.rodape-mobile').css('z-index', '99')
            $('#modalEnderecosEdit').modal('close');
            $('#modalEntrada').modal('close');
        },
        onCloseStart: function () {
            $('.rodape-mobile').css('z-index', '9999')
            $('#editarEndereco').attr('data-idcard', '')
            $('#editarEndereco').find('input').each(function () {
                $(this).val('').removeClass('valid').removeClass('invalid')
            })
            $('#UF-Endereco').val("");
            $('#UF-Endereco').formSelect();
            $('.check-principal').prop('checked', false);
            $('.switch-principal input').prop('checked', false);
        },
    });

    /* Select2 > Modal > Endereco */
    $('.selectUF').select2({
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

    $('.selectLOC').select2({
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

    verificarEnderecoModal();
    VerificarLogin();

    if (Cookies.get('tokenUsuario')) {
        $('.drop-perfil-trigger').dropdown({
            coverTrigger: false,
            onOpenStart: () => {
                $('.drop-perfil-trigger').addClass('active');
            },
            onCloseStart: () => {
                $('.drop-perfil-trigger').removeClass('active');
            }
        })
    }

    $('.sidenav-login').sidenav();
    $('.side-perfil-log').sidenav();
    $('.sidenav-recuperar').sidenav({
        edge: 'right',
        outDuration: 350
    });

    // MODAL FAVORITOS
    $('.modalFavoritos').modal({
        onOpenStart: () => {
            ListarFavoritos();
            $('.side-perfil-log').sidenav('close')
        },
        onCloseStart: () => {
            $('.ul-favoritos').empty()
        }
    });

    $('#cep-mdl-loc, [id*="cep"], .cep-end-fin').mask('00000-000');

});

// VIACEP - VERIFICAR CEP (MODAL STICKY)
function limpa_formulário_cep() {
    $('.btnconfirmLOC').attr('disabled','disabled');
    $('.divlocselect').hide(200);
    $('.selectUF').val('').trigger('change.select2');
    $('.selectLOC, .selectBAIRRO').attr('disabled', 'disabled').val('').trigger('change.select2');
}

function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
        let cont = 0;
        $('.selectLOC option').each(function () {
            if (conteudo.localidade == $(this).val()) {
                cont++;
                return false;
            }
        })

        if (cont > 0) {
            buscarBairros(conteudo.uf, conteudo.localidade, conteudo.bairro)
            $('.divlocselect').show(200);
        } else {
            Swal.fire({
                title: 'Informação',
                text: 'Sua cidade é válida, mas ainda não encontra-se em nosso sistema, desejar solicitar?',
                icon: 'info',
                confirmButtonColor: "#800080",
                confirmButtonText: "Sim",
                cancelButtonColor: "#333",
                cancelButtonText: "Não",
                showCancelButton: true
            }).then((result) => {
                if (result.value) {
                    sweetCidade(conteudo.uf, conteudo.localidade);
                }
            })
        }
    } else {
        limpa_formulário_cep();
        Swal.fire({
            title: 'Erro!',
            text: 'CEP não encontrado',
            timer: 3500,
            confirmButtonColor: '#800080',
            icon: 'error'
        }).then((result) => {
            $('.selectUF').removeAttr('disabled').val('').trigger('change.select2')
            $('.selectLOC,.selectBAIRRO').attr('disabled', 'disabled').val('').trigger('change.select2')
            $('.btnconfirmLOC').attr('disabled', 'disabled');
            $('.divlocselect').hide(200);
        })
    }
}

function pesquisacep(valor) {

    var cep = valor.replace(/\D/g, '');

    if (cep != "") {
        var validacep = /^[0-9]{8}$/;

        if (validacep.test(cep)) {
            var script = document.createElement('script');
            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';
            document.body.appendChild(script);
        } else {
            limpa_formulário_cep();
            Swal.fire({
                title: 'Erro!',
                text: 'Formato de CEP inválido',
                timer: 3500,
                confirmButtonColor: '#800080',
                icon: 'error'
            })
            $('.btnconfirmLOC').attr('disabled', 'disabled');
            $('.divlocselect').hide(200);
        }
    } else {
        limpa_formulário_cep();
    }
};

//---------------------------------------------------

// VIACEP - VERIFICAR CEP (MODAL EDITAR ENDEREÇO)
function limpa_formulário_cep2() {
    $("#rua").val("");
    $("#bairro").val("");
    $("#cidade").val("");
    $('#UF-Endereco').val("");
    $('#UF-Endereco').formSelect();
}
$("#cep").blur(function () {
    var cep = $(this).val().replace(/\D/g, '');
    if (cep != "") {
        var validacep = /^[0-9]{8}$/;
        if (validacep.test(cep)) {
            $("#rua").val("...");
            $("#bairro").val("...");
            $("#cidade").val("...");

            $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
                if (!("erro" in dados)) {
                    $("#rua").val(dados.logradouro);
                    $("#bairro").val(dados.bairro);
                    $("#cidade").val(dados.localidade);
                    $('#UF-Endereco').val(dados.uf);
                    $('#UF-Endereco').formSelect();
                } else {
                    limpa_formulário_cep2();
                    msgswal('Erro', 'CEP não encontrado', 'error')
                }
            });
        } else {
            limpa_formulário_cep2();
            msgswal('Erro', 'Formato de CEP inválido', 'error')
        }
    } else {
        limpa_formulário_cep2();
    }
});