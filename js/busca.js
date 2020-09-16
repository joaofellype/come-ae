
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

function AddRestaurantes() {
    $.ajax({
        type: 'GET',
        url: '/buscarRestaurante/' + $('.search').val(),
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function (data) {

            $('.tab-rest a').addClass('enviando')
            var itens = `<div class="lazy-restaurantes">
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
                                    </div>
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8"></div>
                                            <div class="ph-col-6 big"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
                                    </div>
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8"></div>
                                            <div class="ph-col-6 big"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
                                    </div>
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8"></div>
                                            <div class="ph-col-6 big"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
                                    </div>
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8"></div>
                                            <div class="ph-col-6 big"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
                                    </div>
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8"></div>
                                            <div class="ph-col-6 big"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
                                    </div>
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8"></div>
                                            <div class="ph-col-6 big"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
                                    </div>
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8"></div>
                                            <div class="ph-col-6 big"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
                                    </div>
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8"></div>
                                            <div class="ph-col-6 big"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
                                    </div>
                                    <div class="ph-col-8-mod">
                                        <div class="ph-row">
                                            <div class="ph-col-10 big"></div>
                                            <div class="ph-col-8"></div>
                                            <div class="ph-col-6 big"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            $('.lista-restaurantes').append(itens);
        },
        success: function (retorno) {
            $('.lazy-restaurantes').remove();
            //Adiciona restaurantes na página
            console.log(retorno)
            retorno.Restaurantes.forEach(estabelecimento => {
            

                
                let funcionamento = '';
                let categoria = estabelecimento.categoria.categoriarestaurante;
                if (estabelecimento.funcionamento != null) {

                    funcionamento = estabelecimento.funcionamento.statusfuncionamento;
                }
                if (estabelecimento.caminhofoto == null) {
                    estabelecimento.caminhofoto = ''
                }
                let registro = `<div class="col l4 m6 s12 item-rest">
                                    <a class="waves-effect waves-light item-restaurante cor-primaria card" href="${'/lista-restaurante/' + estabelecimento.id}">
                                        <img src="/views/img/base.png" data-src="" class="logo-restaurante responsive-img b-lazy">
                                        <div class="dados-restaurante">
                                            <span class="titulo-restaurante">${estabelecimento.nomefantasia}</span>
                                            <div>
                                                <span class="estrela-restaurante">★</span>
                                                <span data-id="${estabelecimento.id}" class="nota-restaurante"></span> • 
                                                <span class="situacao-restaurante">${funcionamento.replace("Restaurante ","").toUpperCase()
                                                }</span> • 
                                            </div>
                                            <span class="categoria-restaurante">${categoria}</span>
                                        </div>
                                    </a>
                                </div>`;
                $('.lista-restaurantes').append(registro);

            });
        
            retorno.avaliacao.forEach(ava => {
                $('.nota-restaurante').each(function () {
                    $(this).attr('data-id') == ava.codrestaurante ? $(this).text(ava.media.substr(0, 3)) : null;
                })
            });

            $('.situacao-restaurante').each(function () {
                $(this).text() == 'ABERTO' ? $(this).addClass('aberto') : $(this).text() == 'FECHADO' ? $(this).addClass('fechado') : $(this).text() == 'PAUSADO' ? $(this).addClass('pausado') : null;
            })

            $('.tab-rest a').removeClass('enviando')

            retorno.Restaurantes.length <= 0 ? $('.lista-restaurantes').append('<div class="busca-vazia"><img src="/views/img/noresult.png"><span>Desculpe, não encontramos nada!</span></div>') : null;

            //Lazyload > Imagens > Restaurantes
            let bLazy = new Blazy({
                error: function (ele, msg) {
                    if (msg === 'missing') {
                        ele.src = '/views/img/base.png'
                    }
                    else if (msg === 'invalid') {
                        ele.src = '/views/img/base.png'
                    }
                }
            });
            $('.tabs li:nth-child(1) > a').html('Restaurante ( ' + retorno.Restaurantes.length + ' )');
        },
        error: function (xhr) {
            $('.lazy-restaurantes').remove();
        }
    });
}

function AddPratos() {
    $.ajax({
        type: 'GET',
        url: '/buscarProdutos/' + $('.search').val(),
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function (data) {
            $('.tab-prat a').addClass('enviando')
            var itens = `<div class="lazy-pratos">
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
                                            <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img">
                                    </div>
                                </div>
                            </div>
                        </div>`;
            $('.lista-pratos').append(itens);
        },
        success: function (retorno) {
            console.log(retorno)
            $('.lazy-pratos').remove();
            //Adiciona pratos na página
            retorno.Produtos.forEach(cardapio => {
                if(cardapio.descricao == null){
                    cardapio.descricao =''
                }
                let restaurante = ''
                if (cardapio.restaurante != null) {
                    restaurante = cardapio.restaurante.nomefantasia;
                };
                let img = cardapio.caminhofoto == '' ? '' : '<img src=' + cardapio.caminhofoto + ' class="img-cardapio responsive-img b-lazy">';
                let tam = cardapio.caminhofoto == '' ? 'style="width: 95%"' : '';

                let registro = `<div class="col l4 m6 s12">
                    <a class="waves-effect waves-light item-cardapio cor-primaria card modal-trigger column" data-id="${cardapio.id}" data-nrestaurante="${restaurante}" data-restaurante="${cardapio.codrestaurante}" href="#modalPedidos3">
                    <div `+ tam + ` class="dados-restaurante">
                        <span class="titulo-cardapio">${cardapio.nomeproduto}</span>
                        <span class="titulo-descricao">${cardapio.descricao}</span>
                        <span class="titulo-valor">R$ ${cardapio.valor.replace('.', ',')}</span>
                    </div>
                        `+ img.replace('/app', "") + `
                    </a>
                    </div>`;
                $('.lista-pratos').append(registro);
            });

            $('.tab-prat a').removeClass('enviando')

            retorno.Produtos.length <= 0 ? $('.lista-pratos').append('<div class="busca-vazia"><img src="/views/img/noresult.png"><span>Desculpe, não encontramos nada!</span></div>') : null;

            //Lazyload > Imagens > Pratos
            let bLazy = new Blazy({
                error: function (ele, msg) {
                    if (msg === 'missing') {
                        ele.src = '/views/img/base.png'
                    }
                    else if (msg === 'invalid') {
                        ele.src = '/views/img/base.png'
                    }
                }
            });
            $('.tabs li:nth-child(2) > a').html('Pratos ( ' + (retorno.Produtos.length) + ' )');
           // $('.tabs li:nth-child(1) > a').html('Restaurante ( ' + retorno.Produtos.length + ' )');
        },
        error: function (xhr) {
            $('.lazy-pratos').remove();
        }
    });
}
$(document).on('click', '.categorias', function () {
    window.location.href = "/categorias/São Luís/" + $(this).attr('data-categoria');
})
//ADICIONAR MAIS RESTAURANTES
$(document).on('click', '.bt-tab', function () {
    $(this).hasClass('enviando') ? null : $(this).addClass('enviando') && $(this).html() == 'Restaurantes' ? $('.lista-restaurantes').empty() && AddRestaurantes() : $('.lista-pratos').empty() && AddPratos();
});

function msgswaltext(titulo, textotxt, tipomsg) {
    Swal.fire({
        title: titulo,
        text: textotxt,
        icon: tipomsg,
        timer: 4000,
        confirmButtonColor: "#800080"
    })
}

function adjustCarrinho() {
    let div = $('.lista-restaurantes'), margin_r = ($(window).width() - (div.offset().left + div.outerWidth()));
    $('.carrinho_fixo').css('width', parseInt(margin_r) - 10 + 'px')
}

$(window).on('resize load', function () {
    $('.carrinho_fixo').show()
    adjustCarrinho();
})

$(document).ready(function () {

    $('.minha-busca').html($('.search').val())

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

    /* EXPANDIR IMAGEM > PEDIDO */

    $('.materialboxed').materialbox();
    /* Tabs > Busca */
    $('.tabs').tabs();

    //Adiciona Restaurantes
     AddRestaurantes();
    //Adiciona Pratos
    AddPratos();
});