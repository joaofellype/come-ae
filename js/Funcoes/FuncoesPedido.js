function msgswaltext(titulo, text, icon) {
    Swal.fire({
        title: titulo,
        html: text,
        icon: icon,
        timer: 4000,
        confirmButtonColor: "#800080"
    })
}

$(document).on('click', '.btnconfirmarped', function () {

    let adici = [], nome, quantidade, editAdicionais = [], observacao = $('.textobservacao').val(), tudo = [], carrinho, soma = 0;
    let carrinho1;
    $('#modalPedidos3').find('.modal-content').find('.tudo').find('.divgeralprod1').each(function (x) {
        $(this).find('.divitemprod').each(function (x) {

            if ($(this).find('.valoptionprod1').text() != "0") {
                nome = $(this).find('.pnomeitemprod').text();
                quantidade = $(this).find('.valoptionprod1').text();

                editAdicionais.push({ nome: nome, quantidade: quantidade, totalrowMenos: $(this).find('.iconoptionmenosprod1').attr('totalrow'), totalrowMais: $(this).find('.iconoptionmaisprod1').attr('totalrow') })
                adici.push('(' + quantidade + 'x) ' + nome)
            }
        })
    });

    observacao == "" ? observacao = 'Sem observação' : null;
    let data = [$('input[name="codrestaurante"]').val(), $('.nomeestab').html()];
    Cookies.set('restaurante', JSON.stringify(data));
    let array = { nomeProduto: $('.nameprincitem').html(), quantidade: $('.qntprodutomodal').val(), valor: $(".valortotprodmd1").html(), observacao: observacao, adicionais: adici.join(", "), id: $(".nameprincitem").attr('data-id'), nomerestaurante: $('.nomeestab').html(), uuid: Math.random() * 999999, adicio: editAdicionais };
    if ($('.tipoModal').text() == 'Editar Item') {
        if (Cookies.get('carrinho')) {
            carrinho1 = JSON.parse(Cookies.get('carrinho'))
            if (array.id == carrinho1.id) {

                Cookies.remove('carrinho')
            }
        }
    }
    if (!Cookies.get('carrinho')) {
        Cookies.set('carrinho', JSON.stringify(array));
    } else {
        if ($('.tipoModal').text() == 'Editar Item') {
            carrinho1 = JSON.parse(Cookies.get('carrinho'))
            if (carrinho1.length > 0) {
                for (let i = 0; i < carrinho1.length; i++) {
                    if (carrinho1[i].id == array.id) {
                        carrinho1.splice(i, 1)
                    }
                }
                Cookies.set('carrinho', JSON.stringify(carrinho1))
            }
        }

        if (!Array.isArray(JSON.parse(Cookies.get("carrinho")))) {

            if (JSON.parse(Cookies.get('carrinho')).nomerestaurante != $('.nomeestab').html()) {
                msgswal('Carrinho com itens', 'Há itens de outro estabelecimento em seu carrinho, limpe-o!', 'error', 0)
                return false;
            }

            else {
                let cont = [];
                cont.push(JSON.parse(Cookies.get('carrinho')));
                cont.push(array);
                Cookies.set('carrinho', JSON.stringify(cont));
            }
        } else {
            if (JSON.parse(Cookies.get('carrinho'))[0].nomerestaurante != $('.nomeestab').html()) {
                msgswaltext('Carrinho com itens', 'Há itens de outro estabelecimento em seu carrinho, limpe-o!', 'error')
                return false;
            } else {
                carrinho = JSON.parse(Cookies.get("carrinho"));
                carrinho.forEach(el => {
                    tudo.push(el);
                })
                tudo.push(array);
                Cookies.set('carrinho', JSON.stringify(tudo));
            }
        }
    }
    $('#modalPedidos3').modal('close');
    AddToCart();

})

$(document).on('click', '.btnmaisprod', function () {

    let btnconfirm = $('.btnconfirmarped'), cont = 0;
    $('.tudo').find('.divheaderprod1').each(function () {
        if ($(this).find('.obgtr').attr('checado') == 'false') {
            msgswalhtml('Ação não permitida!', 'Preencha todos os <b>obrigatórios</b> antes', 'error')
            btnconfirm.css('pointer-events', 'none').css('opacity', '.5')
            cont++;
        } else {
            btnconfirm.css('pointer-events', '').css('opacity', '1')
        }
    });
    cont <= 0 ? verificarInputModal(false) : null;
})

$(document).on('click', '.btnmenosprod', function () {

    if ($('#modalPedidos3').hasClass('open')) {

        let qnt = parseInt($('.qntprodutomodal').attr('value'))
        qnt--;
        if (qnt <= 1) {
            $(this).css('opacity', '.5')
            $('.qntprodutomodal').attr('value', 1).val(1);
            return false;
        } else {
            $(this).next().next().css('opacity', '1')
            $('.qntprodutomodal').attr('value', parseInt(qnt)).val(parseInt(qnt));
        }
    }
})

function verificarInputModal(only_v) {
    let qnt = parseInt($('.qntprodutomodal').attr('value'))
    let val = $('.qntprodutomodal').val();
    if (qnt < 1 || val == "") {
        $('.btnmenosprod').css('opacity', '.5')
        $('.btnmaisprod').css('opacity', '1')
        $('.qntprodutomodal').attr('value', 1).val(1);
        return false;
    } else if (qnt >= 999) {
        $('.btnmenosprod').css('opacity', '1')
        $('.btnmaisprod').css('opacity', '.5')
    } else {
        if (only_v == true) {
            $('.btnmenosprod').css('opacity', '1')
            $('.btnmaisprod').css('opacity', '1')
            $('.qntprodutomodal').attr('value', parseInt(qnt)).val(parseInt(qnt));
        } else {
            qnt++;
            $('.btnmenosprod').css('opacity', '1')
            $('.btnmaisprod').css('opacity', '1')
            $('.qntprodutomodal').attr('value', parseInt(qnt)).val(parseInt(qnt));
        }
    }
}

$(document).on('blur', '.qntprodutomodal', function () {
    let cont = 0;
    if ($('.qntprodutomodal').val() != '' && $('.qntprodutomodal').val() != 0 && $('.qntprodutomodal').val() != null) {


        $('.qntprodutomodal').attr('value', $(this).val())

        $('tudo').find('.divheaderprod1').each(function (index) {
            $(this).find('.obgtr').each(function () {
                $(this).attr('checado') == 'false' ? cont++ : null;
            })
        })

        if (cont > 0) {
            msgswalhtml('Ação não permitida!', 'Preencha todos os <b>obrigatórios</b> antes', 'error');
            $('.qntprodutomodal').attr('value', 1).val(1);
            $('.btnconfirmarped').css('opacity', '0.5').css('pointer-events', 'none');
            return false
        } else {
            verificarInputModal(true);
        }

    } else {
        $('.qntprodutomodal').attr('value', 1).val(1);
    }
})

$(document).on('click blur', '.btnmaisprod,.btnmenosprod, .editaritem,.column,.qntprodutomodal, .loadermodal ', function () {

    $('.tudo').find('.divheaderprod1').each(function () {
        if ($(this).find('.obgtr').attr('checado') == 'false') {
            $('.btnconfirmarped').css('pointer-events', 'none').css('opacity', '.5')
            return false;
        } else {
            $('.btnconfirmarped').css('pointer-events', '').css('opacity', '1')
        }
    })

    let qntgeral = $('.qntprodutomodal').attr('value')

    $('.valorprodmd1').each(function () {
        if ($(this).attr('soupizza') == 'true') {
            valundprod = parseFloat('0').toFixed(2)
        } else {
            valundprod = parseFloat($('.valorprodmd1').text().replace(',', '.')).toFixed(2)
        }
    })

    //soma dos valores dos adicionais - opcionais
    let valores = []
    $('.divgeralprod1').each(function () {
        $(this).find('.divitemprod').each(function () {
            let a = parseFloat($(this).find('.iconoptionmaisprod1').attr('totalrow')).toFixed(2)
            a == 'NaN' ? null : valores.push(a);
        })
    })

    let soma = 0;
    for (i = 0; i < valores.length; i++) {
        soma += parseFloat(valores[i].replace(',', '.'))
    }

    let contobg = 0;
    $('.tudo').find('.divheaderprod1').each(function () {
        $(this).find('.obgtr').each(function () {
            contobg++
        })
    })

    if (contobg >= 1) {
        $('.valortotprodmd1').text(parseFloat(qntgeral * soma).toFixed(2).replace('.', ','))
    } else {
        $('.valortotprodmd1').text(((qntgeral * valundprod) + (qntgeral * soma)).toFixed(2).replace('.', ','))
    }

})

$(document).on('click', '.iconoptionmenosprod1', function () {

    if ($('#modalPedidos3').hasClass('open')) {

        let tot = 0;
        let meutot = parseInt($(this).next().text())
        let totalopc = parseInt($(this).parents('.divgeralprod1').find('.valorqntprodmd1').text())
        meutot--;
        let marcados = $(this).parent().parent().parent().find('.qntmarcados')
        let obrigados = $(this).parent().parent().parent().find('.qntobrigatorios')
        let totalfooter = $('.qntprodutomodal').val()
        let btnconfirm = $('.btnconfirmarped')
        let nopai = $(this).parent().parent().parent().parent()
        let qntprinc = $('.valorprodmd1').text().replace(',', '.')

        $('.divgeralprod1').find('.divitemprod').each(function () {
            tot += parseInt($(this).find('.valoptionprod1').text())
        })

        $(this).next().text(meutot)
        marcados.text(parseInt(marcados.text()) - 1)

        if (marcados.text() >= obrigados.text()) {
            marcados.parent().parent().find('.obgtr').attr('checado', 'true')
            $(this).parents('.divitemprod').parents('.divgeralprod1').find('.checkobgtr').remove()
            $('<div class="checkobgtr" style="background-color: purple;padding: 0 3px;color: white;text-shadow: 0px 1px 2px black;border-radius: 3px;margin-left: 5px;"> <i class="material-icons" style="font-size: 15px;display: flex;padding: 3px 0px;color: lightgreen;">check</i> </div>').appendTo($(this).parents('.divitemprod').parents('.divgeralprod1').find('.obgtr').parent())

        } else {
            marcados.parent().parent().find('.obgtr').attr('checado', 'false')
            $(this).parents('.divitemprod').parents('.divgeralprod1').find('.checkobgtr').remove()
        }

        let checks = [];
        let falso = 0;
        let verdadeiro = 0;

        let contobg = 0
        $('#modalPedidos3').find('.obgtr').each(function () {
            contobg++;
        })

        if (contobg <= 0) {
        } else {
            nopai.find('.obgtr').each(function () {
                checks.push($(this).attr('checado'))
            })

            for (i = 0; i < checks.length; i++) {
                let val = checks[i];
                if (val == 'false') {
                    falso++;
                } else {
                    verdadeiro++;
                }
            }

            if (falso > 0) {
                btnconfirm.css('pointer-events', 'none').css('opacity', '.5')
            } else {
                btnconfirm.css('pointer-events', '').css('opacity', '1')
            }
        }

        if (parseInt($(this).next().text()) <= 0) {
            if ($(this).parent().prev().find('.pvalitemcomp').text() == "") {
            } else {
                let a = $(this).parent().prev().find('.pvalitemcomp').text().replace(',', '.')
                let b = parseFloat(a).toFixed(2)
                let c = parseFloat($('.valortotprodmd1').text().replace(',', '.'))
                let d = parseInt($(this).next().text()) * parseFloat($(this).parent().prev().find('.pvalitemcomp').text().replace(',', '.')).toFixed(2)
                $(this).attr('totalrow', d.toFixed(2))
                $(this).next().next().attr('totalrow', d.toFixed(2))

                let tst = $(this).parent().parent().parent().parent()
                let soma = [];
                tst.find('.divgeralprod1').each(function () {
                    $(this).find('.divitemprod').each(function (index) {
                        if ($(this).find('.iconoptionmaisprod1').attr('totalrow') == undefined) {
                        } else {
                            soma.push($(this).find('.iconoptionmaisprod1').attr('totalrow'))
                        }
                    })
                })
                let tot = 0;
                for (var i = 0; i < soma.length; i++) {
                    tot += parseFloat(soma[i].replace(',', '.'))
                }

                let contobg = 0;
                $('#modalPedidos3').find('.tudo').find('.obgtr').each(function () {
                    contobg++;
                })

                let fim = 0;
                if (contobg <= 0) {
                    fim = (tot + parseFloat(qntprinc)) * totalfooter;
                    $('.btnconfirmarped').css('pointer-events', '').css('opacity', '1')
                } else {
                    fim = tot * totalfooter;
                }
                $('.valortotprodmd1').text(fim.toFixed(2).toString().replace('.', ','))
            }

            $(this).css('display', 'none')
            $(this).next().css('display', 'none')
            $(this).parents('.divgeralprod1').find('.iconoptionmaisprod1').each(function () {
                $(this).css('opacity', '1')
            })
        } else {
            if ($(this).parent().prev().find('.pvalitemcomp').text() == "") {
            } else {
                let a = $(this).parent().prev().find('.pvalitemcomp').text().replace(',', '.')
                let b = parseFloat(a).toFixed(2)
                let c = parseFloat($('.valortotprodmd1').text().replace(',', '.'))
                let d = parseInt($(this).next().text()) * parseFloat($(this).parent().prev().find('.pvalitemcomp').text().replace(',', '.')).toFixed(2)
                $(this).attr('totalrow', d.toFixed(2))
                $(this).next().next().attr('totalrow', d.toFixed(2))

                let tst = $(this).parent().parent().parent().parent()
                let soma = [];
                tst.find('.divgeralprod1').each(function () {
                    $(this).find('.divitemprod').each(function (index) {
                        if ($(this).find('.iconoptionmaisprod1').attr('totalrow') == undefined) {

                        } else {
                            soma.push($(this).find('.iconoptionmaisprod1').attr('totalrow'))
                        }
                    })
                })
                let tot = 0;
                for (var i = 0; i < soma.length; i++) {
                    tot += parseFloat(soma[i].replace(',', '.'))
                }

                let contobg = 0;
                $('#modalPedidos3').find('.tudo').find('.obgtr').each(function () {
                    contobg++;
                })

                let fim = 0;
                if (contobg <= 0) {
                    fim = (tot + parseFloat(qntprinc)) * totalfooter;
                    $('.btnconfirmarped').css('pointer-events', '').css('opacity', '1')
                } else {
                    fim = tot * totalfooter;
                }
                $('.valortotprodmd1').text(fim.toFixed(2).toString().replace('.', ','))
            }

            $(this).parents('.divgeralprod1').find('.iconoptionmaisprod1').each(function () {
                $(this).css('opacity', '1')
            })
        }
        if ($(this).attr('totalrow') == '0') {
            $(this).removeAttr('totalrow')
            $(this).next().next().removeAttr('totalrow')
        }
    }

})

$(document).on('click', '.iconoptionmaisprod1', function () {

    if ($('#modalPedidos3').hasClass('open')) {

        let tot = 0;
        let meutot = parseInt($(this).prev().text())
        let totalopc = parseInt($(this).parents('.divgeralprod1').find('.valorqntprodmd1').text())
        let marcados = $(this).parent().parent().parent().find('.qntmarcados')
        let obrigados = $(this).parent().parent().parent().find('.qntobrigatorios')
        let totalfooter = $('.qntprodutomodal').val()
        let btnconfirm = $('.btnconfirmarped')
        let nopai = $(this).parent().parent().parent().parent()
        let qntprinc = $('.valorprodmd1').text().replace(',', '.')

        $(this).parents('.divgeralprod1').find('.divitemprod').each(function () {
            tot += parseInt($(this).find('.valoptionprod1').text())
        })

        if (tot < totalopc) {
            meutot++;

            if ($(this).parent().prev().find('.pvalitemcomp').text() == "") {
                $(this).prev().text(meutot)
                marcados.text(parseInt(marcados.text()) + 1)
            } else {

                //pega o valor do item
                let a = $(this).parent().prev().find('.pvalitemcomp').text().replace(',', '.')
                //atribui o total ao qnt item
                $(this).prev().text(meutot)
                //transform o valor do item em float
                let b = parseFloat(a).toFixed(2)
                //atribui o total de item ao txt obrigatorio
                marcados.text(parseInt(marcados.text()) + 1)
                //pega o valor total do pedido do botão
                let c = parseFloat($('.valortotprodmd1').text()).toFixed(2).replace(',', '.')
                //multiplica o qnt do item pelo seu valor
                let d = parseInt($(this).prev().text()) * parseFloat($(this).parent().prev().find('.pvalitemcomp').text().replace(',', '.')).toFixed(2)
                // atribui o valor total ao totalrow attr do item
                $(this).attr('totalrow', d.toFixed(2))
                // atribui o valor total ao totalrow attr do outro item
                $(this).prev().prev().attr('totalrow', d.toFixed(2))

                let tst = $(this).parent().parent().parent().parent()

                let soma = [];
                tst.find('.divgeralprod1').each(function () {
                    $(this).find('.divitemprod').each(function (index) {
                        if ($(this).find('.iconoptionmaisprod1').attr('totalrow') == undefined) {
                        } else {
                            soma.push($(this).find('.iconoptionmaisprod1').attr('totalrow'))
                        }
                    })
                })

                let tot = 0;
                for (var i = 0; i < soma.length; i++) {
                    tot += parseFloat(soma[i].replace(',', '.'))
                }

                let contobg = 0;
                $('#modalPedidos3').find('.tudo').find('.obgtr').each(function () {
                    contobg++;
                })

                let fim = 0;
                if (contobg <= 0) {
                    fim = (tot + parseFloat(qntprinc)) * totalfooter;
                    $('.btnconfirmarped').css('pointer-events', '').css('opacity', '1')
                } else {
                    fim = tot * totalfooter;
                }

                $('.valortotprodmd1').text(fim.toFixed(2).toString().replace('.', ','))

            }

            $(this).prev().attr('style', 'display: block !important')
            $(this).prev().prev().attr('style', 'display: block !important')

            if (marcados.text() >= obrigados.text()) {
                marcados.parent().parent().find('.obgtr').attr('checado', 'true')
                $(this).parents('.divitemprod').parents('.divgeralprod1').find('.checkobgtr').remove()
                $('<div class="checkobgtr"><i class="material-icons">check</i></div>').appendTo($(this).parents('.divitemprod').parents('.divgeralprod1').find('.obgtr').parent())

            } else {
                marcados.parent().parent().find('.obgtr').attr('checado', 'false')
                $(this).parents('.divitemprod').parents('.divgeralprod1').find('.checkobgtr').remove()
            }

            let checks = [];
            let falso = 0;
            let verdadeiro = 0;

            let contobg = 0
            $('#modalPedidos3').find('.obgtr').each(function () {
                contobg++;
            })

            if (contobg <= 0) {
            } else {
                nopai.find('.obgtr').each(function () {
                    checks.push($(this).attr('checado'))
                })

                for (i = 0; i < checks.length; i++) {
                    let val = checks[i];
                    if (val == 'false') {
                        falso++;
                    } else {
                        verdadeiro++;
                    }
                }

                if (falso > 0) {
                    btnconfirm.css('pointer-events', 'none').css('opacity', '.5')
                } else {
                    btnconfirm.css('pointer-events', '').css('opacity', '1')
                }
            }
        }

        tot = 0;
        $(this).parents('.divgeralprod1').find('.divitemprod').each(function () {
            tot += parseInt($(this).find('.valoptionprod1').text())
        })

        if (tot < totalopc) {
            $(this).prev().text(meutot)
        } else if (tot == totalopc) {
            $(this).parents('.divgeralprod1').find('.iconoptionmaisprod1').each(function () {
                $(this).css('opacity', '.5')
            })
            return false;
        }
    }
})

$(document).on('click', '.column', function () {

    let adicionais = [];
    $('.tipoModal').text('Detalhes do pedido')
    if ($('#modalPedidos3').hasClass('open')) {
        $('#modalPedidos3').find('.tudo').empty();
        $('.qntprodutomodal').val('1').attr('value', '1');
        $('.btnmenosprod').css('opacity', '0.5')
    }

    $.ajax({
        url: '/listarProdutos/' + $(this).attr('data-id'),
        type: 'GET',
        dataType: 'json',
        beforeSend: function () {
            $('.loadermodal').show(100)
        },
        success: function (data) {
            $('.textobservacao').val('');

            data.forEach(el => {
                if (el.descricao == null) {
                    el.descricao = ''
                }
                if (el.valorpromocional != null) {
                    $(".valorprodmd2").text(el.valorpromocional.replace('.', ','));
                    $(".valorprodmd1").text(el.valorpromocional.replace('.', ','));
                    $('.valortotprodmd1').text(el.valorpromocional.replace('.', ','));
                } else {
                    $(".valorprodmd2").text(el.valor.replace('.', ','));
                    $(".valorprodmd1").text(el.valor.replace('.', ','));
                    $('.valortotprodmd1').text(el.valor.replace('.', ','));
                }

                $('.dv-nomeestab').attr('href', '/lista-restaurante/' + el.restaurante.id);
                $('.nomeestab').text(el.restaurante.nomefantasia);
                el.caminhofoto == '' || el.caminhofoto == null ? $('.imgproduto').hide() : $('.imgproduto').show();
                $('.descricaoProduto').text(el.descricao);
                $('input[name="codrestaurante"]').val(el.restaurante.id)
                $('.imgProduto').attr('src', el.caminhofoto)
                $(".nameprincitem").text(el.nomeproduto);
                $(".nameprincitem").attr('data-id', el.id)
                $(".descProd").text(el.descricao);
                $(".caminhofoto").attr('src', el.caminhofoto.replace('/app', ''));

                if (el.adicionais != null) {

                    adicionais = JSON.parse(el.adicionais)

                    adicionais.forEach(il => {
                        let max = il[0].max > 1 ? 'opções' : 'opção';
                        if (il[0].obrigatorio == "obrigatório") {
                            $('.tudo').append('<div class="divgeralprod1"><div class="divheaderprod1"> <div class="divheaderdown"> <p class="pheaderdown"> ' + il[0].grupo + ' </p> <p class="pheaderqnt">Escolha até <b class="valorqntprodmd1">' + il[0].max + '</b> ' + max + '.</p> </div> <div obgcheck="false" class="divobgcheck"> <div class="divqntmarc"> <p class="qntmarcados">0</p> <p>/</p> <p class="qntobrigatorios">' + il[0].min + '</p> </div> <p class="obgtr" checado="false"> Obrigatório</p> </div> </div></div>')

                        }
                        else {

                            $('.tudo').append('<div class="divgeralprod1"><div class="divheaderprod1"><div class="divheaderdown"><p class="pheaderdown">' + il[0].grupo + '</p> <p class="pheaderqnt">Escolha até <b class="valorqntprodmd1">' + il[0].max + '</b> ' + max + '.</p></div><div class="divcheck"><i class="material-icons iconcheckheader">check</i></div></div></div>')
                        }
                        // NESSE DE BAIXO QUE COLOCA OS PRODUTOS
                        for (let i = 1; il.length > i; i++) {

                            il[i].valor = il[i].valor.replace('&nbsp;', '')

                            $('.divgeralprod1:last').each(function () {
                                $(this).append('<div class="divitemprod"><div class="divnomeitemprod"><p class="pnomeitemprod">' + il[i].nome + '</p><div style="display: flex;"><p class="rsvalcomp">+ R$&nbsp;</p><p class="pvalitemcomp">' + il[i].valor + '</p></div></div><div class="divoptionsprod1"><i class="material-icons iconoptionmenosprod1">remove</i><p class="valoptionprod1">0</p><i class="material-icons iconoptionmaisprod1">add</i></div></div>')
                            })
                        }
                    });
                }
            })
            $('.loadermodal').click()
            $('.loadermodal').hide(100)
        }
    })
})

$(document).on('click', '.editaritem ', function () {
    $('.tipoModal').text("Editar Item");
    $('.textobservacao').val('');
    let adi = JSON.parse(Cookies.get('carrinho'));
    let id = $(this).attr('data-id');
    $('.tudo').empty()
    $.ajax({
        url: '/listarProdutos/' + $(this).attr('data-id'),
        type: 'GET',
        dataType: 'json',
        beforeSend: function () {
            $('.loadermodal').show(100)
        },
        success: function (data) {
            data.forEach(el => {
                if (el.descricao == null) {
                    el.descricao = ''
                }
                $('.dv-nomeestab').attr('href', '/lista-restaurante/' + el.restaurante.id);
                $('.nomeestab').text(el.restaurante.nomefantasia);
                el.caminhofoto == '' || el.caminhofoto == null ? $('.imgproduto').hide() : $('.imgproduto').show();
                $('.descricaoProduto').text(el.descricao);
                $('input[name="codrestaurante"]').val(el.restaurante.id)
                $('.imgProduto').attr('src', el.caminhofoto)
                $(".nameprincitem").text(el.nomeproduto);
                $(".nameprincitem").attr('data-id', el.id)
                $(".descProd").text(el.descricao);
                $(".caminhofoto").attr('src', el.caminhofoto.replace('/app', ''));
                $(".valorprodmd2").text(el.valor.replace('.', ','));
                $(".valorprodmd1").text(el.valor.replace('.', ','));
                $('.valortotprodmd1').text(el.valor.replace('.', ','));

                if (el.adicionais != null) {

                    adicionais = JSON.parse(el.adicionais)

                    adicionais.forEach(il => {
                        if (il[0].obrigatorio == "obrigatório") {
                            $('.tudo').append('<div class="divgeralprod1"><div class="divheaderprod1"> <div class="divheaderdown"> <p class="pheaderdown"> ' + il[0].grupo + ' </p> <p class="pheaderqnt">Escolha até <b class="valorqntprodmd1">' + il[0].max + '</b> opção.</p> </div> <div obgcheck="false" class="divobgcheck"> <div class="divqntmarc"> <p class="qntmarcados">0</p> <p>/</p> <p class="qntobrigatorios">' + il[0].min + '</p> </div> <p class="obgtr" checado="false"> Obrigatório</p> </div> </div></div>')
                        }
                        else {
                            $('.tudo').append('<div class="divgeralprod1"><div class="divheaderprod1"><div class="divheaderdown"><p class="pheaderdown">' + il[0].grupo + '</p> <p class="pheaderqnt">Escolha até <b class="valorqntprodmd1">' + il[0].max + '</b> opção.</p></div><div class="divcheck"><i class="material-icons iconcheckheader">check</i></div></div></div>')
                        }
                        let editAdicionias = JSON.parse(Cookies.get("carrinho"));
                        // NESSE DE BAIXO QUE COLOCA OS PRODUTOS
                        for (let i = 1; il.length > i; i++) {

                            il[i].valor = il[i].valor.replace('&nbsp;', '')

                            $('.divgeralprod1:last').each(function () {
                                $(this).append('<div class="divitemprod"><div class="divnomeitemprod"><p class="pnomeitemprod">' + il[i].nome + '</p><div style="display: flex;"><p class="rsvalcomp">+ R$&nbsp;</p><p class="pvalitemcomp">' + il[i].valor + '</p></div></div><div class="divoptionsprod1"><i class="material-icons iconoptionmenosprod1">remove</i><p class="valoptionprod1">0</p><i class="material-icons iconoptionmaisprod1">add</i></div></div>')
                            })
                        }
                    });


                    let arra;
                    if (!Array.isArray(adi)) {
                      
                        $('.textobservacao').val(adi.observacao);
                        arra = adi.adicio
                    }
                    if (adi.length > 0) {
                        for (let i = 0; i < adi.length; i++) {
                            if (adi[i].id == id) {
                                if(adi[i].observacao=='Sem observação'){
                                    adi[i].observacao='';
                                }
                                
                                $('.textobservacao').val(adi[i].observacao);
                                arra = adi[i].adicio
                            }
                        }
                    }

                    $('.divitemprod').each(function () {
                        for (let i = 0; i < arra.length; i++) {
                            if ($(this).find('.pnomeitemprod').text() == arra[i].nome) {
                                $(this).find('.valoptionprod1').text(arra[i].quantidade);
                                $(this).find('.iconoptionmaisprod1').attr('totalrow', arra[i].totalrowMais);
                                $(this).find('.iconoptionmenosprod1').attr('totalrow', arra[i].totalrowMenos);
                            }
                        }
                    })
                }
                let arra;
                if (!Array.isArray(adi)) {
                    if(adi.observacao == 'Sem observação'){
                        adi.observacao=''
                    }
                    $('.textobservacao').val(adi.observacao);
                    arra = adi.adicio
                }
                if (adi.length > 0) {
                    for (let i = 0; i < adi.length; i++) {
                        if (adi[i].id == id) {
                            if(adi[i].observacao == 'Sem observação'){
                                adi[i].observacao=''
                            }
                            $('.textobservacao').val(adi[i].observacao);
                            arra = adi[i].adicio
                        }
                    }
                }

            })
            $('.loadermodal').click()
            $('.loadermodal').hide(100)

            // VERIFICAR ITENS E LOGICA DO EDITAR
            let somatoria = 0, checkobg = [], vrd = 0, ment = 0;
            $('.tudo').find('.divgeralprod1').each(function () {
                let opc = parseInt($(this).find('.divheaderprod1 > .divheaderdown > .pheaderqnt > .valorqntprodmd1').text());
                $(this).find('.divitemprod').each(function () {
                    if ($(this).find('.valoptionprod1').text() > 0) {
                        $(this).find('.iconoptionmenosprod1, .iconoptionmaisprod1, .valoptionprod1').attr('style', 'display: inline !important');
                        somatoria += parseInt($(this).find('.valoptionprod1').text())
                    }
                })

                $(this).find('.qntmarcados').text(somatoria);

                somatoria >= opc ? $(this).find('.iconoptionmaisprod1').each(function () { $(this).css('opacity', '0.5') }) && $(this).find('.obgtr').attr('checado', true) && $(this).find('.divobgcheck').append('<div class="checkobgtr"><i class="material-icons">check</i></div>') : null;

                somatoria = 0;

                $(this).find('.obgtr').each(function () { checkobg.push($(this).attr('checado')) })
            })
            checkobg.forEach(sts => {
                sts == 'true' ? vrd++ : ment++;
            })
            ment > 0 ? $('.btnconfirmarped').css('opacity', '0.5').css('pointer-events', 'none') : $('.btnconfirmarped').css('opacity', '1').css('pointer-events', 'all');
        }
    })
})

$(document).ready(function () {
    /* Modal > Pedidos */
    $('#modalPedidos3').modal({
        dismissible: false,
        onOpenStart: function () {
            $('.rodape-mobile').hide(200);
        },
        onCloseEnd: function () {
            $('.rodape-mobile').show(200);
        }
    });
})