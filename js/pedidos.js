// CONFIRMAÇÃO CROP IMAGEM USER
$('#btninput').on('change', function (e) {
        $('#imgInside').attr('src', e.target.result);
        $('#btninput').attr('src', e.target.result);

        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
        var uploadfile = $("input[name=imgPerfil]")[0].files[0];
        var formData = new FormData();
        formData.append("imgPerfil", uploadfile);
        console.log('uploadfile', uploadfile, uploadfile.type, e.target.result);
        $.ajax({
            url: '/cadastrarFotoProduto',
            method: 'POST',
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            beforeSend: () => {
                $('.loaderpedido').show(200);
            },
            success: function (data) {
                $('.loaderpedido').hide(200);
                $("input[name='fotocaminho']").val(data.message);
                msgswal('Sucesso', 'Imagem enviada', 'success');
            },
            error: function (msg) {
                $('.loaderpedido').hide(200);
            }
        })

        function imageIsLoaded(e) {
            $('#imgInside').attr('src', e.target.result);
            $('#btninput').attr('src', e.target.result);
        }
});

$(document).on('click', '.btnfooter-recebi', function () {
    Swal.fire({
        title: 'Confirme',
        text: 'Realmente recebeu o pedido?',
        confirmButtonColor: '#800080',
        cancelButtonColor: '#333',
        cancelButtonText: 'Não',
        showCancelButton: true,
        icon: 'warning'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: '/finalizarPedido/' + $(this).attr('data-id'),
                type: 'PUT',
                cache: false,
                beforeSend: () => {
                    $('.btnfooter-recebi').attr('disabled', 'disabled').html('Aguarde...')
                },
                success: () => {
                    Swal.fire({
                        title: 'Confirmação',
                        text: 'Se possível, volte mais tarde para avaliar o seu pedido nesta mesma tela',
                        timer: 6000,
                        confirmButtonColor: '#800080',
                        icon: 'success'
                    }).then(() => {
                        $('.btnfooter-recebi').removeAttr('disabled').html('Recebi o produto');
                        $('#dadosPedido').modal('close');
                    })
                }
            })
        }
    })
})

$(document).on('click', '.pedidos', function () {
    let statuspedido = $(this).attr('data-status');

    statuspedido == 'Pendente' ? $('.btnfooter').show() && $('.btnfooter-recebi, .btnfooter-msg').hide() : statuspedido == 'Concluido' ? $('.btnfooter-msg').html('Concluido').show() && $('.btnfooter-recebi, .btnfooter').hide() : statuspedido == 'Cancelado' ? $('.btnfooter-msg').html('Cancelado').show() && $('.btnfooter-recebi, .btnfooter').hide() : statuspedido == 'Em entrega' ? $('.btnfooter-recebi').show() && $('.btnfooter-msg, .btnfooter').hide() : statuspedido == 'Em Preparacao' ? $('.btnfooter-recebi, .btnfooter').hide() && $('.btnfooter-msg').html('Em Preparação').show() : null;
})

$(document).on('click', '.btn-comentar', function () {
    let stars = $(this).attr('stars'),
        comentario = $('#area-avaliacao').val()
    if (stars <= 0) {
        msgswal('Ação inválida!', 'Não é possível avaliar sem antes selecionar as estrelas', 'error')
    } else {
        Swal.fire({
            title: 'Avaliado!',
            text: 'A sua avaliação foi enviada',
            timer: 3500,
            icon: 'success',
            confirmButtonColor: '#800080'
        }).then((result) => {
            $('#dadosPedido').modal('close')
            $.ajax({
                type: 'POST',
                url: '/cadastrarAvaliacao',
                data: {
                    restaurante: $('.verCardapio').attr('data-restaurante'),
                    pedido: $('.nmrPedido').html(),
                    nota: stars,
                    comentario: comentario
                },
                cache: false,
                success: function (data) {
                    result.value ? listarPedidos() : null;
                }
            })
        })

    }
})

function msgswal(title, text, type) {
    Swal.fire({
        title: title,
        text: text,
        timer: 3500,
        icon: type,
        confirmButtonColor: '#800080'
    })
}

$(document).on('click', '.pedidos', function () {

    $.ajax({
        url: '/listarPedidoUsuario/' + $(this).attr('data-id'),
        dataType: 'json',
        beforeSend: function () {
            $('.loaderpedido').show()
        },
        success: (data) => {


            let a = JSON.parse(data.pedidos.produtos), adicionais = JSON.parse(data.pedidos.adicionais);
            let valorTotal = 0, valorSub = 0;

            if (data.avaliacao == null && data.pedidos.statuspedido.statuspedido == 'Concluido') {
                $('.grupo-avaliacoes').show()
                $('#jRate').css('background-color', '#c791c7').css('box-shadow', '0px 0px 3px 1px purple')
                $('#area-avaliacao, .btn-comentar').prop('disabled', false);
                Rate(false, 0);
                $('.btn-comentar').show()
            } else if (data.pedidos.statuspedido.statuspedido != 'Concluido') {
                $('.grupo-avaliacoes').hide()
            } else {
                $('.grupo-avaliacoes').show()
                $('#jRate').css('background-color', '#dfdfdf').css('box-shadow', 'none');
                $('#area-avaliacao, .btn-comentar').prop('disabled', true)
                $('#area-avaliacao').val(data.avaliacao.avaliacao)
                Rate(true, data.avaliacao.estrelas)
                $('.btn-comentar').hide()
            }

            for (let i = 0; i < a.length; i++) {
                $('.produtos').append('<div style="display: flex; justify-content: space-between; font-weight: bold;">' +
                    '<p class="nomeProduto" style="padding-right: 10px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width: 75%; margin: 0;">' + a[i].produto + '' +
                    '</p> <p class="valorproduto" style="margin: 0">' + a[i].valor + '</p> </div> <p class="adicionaisProdutos" style="color: grey; margin: 0;">' + adicionais[i] + '</p>');
            }
            $('.nomeRestaurante').text(data.pedidos.restaurante.nomefantasia);
            $('.valorTaxaPedido').text(data.pedidos.taxaentrega.replace(".", ","));
            $('.verCardapio').attr('onclick', 'window.location.href="/lista-restaurantes/' + data.pedidos.endereco.cidade + '/' + data.pedidos.restaurante.id + '"').attr('data-restaurante', data.pedidos.restaurante.id);

            $('.valorproduto').each(function () {
                valorTotal += parseFloat($(this).text().replace("R$ ", '').replace(',', '.'));
                valorSub += parseFloat($(this).text().replace("R$ ", '').replace(',', '.'));
            })

            if (data.pedidos.pedidoacancelar == true) {
                $('.btnfooter').attr('disabled', 'disabled').html('Em análise');
            } else {
                $('.btnfooter').removeAttr('disabled').html('Cancelar');
            }

            valorTotal = valorTotal - parseFloat($('.valorCupomPedido').text().replace('R$ ', '').replace(',', '.').replace('- ', '')) + parseFloat($('.valorTaxaPedido').text().replace(',', '.'));
            $('.valorTotalPedido').text('R$ ' + valorTotal.toFixed(2).replace('.', ','))
            $('.valorProdutoSub').text('R$ ' + valorSub.toFixed(2).replace('.', ','))
            $('.enderecoPedido').text(data.pedidos.endereco.rua + ', Nº: ' + data.pedidos.endereco.nmrcasa + ', ' + data.pedidos.endereco.bairro);
            $('.nmrPedido').text(data.pedidos.id);
            let dataped = data.pedidos.createdAt;
            $('.dataPedido').text((dataped).substr(8, 2) + '/' + (dataped).substr(5, 2) + '/' + (dataped).substr(0, 4));
            $('.stspedido').text(data.pedidos.statuspedido.statuspedido);
            $('.tipoPagamento').text(data.pedidos.tipopagamento.tipopagamento);
            $('.btnfooter, .btnfooter-recebi').attr('data-id', $('.nmrPedido').html())

            $('.loaderpedido').hide(200)
        }
    })
})

$(document).on('click', '.btnsair', function () {
    swal.fire({
        title: 'Deseja realmente sair?',
        text: 'Confirmar encerrará sua sessão',
        showCancelButton: true,
        cancelButtonText: 'Não',
        confirmButtonText: 'Sim',
        icon: 'warning',
        confirmButtonColor: "#800080",
        cancelButtonColor: "#333"
    }).then((result) => {
        if (result.value) {
            // encerrar sessao
        }
    })
})

function Rate(bloqueio, estrelas) {
    $("#jRate").jRate({
        rating: estrelas,
        onSet: function (rating) {
            // msgswal('Selecionado!', 'Você selecionou: ' + rating + ' estrela(s)', 'success');
            $('.btn-comentar').attr('stars', rating);
            rating <= 2 ? $('.dv-geral-imguser').show(200) : $('.dv-geral-imguser').hide(200) && $('#imgInside').attr('src','/views/img/base.png');
        },
        readOnly: bloqueio,
        minSelected: 0,
        min: 0,
        max: 5,
        width: 30,
        height: 30,
        shapeGap: "5px",
        precision: 1,
        startColor: "gold",
        endColor: "gold",
    });
}

// TODOS EXCETO -> CONCLUIDO E CANCELADO
function listarPedidos() {
    $('.tabspedidos .row, .tabspedidos2 .row').empty();
    $.ajax({
        type: 'GET',
        url: '/listarPedidousuario',
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $('.tab-ped').addClass('processando');
            var itens = `<div class="lazy-pedidos">
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-pedidos card">
                                    <div class="ph-col-12">
                                        <div style="justify-content: center" class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div style="margin-bottom: 25px" class="ph-col-12"></div>
                                            <div style="height: 60px; margin-bottom: 20px" class="ph-col-12 big"></div>
                                            <div style="margin: auto; margin-right: 0;" class="ph-col-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-pedidos card">
                                    <div class="ph-col-12">
                                        <div style="justify-content: center" class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div style="margin-bottom: 25px" class="ph-col-12"></div>
                                            <div style="height: 60px; margin-bottom: 20px" class="ph-col-12 big"></div>
                                            <div style="margin: auto; margin-right: 0;" class="ph-col-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-pedidos card">
                                    <div class="ph-col-12">
                                        <div style="justify-content: center" class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div style="margin-bottom: 25px" class="ph-col-12"></div>
                                            <div style="height: 60px; margin-bottom: 20px" class="ph-col-12 big"></div>
                                            <div style="margin: auto; margin-right: 0;" class="ph-col-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-pedidos card">
                                    <div class="ph-col-12">
                                        <div style="justify-content: center" class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div style="margin-bottom: 25px" class="ph-col-12"></div>
                                            <div style="height: 60px; margin-bottom: 20px" class="ph-col-12 big"></div>
                                            <div style="margin: auto; margin-right: 0;" class="ph-col-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-pedidos card">
                                    <div class="ph-col-12">
                                        <div style="justify-content: center" class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div style="margin-bottom: 25px" class="ph-col-12"></div>
                                            <div style="height: 60px; margin-bottom: 20px" class="ph-col-12 big"></div>
                                            <div style="margin: auto; margin-right: 0;" class="ph-col-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-pedidos card">
                                    <div class="ph-col-12">
                                        <div style="justify-content: center" class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div style="margin-bottom: 25px" class="ph-col-12"></div>
                                            <div style="height: 60px; margin-bottom: 20px" class="ph-col-12 big"></div>
                                            <div style="margin: auto; margin-right: 0;" class="ph-col-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-pedidos card">
                                    <div class="ph-col-12">
                                        <div style="justify-content: center" class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div style="margin-bottom: 25px" class="ph-col-12"></div>
                                            <div style="height: 60px; margin-bottom: 20px" class="ph-col-12 big"></div>
                                            <div style="margin: auto; margin-right: 0;" class="ph-col-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-pedidos card">
                                    <div class="ph-col-12">
                                        <div style="justify-content: center" class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div style="margin-bottom: 25px" class="ph-col-12"></div>
                                            <div style="height: 60px; margin-bottom: 20px" class="ph-col-12 big"></div>
                                            <div style="margin: auto; margin-right: 0;" class="ph-col-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-pedidos card">
                                    <div class="ph-col-12">
                                        <div style="justify-content: center" class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div style="margin-bottom: 25px" class="ph-col-12"></div>
                                            <div style="height: 60px; margin-bottom: 20px" class="ph-col-12 big"></div>
                                            <div style="margin: auto; margin-right: 0;" class="ph-col-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            $('.tabspedidos .row').append(itens);
            $('.tabspedidos2 .row').append(itens);
        },
        success: function (data) {
            Cookies.set('tokenUsuario',data.refreshToken)
            $('.lazy-pedidos').remove();

            data.pedidos.forEach(el => {

                let produtos = '';
                JSON.parse(el.produtos).forEach(il => { produtos = il.produto });
                if (el.produtos == null) { el.produtos = '' }

                let tst = [], rows = [], cells = [];

                JSON.parse(el.produtos).forEach(aa => { tst.push(aa) })
                var regExp = /\(([^)]+)\)/;

                for (var i = 0; i < tst.length; i++) {
                    cells = [];
                    var matches = regExp.exec(tst[i].produto)
                    cells.push('<div class="dv-itemcard-ped kit-flex grey-text"><span>' + matches[1].replace('x', '') + '</span><span>' + (tst[i].produto).substr(4) + '</span></div>');
                    rows.push(cells.join(''));
                }

                if (el.statuspedido.statuspedido == 'Cancelado' || el.statuspedido.statuspedido == 'Concluido') {
                    let sts = el.statuspedido.statuspedido == 'Cancelado' ? 'cancelado' : 'concluido';
                    $('.tabspedidos2').find('.row').append('<div class="column"><div class="card"><div class="card-content corpo-cardped"><div class="dv-top-cardped kit-flex;"><div class="img-cardped"><img src="/views/img/base.png" data-src="" class="responsive-img circle b-lazy"></div><div class="dv-restinfo-ped"><p class="fonte-primaria">' + el.restaurante.nomefantasia + '</p><div class="kit-flex grey-text dv-situ"><p class="sts-ped ' + sts + ' ">' + el.statuspedido.statuspedido + '</p><p> ● </p><p>' + el.id + '</p></div></div></div><div class="divider"></div><div class="dv-box-itenscard">' + rows.join('') + '</div><div class="divider"></div><div class="dv-avaliacao-statuscard"><span class="grey-text">Prazo de avaliação finalizado</span></div><div class="divider"></div><div class="dv-horario-cardped"><span class="grey-text">● ' + moment(el.createdAt).format('DD/MM/YYYY - HH:mm') + 'h</span></div><div class="divider"></div><div class="dv-btn-actions-card kit-flex"><a class="cor-secundaria kit-flex disabled">Acompanhar</a><div></div><a class="cor-secundaria kit-flex pedidos modal-trigger" data-status="' + el.statuspedido.statuspedido + '" data-id="' + el.id + '" href="#dadosPedido">Detalhes</a></div></div></div></div>')

                } else {
                    let sts = el.statuspedido.statuspedido == 'Em entrega' ? 'em-entrega' : el.statuspedido.statuspedido == 'Confirmado' ? 'confirmado' : '';
                    $('.tabspedidos').find('.row').append('<div class="column"><div class="card"><div class="card-content corpo-cardped"><div class="dv-top-cardped kit-flex;"><div class="img-cardped"><img src="/views/img/base.png" data-src="" class="responsive-img circle b-lazy"></div><div class="dv-restinfo-ped"><p class="fonte-primaria">' + el.restaurante.nomefantasia + '</p><div class="kit-flex grey-text dv-situ"><p class="sts-ped ' + sts + '">' + el.statuspedido.statuspedido + '</p><p> ● </p><p>' + el.id + '</p></div></div></div><div class="divider"></div><div class="dv-box-itenscard">' + rows.join('') + '</div><div class="divider"></div><div class="dv-avaliacao-statuscard"><span class="grey-text">Prazo de avaliação finalizado</span></div><div class="divider"></div><div class="dv-horario-cardped"><span class="grey-text">● ' + moment(el.createdAt).format('DD/MM/YYYY - HH:mm') + 'h</span></div><div class="divider"></div><div class="dv-btn-actions-card kit-flex"><a class="cor-secundaria kit-flex" href="/acompanhar/' + el.id + '">Acompanhar</a><div></div><a class="cor-secundaria kit-flex pedidos modal-trigger" data-status="' + el.statuspedido.statuspedido + '" data-id="' + el.id + '" href="#dadosPedido">Detalhes</a></div></div></div></div>');
                }
            })

            var bLazy = new Blazy();

            let contF = 0, contA = 0, msgvazio = '<div class="card-vazio"><span>Nenhum pedido encontrado nesta categoria</span><br><span onclick="window.location.href=`/comeae`" >Faça novos pedidos</span><div></div>';
            $('.tabspedidos2 > .row').each(function () {
                contF = $(this).find('.pedidos').length
            })
            $('.tabspedidos > .row').each(function () {
                contA = $(this).find('.pedidos').length
            })
            contF == 0 ? $('.tabspedidos2 > .row').append(msgvazio) : null;
            contA == 0 ? $('.tabspedidos > .row').append(msgvazio) : null;
        }
    });
}

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

$(document).on('click', '.btnfooter', function () {
    $('.bt-enviar-cancel').attr('data-id', $(this).attr("data-id"))
    $('#modalCancelar').modal('open');
})

$(document).on('click', '.bt-enviar-cancel', function () {


    if ($('.txta-cancel').val() == "") {
        msgswal('Erro', 'Você deve informar o motivo do cancelamento', 'error');
    } else {
        $.ajax({
            type: 'PUT',
            url: '/pedidosAcancelarUsuarios/' + $(this).attr("data-id"),
            cache: false,
            data: { solicitacao: $('.txta-cancel').val() },
            beforeSend: () => {
                $(this).attr('disabled', 'disabled');
            },
            success: (data) => {
                msgswal('Confirmação', 'Sua solicitação foi enviada', 'success');
                $('.txta-cancel').val('');
                $(this).removeAttr('disabled');
                $('#modalCancelar').modal('close');
            }
        })
    }
})

$(document).ready(function () {

    var socket = io('https://comeaee.herokuapp.com');
    socket.emit("entrar pedidos", $('.cod').val(), function (valido) {

    });
    socket.on('atualizar pedidos', function (message) {

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
    listarPedidos()
    let qntped = 0;
    $('.tabspedidos').find('.column').each(function (x) {
        qntped++;
    })

    $('#dadosPedido').modal({
        onOpenStart: function () {
            $('.tooltipped').tooltip();
            $('.rodape-mobile').css('z-index', '99');
            $('.dv-geral-imguser').hide(0);
        },
        onCloseStart: function () {
            $('.grupo-avaliacoes #jRate').empty()
            $('#area-avaliacao').val('')
            $('.btn-comentar').attr('stars', 0)
            $('.produtos').empty()
            $('.rodape-mobile').css('z-index', '9999')
            listarPedidos();
        }
    })

    $('#modalCancelar').modal({
        dismissible: true
    });

    $('#sidenavScreen').sidenav({
        onOpenStart: function () {
            $('.rodape-mobile').css('z-index', '99')
        },
        onCloseStart: function () {
            setTimeout(function () {
                $('.rodape-mobile').css('z-index', '9999')
            }, 400)
        }
    });

    // DROPDOWN EXIT
    $('.dropSair').dropdown({
        hover: true,
        coverTrigger: false,
        onOpenStart: function () {
            $('.dropSair > i').html('expand_less')
        },
        onCloseStart: function () {
            $('.dropSair > i').html('expand_more')
        }
    })

    $('.tabs_pedidos').tabs();

    // // INICIALIZADOR CROP IMAGEM
    // $image_crop = $('#image_demo').croppie({
    //     enableExif: true,
    //     viewport: {
    //         width: 180,
    //         height: 180,
    //         type: 'circle', //square
    //         quality: 1,
    //     },
    //     boundary: {
    //         width: 290,
    //         height: 290,
    //         enforceBoundary: true
    //     }
    // });

    // // MODAL > CROP > IMG USER
    // $('#modalCropUser').modal({
    //     onOpenStart: function () {
    //         $('.rodape-mobile').css('z-index', '99')
    //     },
    //     onCloseStart: function () {
    //         $('.rodape-mobile').css('z-index', '9999')
    //     }
    // })

});