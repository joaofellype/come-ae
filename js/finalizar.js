function msgswal(title, text, icon, timer) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: timer,
        confirmButtonColor: "#800080"
    })
}

$(".uf").keypress(function (e) {
    if (e.which < 97 /* a */ || e.which > 122 /* z */) {
        e.preventDefault();
    }
});

$(document).on('click', '.divsolopay, .divcashpay', function () {

    $('#test1').find('.divcashpay, .divsolopay').each(function () {
        $(this).attr('checado', 'false').css('background-color', 'purple')
    })

    if ($(this).attr('checado') == 'false') {
        $(this).attr('checado', 'true').css('background-color', '#47af47')
        $('.btnendereco1').removeAttr('disabled')
    }
})

$(document).on('click', '.tab', function () {
    $('#test1').find('.divcashpay, .divsolopay').each(function () {
        $(this).attr('checado', 'false').css('background-color', 'purple')
        $('.btnendereco1').attr('disabled', 'disabled')
        $('.valordotroco').remove()
    })
})

$(document).on('click', '.divsolopay', function () {
    $('.divdinheiropay').find('.valordotroco').each(function () {
        $(this).remove()
    })
})

$(document).on('click', '.btnconfirmartroco', function () {
    $('#modalValorTroco').modal('open')
})

$(document).on('click', '.btnconfirmarvalortroco', function () {
    let valpedido = parseFloat($('.valorpedidomodal').text().replace('R$ ', '').replace(',', '.')).toFixed(2), valtroco = $('.inputvalortroco').val();

    let troco = parseFloat(valtroco.replace(',', '.'))
    let pedido = parseFloat(valpedido)

    if (troco <= pedido || valtroco == "") {
        msgswal('Erro!', 'Defina um valor maior que o valor do seu pedido', 'error', 5000)
    } else {
        let i = 0, troco = valtroco.replace('.', ',');

        $('.divdinheiropay').find('.valordotroco').each(function () {
            i++;
            $(this).text('Troco para R$ ' + troco)
            $('.inputvalortroco').val('')
            $('#modalValorTroco').modal('close')
        })
        if (i <= 0) {
            $('<p class="valordotroco">Troco para R$ ' + troco + '</p>').appendTo('.divdinheiropay')
            $('.inputvalortroco').val('')
            $('#modalValorTroco').modal('close')
        }

        $('input[name=trocoValor]').val(troco)

    }
})

$(document).on('blur', '.creditcardnum, .mmaa, .cvc, .nometitular, .cpfcnpjtitular', function () {
    if ($('.creditcardnum').hasClass('valid') && $('.mmaa').hasClass('valid') && $('.cvc').hasClass('valid') && $('.nometitular').hasClass('valid') && $('.cpfcnpjtitular').hasClass('valid')) {
        $('.btnendereco2').removeAttr('disabled')
    } else {
        $('.btnendereco2').attr('disabled', 'disabled')
    }
})

$(document).on('click', '.removerproduto', function () {
    let i = 0;
    let valores = []
    let soma = 0;
    let item = $(this).parents('.produtoitem')

    let uuid = $(this).parents('.produtoitem').attr('data-uuid'),
        itens = [],
        itenscookie = JSON.parse(Cookies.get('carrinho')),
        ii = 0;

    for (ii == 0; ii < itenscookie.length; ii++) {
        parseFloat(uuid) != itenscookie[ii].uuid ? itens.push(itenscookie[ii]) : null;
    }

    item.hide(300, function () {
        item.remove();

        $('.card').find('.card-content').find('.produtoitem').each(function () {
            i++;
            valores.push($(this).find('.valorpedido').text().substr(3).replace(',', '.'))
        })

        for (ii = 0; ii < valores.length; ii++) {
            soma += parseFloat(valores[ii])
        }

        let entrega = parseFloat($('.valortaxaentrega').text().substr(3).replace(',', '.'))

        if (i > 0) {
            $('.valorsubtotal').text('R$ ' + (soma.toFixed(2)).replace('.', ','))
            $('.valortotal, .valorpedidomodal').text('R$ ' + (soma + entrega).toFixed(2).replace('.', ','))
        } else {
            $('.valorsubtotal').text('R$ 0,00')
            $('.valortaxaentrega').text('R$ 0,00')
            $('.valortotal,.valorpedidomodal').text('R$ 0,00')
            Swal.fire({
                title: 'Todos os itens foram removidos!',
                text: 'A sua sacola está vazia, você será redirecionado em 7 segundos',
                icon: 'warning',
                confirmButtonColor: '#800080',
                timer: 7000
            }).then((result) => {
                window.location.href = "/comeae"
            })
        }
        itens.length <= 0 ? Cookies.remove('carrinho') : Cookies.set('carrinho', JSON.stringify(itens))
    });
})

$(document).on('change click', '.select2-selection__rendered, .select2-selection__arrow', function () {
    $('.select2-search__field').addClass('browser-default').css('outline', 'none')
    $('.select2-search').css('border-top', '1px solid grey').css('margin-top', '-1px')
})

$(document).on('click', '.btnendereco1, btnendereco2', function () {
    if ($('#modalEndereco').hasClass('open')) {
        $('.select2-selection__rendered').parent().css('height', '40px').css('padding-top', '6px').css('outline', 'none').css('border', '1px solid grey').css('width', '155px').css('text-align', 'center')
        $('.select2-selection__rendered').next().css('margin-top', '7px')
    }

    $('.divendsaved').each(function () {
        $(this).find('.endsaved').length <= 0 ? $('.dv-conf-end').hide() : $('.dv-conf-novoend').show()
    })
})

$(document).on('keydown keyup change focus', '.cep, .rua, .nmrcasa, .bairro, .cidade, .uf, .comp', function () {
    if ($('.cep').val() == "" || $('.rua').val() == "" || $('.nmrcasa').val() == "" || $('.bairro').val() == "" || $('.cidade').val() == "" || $('.uf').val() == "") {
        $('.btnconfirmarnovoend').attr('disabled', 'disabled')
    } else if ($('.uf').val().length < 2) {
        $('.btnconfirmarnovoend').attr('disabled', 'disabled')
    } else {
        $('.btnconfirmarsaveend').attr('disabled', 'disabled');
        $('.btnconfirmarnovoend').removeAttr('disabled');
        $('.divendsaved .endsaved input').each(function () {
            $(this).prop('checked', false);
        })
    }
})


$(document).on('click', 'input[name=end]', function () {
    let modal = $('#modalEndereco')
    modal.find('input[name=end]').each(function () {
        $(this).removeAttr('checado')
    })

    $(this).attr('checado', 'true')

    if ($(this).attr('checado') == 'true') {
        $('.btnconfirmarsaveend').removeAttr('disabled')
        $('.btnconfirmarnovoend').attr('disabled', 'disabled')
    } else {
        $('.btnconfirmarsaveend').attr('disabled', 'disabled')
    }
})

function ultimoEndereco() {
    if (Cookies.get('tokenUsuario')) {
        $.ajax({
            url: '/enderecoLast',
            type: 'GET',
            cache: false,
            success: (data) => {
                if (data != null) {
                    $('.ende').text(data.rua + ', Nº ' + data.nmrcasa + ' ' + data.bairro + ' - ' + data.cidade + ' - ' + data.uf);
                } else {
                    let ende = JSON.parse(Cookies.get('endereco'));
                    $('.ende').text(ende[1] + ' - ' + ende[0])
                }
            },
            error: (data) => { }
        })
    }
}

function verificarCarrinho() {
    if (Cookies.get('carrinho')) {
        // console.log(JSON.parse(Cookies.get('carrinho')).length - 1)

        let array = JSON.parse(Cookies.get('carrinho'))

        // $('.contcart').text(array.length - 1)
        let rest = JSON.parse(Cookies.get('restaurante'));
        $('.nomeRest').text(rest[1]);
        if (array.nomeProduto) {
            $('.caixa2').find('.card-content').find('.itens_pedido').append(' <div data-id="'+array.id+'" data-uuid="' + array.uuid + '" class="produtoitem"><div style="display: flex;"><p class="nomeProduto" style="width: 75%; font-weight:bold" class="titlepedido">(' + array.quantidade + 'x) ' + array.nomeProduto + '</p><p style="width: 25%;margin-left: 10px;text-align: right;font-weight: bold;" class="valorpedido">R$ ' + array.valor + '</p></div><p class="adicionaispedido" style="color: grey; margin-top: 5px;">' + array.adicionais + '</p><p style="color: #4c4c4c; opacity: .7; margin-top: 5px;">' + array.observacao + '</p><div style="display: flex;margin-top: 10px; justify-content: flex-end;"><p data-id=' + array.id + ' class="editaritem modal-trigger" style="color: grey;font-weight: bold;cursor: pointer;margin-right: 7px;" href="#modalPedidos3">Editar</p><p class="removerproduto" style="color: purple;font-weight: bold; cursor: pointer;">Remover</p></div><div class="divider" style="margin-top: 20px; margin-bottom: 20px;"></div></div> ');
        } else {
            for (var ii = 0; ii < array.length; ii++) {
                $('.caixa2').find('.card-content').find('.itens_pedido').append(' <div data-id="' + array[ii].id + '" data-uuid="' + array[ii].uuid + '" class="produtoitem"><div style="display: flex;"><p class="nomeProduto" style="width: 75%; font-weight:bold" class="titlepedido">(' + array[ii].quantidade + 'x) ' + array[ii].nomeProduto + '</p><p style="width: 25%;margin-left: 10px;text-align: right;font-weight: bold;" class="valorpedido">R$ ' + array[ii].valor + '</p></div><p class="adicionaispedido" style="color: grey; margin-top: 5px;">' + array[ii].adicionais + '</p><p style="color: #4c4c4c; opacity: .7; margin-top: 5px;">' + array[ii].observacao + '</p><div style="display: flex;margin-top: 10px; justify-content: flex-end;"><p data-id=' + array[ii].id + ' class="editaritem modal-trigger" style="color: grey;font-weight: bold;cursor: pointer;margin-right: 7px;" href="#modalPedidos3">Editar</p><p class="removerproduto" style="color: purple;font-weight: bold; cursor: pointer;">Remover</p></div><div class="divider" style="margin-top: 20px; margin-bottom: 20px;"></div></div> ');
            }
        }
    }
}

$(document).on('click', '.btnconfirmarped', function () {
    location.reload();
})

$(document).ready(function () {

    var socket = io('https://comeaee.herokuapp.com/');

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
    $(document).on('click', '.btnconfirmarnovoend', function () {
        let dados = JSON.parse(Cookies.get('endereco'));
        let res = JSON.parse(Cookies.get('restaurante'));
        let array = [];
        let adicionais = [];
        let idsProdutos = [];

        $('.produtoitem').each(function () {
            idsProdutos.push($(this).attr('data-id'));
            array.push({
                produto: $(this).find('.nomeProduto').html(),
                valor: $(this).find('.valorpedido').html()
            })
            adicionais.push($(this).find('.nomeProduto').html() + ' (' + $(this).find('.adicionaispedido').html() + ')');

        });

        $.ajax({
            url: '/cadastrarPedido',
            type: 'POST',
            beforeSend: function () {
                $('.btnconfirmarnovoend').text('Confirmando').css('background-color', 'grey')
            },
            dataType: 'json',
            data: {
                idsProdutos: idsProdutos,
                troco: $('input[name="trocoValor"]').val(),
                taxaentrega: $('.valortaxaentrega').text(),
                cep: $('.cep').val(),
                rua: $('.rua').val(),
                nmrcasa: $('.nmrcasa').val(),
                bairro: $('.bairro').val(),
                cidade: dados[1],
                uf: dados[0],
                produtos: array,
                complemento: $('.comp').val(),
                adicionais: adicionais,
                valor: $('.valortotal').html(),
                restaurante: res[0],
                codpag: 2
            },
            success: function (data) {

                socket.emit("entrar pedidos", data.data.codusuario, function (valido) { });
                $('.btnconfirmarnovoend').text('Confirmado!').css('background-color', 'darkgreen').css('opacity', '1')
                socket.emit('enviar mensagem', {
                    msg: 'Novo Pedido',
                    restaurante: res[0]
                })
                Swal.fire({
                    title: 'Confirmação!',
                    text: data.message,
                    timer: 5000,
                    icon: 'success',
                    confirmButtonColor: '#800080',
                }).then((result) => {
                    Cookies.remove("carrinho")
                    window.location.href = '/acompanhar'
                });

                Cookies.remove("carrinho")
            }
        })

    });
    let codrestaurante = JSON.parse(Cookies.get('restaurante'));
    $.ajax({
        url: '/taxaEntrega/' + codrestaurante[0],
        type: 'GET',
        success: (data) => {
            if (data.area) {

                let area = JSON.parse(data.area);
                $('.valortaxaentrega').text(area[0].valor);
            }
        }
    })

    ultimoEndereco();

    $(document).on('click', '.btnconfirmarsaveend', function () {
        let cont = 0;

        $('#test1').find('.divcashpay, .divsolopay').each(function(){
            $(this).attr('checado') == 'true' ? cont++ : null;
        })

        if(cont > 0){
            $('#modalEndereco').find('.modal-content').find('.divendsaved').find('.endsaved').each(function () {
                if ($(this).find('.with-gap').attr('checado') == 'true') {
    
                    let id = $(this).find('.with-gap').attr('data-id'), res = JSON.parse(Cookies.get('restaurante')), array = [], adicionais = [], idsProdutos = [];
    
                    $('.produtoitem').each(function () {
                        idsProdutos.push({id:$(this).attr('data-id'),valor:$(this).find('.valorpedido').html()});
                        array.push({
                            produto: $(this).find('.nomeProduto').html(),
                            valor: $(this).find('.valorpedido').html()
                        })
                        adicionais.push($(this).find('.adicionaispedido').html());
                    });
    
                    $.ajax({
                        url: '/pedidoEnde',
                        type: 'POST',
                        beforeSend: function () {
                            $('.btnconfirmarsaveend').text('Confirmando').css('background-color', 'grey').attr('disabled', 'disabled')
                        },
                        dataType: 'json',
                        headers: {
                            'Authorization': Cookies.get('tokenUsuario')
                        },
                        data: {
                            idsProdutos: idsProdutos,
                            troco: $('input[name="trocoValor"]').val(),
                            taxaentrega: $('.valortaxaentrega').text(),
                            produtos: array,
                            adicionais: adicionais,
                            valor: $('.valortotal').html(),
                            restaurante: res[0],
                            codpag: 2,
                            id: id
                        },
                        success: function (data) {
    
                            socket.emit("entrar pedidos", data.data.codusuario, function (valido) {
                                console.log(valido)
                            });
    
                            $('.btnconfirmarsaveend').text('Confirmado!').css('background-color', 'darkgreen').css('opacity', '1')
    
                            socket.emit('enviar mensagem', {
                                msg: 'Novo Pedido',
                                restaurante: res[0]
                            })
    
                            $('#modalEndereco').modal('close')
                            Swal.fire({
                                title: 'Confirmação!',
                                text: data.message,
                                icon: 'success',
                                confirmButtonColor: '#800080',
                            }).then((result) => {
    
                                Cookies.remove("carrinho")
                                window.location.href = '/acompanhar/' + data.data.id;
                                Cookies.set('tokenUsuario', data.token)
                            });
    
                        }
                    });
    
                    $('.divendsaved').find('.endsaved').each(function () {
                        let inp = $(this).find('input');
                        if (inp.is(':checked') == true) {
                            let idend = inp.attr('data-id')
    
                            $.ajax({
                                url: '/atualizarEnderecoPrincipal/' + idend,
                                type: 'PUT',
                                success: (data) => {
                                },
                                error: (data) => {
                                }
                            })
                            return false;
                        }
                    });
                }
            })
        } else {
            msgswal('Erro','Defina a forma a forma de pagamento','error',4000);
            return false;
        }

    });

    verificarCarrinho();

    $('.tabs').tabs();

    $('.js-example-basic-single').select2({
        dropdownAutoWidth: true
    });

    let i = 0;
    let valores = []
    let soma = 0;

    $('.card').find('.card-content').find('.produtoitem').each(function () {
        i++;
        valores.push($(this).find('.valorpedido').text().substr(3).replace(',', '.'))
    })

    for (ii = 0; ii < valores.length; ii++) {
        soma += parseFloat(valores[ii])
    }

    let entrega = parseFloat($('.valortaxaentrega').text().substr(3).replace(',', '.'))

    if (i >= 1) {
        $('.valorsubtotal').text('R$ ' + (soma.toFixed(2)).replace('.', ','))
        $('.valortotal,.valorpedidomodal').text('R$ ' + (soma + entrega).toFixed(2).replace('.', ','))
    } else {
        $('.valorsubtotal').text('R$ 0,00')
        $('.valortotal,.valorpedidomodal').text('0,00')
    }

    if ($('.card').find('.card-content').find('.produtoitem').length <= 0) {
        Swal.fire({
            title: 'Todos os itens foram removidos!',
            text: 'A sua sacola está vazia, você será redirecionado em 7 segundos',
            icon: 'warning',
            confirmButtonColor: '#800080',
            timer: 7000
        }).then((result) => {
            window.location.href = "/comeae"
        })
    }

    $('#modalEndereco').modal({
        dismissible: false,
        onOpenStart: () => {
            $('.rodape-mobile').css('z-index', '999')
        }
    })
    $('#modalTroco').modal({
        dismissible: false
    })
    $('#modalValorTroco').modal({
        dismissible: false
    })

    $('.divendsaved').find('.endsaved').each(function () {
        $(this).find('.selectEndereco').attr('data-bool') ? $(this).find('.selectEndereco').click() : null;
    })

    $('.inputvalortroco').mask('000.000.000.000.000,00', {reverse: true});
})

function limpa_formulário_cep_fin() {
    $('#modalEndereco .rua').val('')
    $('#modalEndereco .bairro').val('')
    $('#modalEndereco .cidade').val('')
    $('#modalEndereco .uf').val('')
}

function meu_callback_fim(conteudo) {
    if (!("erro" in conteudo)) {
        $('#modalEndereco .rua').val(conteudo.logradouro);
        $('#modalEndereco .bairro').val(conteudo.bairro);
        $('#modalEndereco .cidade').val(conteudo.localidade);
        $('#modalEndereco .uf').val(conteudo.uf);
        $('#modalEndereco .nmrcasa').focus()
    } else {
        limpa_formulário_cep_fin();
        Swal.fire({
            title: 'Erro!',
            text: 'CEP não encontrado',
            timer: 3500,
            confirmButtonColor: '#800080',
            icon: 'error'
        }).then((result) => {
            $('#modalEndereco .cep').val('')
        })
    }
}

function pesquisacep_fin(valor) {

    var cep = valor.replace(/\D/g, '');

    if (cep != "") {
        var validacep = /^[0-9]{8}$/;

        if (validacep.test(cep)) {
            $('#modalEndereco .rua').val('...')
            $('#modalEndereco .bairro').val('...')
            $('#modalEndereco .cidade').val('...')
            $('#modalEndereco .uf').val('...')

            var script = document.createElement('script');
            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback_fim';
            document.body.appendChild(script);

        } else {
            limpa_formulário_cep_fin();
            Swal.fire({
                title: 'Erro!',
                text: 'Formato de CEP inválido',
                timer: 3500,
                confirmButtonColor: '#800080',
                icon: 'error'
            })
        }
    } else {
        limpa_formulário_cep_fin();
    }
};

$('.cardd').card({
    container: '.card-wrapper',
    width: 280,
    placeholders: {
        number: '•••• •••• •••• ••••',
        name: 'Nome Completo',
        expiry: '••/••',
        cvc: '•••'
    },
    formSelectors: {
        nameInput: 'input[name="nometitular"]',
        numberInput: '.creditcardnum',
        expiryInput: '.mmaa',
    },
    messages: {
        validDate: '', // optional - default 'valid\nthru'
        monthYear: 'MM/AAAA', // optional - default 'month/year'
    },
});

//MASCARA CPF/CNPJ
function inputHandler(masks, max, event) {
    var c = event.target;
    var v = c.value.replace(/\D/g, '');
    var m = c.value.length > max ? 1 : 0;
    VMasker(c).unMask();
    VMasker(c).maskPattern(masks[m]);
    c.value = VMasker.toPattern(v, masks[m]);
}

var docMask = ['999.999.999-999', '99.999.999/9999-99'];
var doc = document.querySelector('.cpfcnpjtitular');
var doc1 = document.querySelector('.cpfcnpjnota1');
var doc2 = document.querySelector('.cpfcnpjnota2');
VMasker(doc).maskPattern(docMask[0]);
VMasker(doc1).maskPattern(docMask[0]);
VMasker(doc2).maskPattern(docMask[0]);
doc.addEventListener('input', inputHandler.bind(undefined, docMask, 14), false);
doc1.addEventListener('input', inputHandler.bind(undefined, docMask, 14), false);
doc2.addEventListener('input', inputHandler.bind(undefined, docMask, 14), false);

$(document).on('blur', '.creditcardnum', function () {
    let val = $(this).val()
    $(this).css('border-bottom', '1px solid purple').css('box-shadow', '0 1px 0 0 purple')

    if (val.length <= 18) {
        $(this).addClass('invalid')
        $(this).removeClass('valid')
        Swal.fire({
            title: 'Formato incorreto!',
            text: 'Verifique o formato numerico do cartão',
            icon: 'error',
            timer: 3500,
            confirmButtonColor: '#800080'
        }).then((result) => {
            $(this).addClass('invalid')
            $(this).removeClass('valid')
            $(this).css('border-bottom', '1px solid #F44336').css('box-shadow', '0 1px 0 0 #F44336')
        })
        return false;
    } else {
        $(this).addClass('valid')
        $(this).removeClass('invalid')
        $(this).css('border-bottom', '1px solid #4CAF50').css('box-shadow', '0 1px 0 0 #4CAF50')
    }
})

$(document).on('blur', '.mmaa', function () {
    let val = $(this).val()
    var date = new Date();
    var ano = date.getFullYear();
    var mes = date.getMonth() + 1;

    if (mes.toString().length <= 1) {
        mes = "0" + mes
    }

    if (val.length != 7 && val.length != 9) {
        msgswal('Formato incorreto!', 'Verifique o formato da validade do cartão', 'error', 3500)
        $(this).addClass('invalid')
        return false;
    }

    if (val.length == 9) {
        if (val.substr(5, 4) < ano) {
            msgswal('Cartão expirado!', 'Cartão com ano inválido', 'error', 3500)
            $(this).addClass('invalid')
            return false;
        } else if (val.substr(0, 2) < mes && val.substr(5, 4) == ano) {
            msgswal('Cartão expirado!', 'Cartão com mês inválido', 'error', 3500)
            $(this).addClass('invalid')
            return false;
        } else if (val.substr(0, 2) > 12) {
            msgswal('Mês inválido', 'O mês informado não corresponde a um mês do ano', 'error', 3500)
            $(this).addClass('invalid')
            return false;
        } else if (val.substr(5, 4) > (ano += parseInt(ano.toString().substr(2, 2)))) {
            msgswal('Cartão inválido!', 'Cartão com ano inválido', 'error', 3500)
            $(this).addClass('invalid')
            return false;
        }
    } else {
        $(this).addClass('valid')
        $(this).removeClass('invalid')
    }

    if (val.length == 7) {
        if (val.substr(5, 2) < ano.toString().substr(2, 2)) {
            msgswal('Cartão expirado!', 'Cartão com ano inválido', 'error', 3500)
            $(this).addClass('invalid')
            return false;
        } else if (val.substr(0, 2) < mes && val.substr(5, 2) == ano.toString().substr(2, 2)) {
            msgswal('Cartão expirado!', 'Cartão com mes inválido', 'error', 3500)
            $(this).addClass('invalid')
            return false;
        } else if (val.substr(0, 2) > 12) {
            msgswal('Mes inválido!', 'O mês informado não corresponde a um mês do ano', 'error', 3500)
            $(this).addClass('invalid')
            return false;
        } else if (val.substr(5, 2) > ano.toString().substr(2, 2) * 2) {
            msgswal('Cartão inválido!', 'Cartão com ano inválido', 'error', 3500)
            $(this).addClass('invalid')
            return false;
        }
    } else {
        $(this).addClass('valid')
        $(this).removeClass('invalid')
    }

})