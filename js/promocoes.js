
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

function AddPratos(id) {
    let url = window.location.pathname;
    url = url.split("/");

    let tipourl = url[2] == undefined ? 'https://reqres.in/api/users?page=2' : '/listarProdutosPromocao/' + id;

    console.log(tipourl)
    let endereco = JSON.parse(Cookies.get("endereco"));
    $.ajax({
        type: 'GET',
        url: tipourl+'/'+endereco[2] ,
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
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
            $('.lista-pratos').append(itens);
        },
        success: function (retorno) {
            console.log(retorno)
            $('.lazy-pratos').remove();
            retorno.forEach(cardapio => {
                let img = cardapio.caminhofoto == '' ? '' : '<img src=' + cardapio.caminhofoto + ' class="img-cardapio responsive-img b-lazy">';
                let tam = cardapio.caminhofoto == '' ? 'style="width: 95%"' : '';

                let registro = `<div class="col l4 m6 s12">
                        <a class="waves-effect waves-light item-cardapio cor-primaria card modal-trigger column" data-id="${cardapio.id}" data-restaurante="${cardapio.codrestaurante}" data-nomeRestaurante="${cardapio.restaurante.nomefantansia}" href="#modalPedidos3">
                        <div ` + tam + ` class="dados-restaurante">
                            <span class="titulo-cardapio">${cardapio.nomeproduto}</span>
                            <span class="titulo-descricao">${cardapio.descricao}</span>
                            <span class="titulo-valor">R$ ${cardapio.valor.replace('.', ',')}</span>
                            <span class="titulo-valor-promo">R$ ${cardapio.valorpromocional.replace('.', ',')}</span>
                        </div>
                            ` + img + `
                        </a>
                        </div>`;
                $('.lista-pratos').append(registro);
            });
            $('.tab-prat a').removeClass('enviando')

            retorno.length <= 0 ? $('.lista-pratos').append('<div class="busca-vazia"><img src="/views/img/noresult.png"><span>Desculpe, não encontramos nada!</span></div>') : null;

            //Lazyload > Imagens > Pratos
            let bLazy = new Blazy();
        },
        error: function (xhr) {
            $('.lazy-pratos').remove();
        }
    });
}

//ADICIONAR MAIS PROMOCOES
$(document).on('click', '.btn-vejamais-pratos', function () {
    AddPratos();
});

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
    let div = $('.lista-pratos'),
        margin_r = ($(window).width() - (div.offset().left + div.outerWidth()));
    $('.carrinho_fixo').css('width', parseInt(margin_r) - 10 + 'px')
}

$(window).on('resize load', function () {
    $('.carrinho_fixo').show()
    adjustCarrinho();
})

$(document).ready(function () {

    let url = window.location.pathname, id = url.substring(url.lastIndexOf('/') + 1);
    url = url.split("/");

    if (url[2] == undefined) {
        $('.titulo-home:first').text('Nossas promoções');
        //Adiciona Restaurantes - GERAL
        AddPratos();
    } else {
        //Adiciona Restaurantes - DEPENDE DO TIPO
        AddPratos(id);
        $('.titulo-home:first').text(url[2].replace('%20', ' ').replace('rat', 'rát')).addClass('cap');
    }

    $.ajax({
        url: '/ListarPromocoesAtivas',
        type: 'GET',
        cache: false,
        success: (data) => {
            data.forEach(el => {
                if (el.promocao.descricao == "Promoçao de Porcentagem") {
                    $('.promo-porc').attr('href', '/promocoes/porcentagem/b2c6c5e1-8717-4fec-9c74-3b4aa4a0bb27')
                    $('.promo-porc > img').attr('src', '/views/img/promos1.webp')
                }
                if (el.promocao.descricao == "Promoçao de Valor") {
                    $('.promo-porc').attr('href', '/valor/porcentagem/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
                    $('.promo-porc > img').attr('src', '/views/img/promos1.webp')
                }
                if (el.promocao.descricao == "Promoçao de Frete Gratis") {
                    $('.promo-porc').attr('href', '/promocoes/Frete Gratis/40e6215d-b5c6-4896-987c-f30f3678f608')
                    $('.promo-porc > img').attr('src', '/views/img/promos2.webp')
                }
            })
        }
    })

    /* Carousel > PromoÃ§Ãµes */
    $("#promocoes .owl-carousel").owlCarousel({
        items: 4,
        autoWidth: false,
        autoplay: true,
        autoplayTimeout: 8000,
        loop: true,
        margin: 5,
        dots: true,
        lazyLoad: true,
        margin: 2,
        responsive: {
            0: {
                items: 1,
                center: true
            },
            600: {
                items: 3,
            },
            1000: {
                items: 4,
            }
        },
    });
});