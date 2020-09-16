
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

function AddCabecalho() {
    $.ajax({
        type: 'GET',
        url: '/listarRestauranteID/' + $('input[name="codrestaurante"]').val(),
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            var itens = `<div>
                             <div class="ph-item cabecalho-loading">
                                 <div class="ph-col-6-mod">
                                         <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
                                         <div class="ph-row">
                                             <div class="ph-col-8 big"></div>
                                             <div class="ph-col-7 big"></div>
                                             <div class="ph-col-6"></div>
                                         </div>
                                 </div>
                                 <div class="ph-col-6-mod">
                                     <div class="ph-row">
                                         <div class="ph-col-8"></div>
                                         <div class="ph-col-10 big"></div>
                                     </div>
                                 </div>
                                 </div>
                                 <div class="ph-item">
                                     <div class="ph-row">
                                         <div class="ph-col-6 big"></div>
                                     </div>
                                 </div>
                         </div>`;
            $('#cabecalho').append(itens);
        },
        success: function (retorno1) {
            $('#cabecalho').empty();
            console.log(retorno1)

            let statusrest = retorno1.restaurante[0].funcionamento.statusfuncionamento;
            statusrest.replace('Restaurante ', '') != "Aberto" ? $('.btn-finalizar-pedido').remove() : null;

            let segunda = [], terca = [], quarta = [], quinta = [], sexta = [], sabado = [], domingo = [], media;

            if (retorno1.horario) {

                JSON.parse(retorno1.horario.segunda).forEach(horario => {
                    horario == '' || horario == 'Indisp' ? null : segunda.push(horario);
                });
                JSON.parse(retorno1.horario.terca).forEach(horario => {
                    horario == '' || horario == 'Indisp' ? null : terca.push(horario);
                });
                JSON.parse(retorno1.horario.quarta).forEach(horario => {
                    horario == '' || horario == 'Indisp' ? null : quarta.push(horario);
                });
                JSON.parse(retorno1.horario.quinta).forEach(horario => {
                    horario == '' || horario == 'Indisp' ? null : quinta.push(horario);
                });
                JSON.parse(retorno1.horario.sexta).forEach(horario => {
                    horario == '' || horario == 'Indisp' ? null : sexta.push(horario);
                });
                JSON.parse(retorno1.horario.sabado).forEach(horario => {
                    horario == '' || horario == 'Indisp' ? null : sabado.push(horario);
                });
                JSON.parse(retorno1.horario.domingo).forEach(horario => {
                    horario == '' || horario == 'Indisp' ? null : domingo.push(horario);
                })
            } !retorno1.avaliacao[0] ? media = '' : media = retorno1.avaliacao[0].media.substr(0, 3);

            retorno1.restaurante.forEach(info => {
                let descricao;

                info.funcionamento != null ? status = info.funcionamento.statusfuncionamento : null;

                info.descricao == null || info.descricao == undefined ? descricao = '' : descricao = info.descricao;

                let favorito = false;
                let idFavorito;

                if (Cookies.get("tokenUsuario")) {

                    if (retorno1.favoritos.length > 0) {
                        retorno1.favoritos.forEach(fav => {
                            if (fav.codrestaurante == info.id) {
                                idFavorito = retorno1.favoritos[0].id
                                favorito = true
                            }
                        });
                    }
                }

                let retorno = `<div class="row info-cabecalho">
                                    <div class="info-bloco-primario">
                                        <img src="/views/img/base.png" data-src="${info.caminhofoto}" class="img-restaurante responsive-img b-lazy">
                                        <div>
                                            <div style="display: flex">
                                                <span class="titulo-nomerestaurante">${info.nomefantasia}</span>
                                                <i data-id="${idFavorito}" data-favorito="` + favorito + `" class="material-icons rest-favorito">favorite_border</i>
                                            </div>
                                            <div>
                                                <span class="estrela-inforest">★</span>
                                                <span class="nota-inforest">${media}</span> •
                                                <span class="status-inforest">${status.replace('Restaurante ', '')}</span> •
                                            </div>
                                            <span class="especialidade-inforest">${info.categoria.categoriarestaurante}</span>
                                        </div>
                                    </div>
                                    <div class="info-bloco-secundario">
                                        <span>Horário de entrega</span>
                                        <div>
                                            <div>
                                                <div>
                                                    <span>Segunda</span>
                                                    <span>Terça</span>
                                                    <span>Quarta</span>
                                                    <span>Quinta</span>
                                                </div>
                                                <div>
                                                    <span>${segunda.toString().replace(',', ' às ')}</span>
                                                    <span>${terca.toString().replace(',', ' às ')}</span>
                                                    <span>${quarta.toString().replace(',', ' às ')}</span>
                                                    <span>${quinta.toString().replace(',', ' às ')}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    <span>Sexta</span>
                                                    <span>Sábado</span>
                                                    <span>Domingo</span>
                                                </div>
                                                <div>
                                                    <span>${sexta.toString().replace(',', ' às ')}</span>
                                                    <span>${sabado.toString().replace(',', ' às ')}</span>
                                                    <span>${domingo.toString().replace(',', ' às ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    <span class="descricao-restaurante">${descricao}</span>
                                    <div class="div-col-hora">
                                        <ul class="collapsible">
                                            <li>
                                                <div class="collapsible-header"><i class="material-icons">arrow_drop_down</i>
                                                <span>Horário de Entrega</span>
                                                </div>
                                                <div class="collapsible-body">
                                                    <div class="info-collapsible-hora">
                                                    <div>
                                                        <div>
                                                            <div>
                                                                <span>Segunda</span>
                                                                <span>Terça</span>
                                                                <span>Quarta</span>
                                                                <span>Quinta</span>
                                                            </div>
                                                            <div>
                                                                <span>${segunda.toString().replace(',', ' às ')}</span>
                                                                <span>${terca.toString().replace(',', ' às ')}</span>
                                                                <span>${quarta.toString().replace(',', ' às ')}</span>
                                                                <span>${quinta.toString().replace(',', ' às ')}</span>
                                                            </div>
                                                            </div>
                                                            <div>
                                                                <div>
                                                                    <span>Sexta</span>
                                                                    <span>Sábado</span>
                                                                    <span>Domingo</span>
                                                                </div>
                                                                <div>
                                                                    <span>${sexta.toString().replace(',', ' às ')}</span>
                                                                    <span>${sabado.toString().replace(',', ' às ')}</span>
                                                                    <span>${domingo.toString().replace(',', ' às ')}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                        </ul>
                                    </div>`;
                $('#cabecalho').append(retorno);
            });

            $('.rest-favorito').attr('data-favorito') == 'true' ? $('.rest-favorito').html('favorite') : $('.rest-favorito').html('favorite_border');

            let fav = $('.status-inforest');
            fav.html() == 'Aberto' ? fav.addClass('aberto') : fav.html() == 'Fechado' ? fav.addClass('fechado') : fav.addClass('pausado');

            let bLazy = new Blazy();
            $('.collapsible').collapsible();

            AddRestaurantes();
        },
        error: function (xhr) {
            $('#cabecalho').empty();
        }
    });
}

function AddRestaurantes() {
    $.ajax({
        type: 'GET',
        url: '/listarCategoriaProdutoRestaurante' + '/' + $('input[name="codrestaurante"]').val(),
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (retorno) {
            //Adiciona os nomes das categorias no corpo
            for (var i = 0; i < retorno.length; i++) {
                $('.lista-restaurantes').append('<div id=' + retorno[i].categoriaproduto + ' class="categoria-cardapio">' + retorno[i].categoriaproduto + '</div><div data-nome="' + retorno[i].categoriaproduto + '" class="group-cardapio"></div>');
            }

            AddProdutos();
        },
        error: function (xhr) { }
    });
}

function AddProdutos() {
    $.ajax({
        type: 'GET',
        url: '/listarProdutoRestaurant' + '/' + $('input[name="codrestaurante"]').val(),
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            var itens = `<div class="lazy-restaurantes">
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8 big"></div>
                                            <div class="ph-col-5 big"></div>
                                        </div>
                                    </div>
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8 big"></div>
                                            <div class="ph-col-5 big"></div>
                                        </div>
                                    </div>
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8 big"></div>
                                            <div class="ph-col-5 big"></div>
                                        </div>
                                    </div>
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8 big"></div>
                                            <div class="ph-col-5 big"></div>
                                        </div>
                                    </div>
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8 big"></div>
                                            <div class="ph-col-5 big"></div>
                                        </div>
                                    </div>
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8 big"></div>
                                            <div class="ph-col-5 big"></div>
                                        </div>
                                    </div>
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
                                    </div>
                                </div>
                            </div>
                        </div>`;
            $('.lista-restaurantes').append(itens);
        },
        success: function (retorno) {
            $('.lazy-restaurantes').remove();
            $('.group-cardapio').each(function () {
                retorno.forEach(cardapio => {
                    let descricao;
                    if (cardapio.descricao == null) {
                        descricao = ''
                    }
                    else {
                        descricao = cardapio.descricao
                    }
                    let valor;
                    if(cardapio.valorpromocional !=null){
                        valor = cardapio.valorpromocional
                    }else{
                        valor = cardapio.valor
                    }
                    if (cardapio.categoria.categoriaproduto == $(this).attr('data-nome')) {
                        let img = cardapio.caminhofoto == '' ? '' : '<img src="/views/img/base.png" data-src=' + cardapio.caminhofoto.replace('/app', '') + ' class="img-cardapio responsive-img b-lazy">';
                        let tam = cardapio.caminhofoto == '' ? 'style="width: 95%"' : '';

                        let registro = `<div class="col l4 m6 s12">
                                        <a class="waves-effect waves-light item-cardapio cor-primaria card modal-trigger column" data-id="${cardapio.id}" data-restaurante="${cardapio.codrestaurante}" href="#modalPedidos3">
                                            <div ` + tam + ` class="dados-restaurante">
                                                <span class="titulo-cardapio">${cardapio.nomeproduto}</span>
                                                <span class="titulo-descricao">${descricao}</span>
                                                <span class="titulo-valor">R$ ${valor.replace('.', ',')}</span>
                                            </div>
                                            ` + img + `
                                        </a>
                                    </div>`;
                        $(this).append(registro);
                    }
                })
            })
            let bLazy = new Blazy();
            $('.group-cardapio').each(function () {
                $(this).find('.col.l4.m6.s12').length <= 0 ? $(this).prev().remove() && $(this).remove() : $('#filtrobusca').append('<li><a href="#' + $(this).prev().attr('id') + '">' + $(this).prev().html() + '</a></li>');
            })
            $('.lista-restaurantes').each(function () {
                $(this).find('div').length <= 0 ? $(this).append('<div class="dv-vazio-cardapio"><span>Não há produtos por enquanto</span></div>') : null;
            })
        },
        error: function (xhr) {
            $('.lazy-restaurantes').remove();
            $('.lista-restaurantes').remove()
            $('<div class="row"><p class="center purple-text text-darken-2"><b>Erro ao carregar produtos, tente novamente mais tarde!</b></p><div>').appendTo('#restaurantes');
        }
    });
}

function AddAvaliacoes() {
    $.ajax({
        type: 'GET',
        url: '/listarAvaliacoes/' + $('input[name="codrestaurante"]').val() + '/' + $('.btn-vejamais-avaliacoes').attr('data-pagina'),
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            var itens = `<div class="lazy-avaliacoes">
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-avaliacoes card">
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-8 big"></div>
                                            <div class="ph-col-12"></div>
                                        </div>
                                    </div>
                                    <div class="ph-col-4-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-8 big"></div>
                                            <div class="ph-col-8"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-avaliacoes card">
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-8 big"></div>
                                            <div class="ph-col-12"></div>
                                        </div>
                                    </div>
                                    <div class="ph-col-4-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-8 big"></div>
                                            <div class="ph-col-8"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-avaliacoes card">
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-8 big"></div>
                                            <div class="ph-col-12"></div>
                                        </div>
                                    </div>
                                    <div class="ph-col-4-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-8 big"></div>
                                            <div class="ph-col-8"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            $('.btn-vejamais-avaliacoes').hide();
            $('.lista-avaliacoes').append(itens);
        },
        success: function (retorno) {
            $('.btn-vejamais-avaliacoes').attr('data-pagina', retorno.pagina)
            $('.btn-vejamais-avaliacoes').show();
            $('.lazy-avaliacoes').remove();

            retorno.ava.forEach(avaliacao => {
                let a, m, d, normal = avaliacao.createdAt;
                d = normal.substr(8, 2);
                m = normal.substr(5, 2);
                a = normal.substr(2, 2);
                h = normal.substr(14, 5);
                normal = d + '/' + m + '/' + a;
                let registro = `<div class="col l4 m6 s12">
                                    <a class="waves-effect waves-light item-avaliacoes cor-primaria card" href="${avaliacao.id}">
                                        <div class="dados-avaliacoes-esquerdo">
                                            <div>
                                                <span class="titulo-avaliacoes">${avaliacao.usuario.nomeusuario}</span>
                                                <span class="titulo-feedback">${avaliacao.avaliacao}</span>
                                            </div>
                                        </div>

                                        <div class="dados-avaliacoes-direito">
                                            <div>
                                                <span class="estrela-avaliacoes">★</span>
                                                <span class="nota-avaliacoes">${avaliacao.estrelas}</span>
                                            </div>
                                            <span class="titulo-data">${normal}</span>
                                        </div>
                                    </a>
                                </div>`;
                $('.lista-avaliacoes').append(registro);
            });

            let bLazy = new Blazy();
            if (retorno.ava.length <= 0) {
                $('.btn-vejamais-avaliacoes').hide()
            }

            $('.lista-avaliacoes').find('.col.l4.m6.s12').length <= 0 ? $('.lista-avaliacoes').append('<div class="dv-vazio-ava"><span>Este estebelecimento não tem avaliações</span></div>') && $('.btn-vejamais-avaliacoes').hide() : null;

        },
        error: function (xhr) {
            $('.btn-vejamais-avaliacoes').show();
            $('.lazy-avaliacoes').remove();
        }
    });
}

//ADICIONAR MAIS AVALIAÇÕES
$(document).on('click', '.btn-vejamais-avaliacoes', function () {
    AddAvaliacoes();
});

// LEVA ATÉ A ESCOLHA DO FILTRO POR CATEGORIA
$(document).on('click', '#filtrobusca a[href^="#"]', function (event) {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top - 100
    }, 300);
});
// PERMITE VER MAIS DA > DESCRIÇÃO e NOME < DO RESTAURANTE, CASO ESTEJAM EM ELLIPSIS
$(document).on('click', '.descricao-restaurante, .titulo-nomerestaurante', function () {
    $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active')
})
// MUDA SETA DO HORARIO DE ENTREGA QUANDO EM TELA PEQUENA
$(document).on('click', '.div-col-hora', function () {
    $(this).find('li').hasClass('active') ? $(this).find('.collapsible-header i').html('arrow_drop_up') : $(this).find('.collapsible-header i').html('arrow_drop_down')
})

function adjustCarrinho() {
    let div = $('.lista-restaurantes'),
        margin_r = ($(window).width() - (div.offset().left + div.outerWidth()));
    $('.carrinho_fixo').css('width', parseInt(margin_r) - 10 + 'px')
}

$(window).on('resize load', function () {
    $('.carrinho_fixo').show()
    adjustCarrinho();
})

// CORAÇÃO FAVORITO
$(document).on('click', '.rest-favorito', function () {

    if (Cookies.get('tokenUsuario')) {
        if ($(this).attr('data-favorito') == 'false') {

            $.ajax({
                type: 'POST',
                url: '/favoritos',
                cache: false,
                data: {
                    codrestaurante: $('input[name="codrestaurante"]').val()
                },
                beforeSend: () => {
                    $(this).addClass('disabled');
                },
                success: () => {
                    $(this).removeClass('disabled');
                    $(this).attr('data-favorito') == 'true' ? $(this).html('favorite_border') && $(this).attr('data-favorito', 'false') : $(this).html('favorite') && $(this).attr('data-favorito', 'true');
                },
                error: () => {

                }
            })
        } else {
            let id = $(this).attr("data-id")

            $.ajax({
                type: 'PUT',
                url: '/deletarFavoritos/' + id,
                cache: false,
                beforeSend: () => {
                    $('.ul-favoritos').empty();
                    $('.ul-favoritos').append('<div class="modal-fav-aguarde kit-flex"><span>Aguarde...</span></div>');
                    $(this).addClass('disabled');
                },
                success: () => {
                    $(this).removeClass('disabled');
                    $(this).attr('data-favorito') == 'false' ? $(this).html('favorite') && $(this).attr('data-favorito', 'true') : $(this).html('favorite_border') && $(this).attr('data-favorito', 'false');
                }
            })
        }

    } else {
        msgswal('Erro', 'Você deve logar antes de favoritar um restaurante', 'error');
    }
})

// EXECUTAR O VER MAIS AUTOMATICO - AVALIACOES
$.fn.isInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
};
$(window).on('resize scroll ready', function () {
    let obj = $('.btn-vejamais-avaliacoes');
    if (obj.css('display') == 'none') {
        return false;
    } else {
        obj.each(function () {
            $(this).isInViewport() ? obj.click() : null;
        });
    }
});

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

    /* Carousel > Vai Comer o Que? */
    $("#vai-comer .owl-carousel").owlCarousel({
        items: 10,
        autoWidth: false,
        autoplay: true,
        autoplayTimeout: 12000,
        loop: true,
        dots: true,
        lazyLoad: true,
        responsive: {
            0: {
                items: 3,
            },
            600: {
                items: 6,
            },
            1000: {
                items: 10,
            }
        }
    });
    $(document).on('click', '.categorias', function () {
        window.location.href = "/categorias/São Luís/" + $(this).attr('data-categoria');
    })

    /* EXPANDIR IMAGEM > PEDIDO */
    $('.materialboxed').materialbox();

    /* Collapsible Horario Entrega */
    $('.collapsible').collapsible();

    /* Dropdown filtro / busca */
    $('#btn-filtrobusca').dropdown({
        coverTrigger: false,
        onOpenStart: function () {
            $('#filtro-busca #btn-filtrobusca').addClass('active');
        },
        onCloseStart: function () {
            $('#filtro-busca #btn-filtrobusca').removeClass('active');
        }
    });
    $(document).on('click', '.rest-favorito', function () {

    })

    //Adiciona Cabeçalho
    AddCabecalho();

});