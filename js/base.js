// MSG SWAL COM FUNCAO
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

// ADICIONAR RESTAURANTES
function AddRestaurantes() {
    $('.btn-vejamais-restaurantes').addClass('processando');
    let local = JSON.parse(Cookies.get("endereco"));
    $.ajax({
        type: 'GET',
        url: '/listarRestauranteComeae/' + $('.btn-vejamais-restaurantes').attr('data-pagina') + '/' + local[2],
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            var itens = `<div class="lazy-restaurantes">
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
            $('.btn-vejamais-restaurantes').hide();
            $('.lista-restaurantes').append(itens);
        },
        success: function (retorno) {
            $('.btn-vejamais-restaurantes').attr('data-pagina', retorno.pagina)
            $('.lazy-restaurantes').remove();

            retorno.restaurante.forEach(estabelecimento => {

                let categoria = estabelecimento.restaurante.categoria.categoriarestaurante,
                    funcionamento, status = '';

                estabelecimento.restaurante.funcionamento ? status = estabelecimento.restaurante.funcionamento.statusfuncionamento : null;

                let imgrest = estabelecimento.restaurante.restaurantecaminhofoto == "" || estabelecimento.restaurante.caminhofoto == null ? '/views/img/base.png' : estabelecimento.restaurante.caminhofoto;
                let tempoentregamax = estabelecimento.restaurante.entregamin == undefined ? '--' : estabelecimento.restaurante.entregamin;
                let tempoentregamin = estabelecimento.restaurante.entregamax == undefined ? '--' : estabelecimento.restaurante.entregamax;

                let registro = `<div class="col l4 m6 s12 cardrest" data-id='${estabelecimento.id}'>
                                    <a class="waves-effect waves-light item-restaurante cor-primaria card" href="/lista-restaurantes/São Luis/${estabelecimento.restaurante.id}">
                                        <img src="/views/img/base.png" data-src="` + imgrest.replace('/app', '') + `" class="logo-restaurante responsive-img b-lazy">
                                        <div class="dados-restaurante">
                                            <span class="titulo-restaurante">${estabelecimento.restaurante.nomefantasia}</span>
                                            <div>
                                                <span class="estrela-restaurante">★</span>
                                                <span data-id='${estabelecimento.restaurante.id}' class="nota-restaurante"></span> • 
                                                <span class="rest_sts situacao-restaurante-${estabelecimento.restaurante.email.toLowerCase()}">` + status.replace('Restaurante ', '') + `</span> • ${tempoentregamax}-${tempoentregamin} min 
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

            $('.lista-restaurantes .cardrest').each(function (x) {
                let sts = $(this).find('.rest_sts');
                sts.text() == "Fechado" ? sts.css('color', 'rgb(235, 28, 9) ') : sts.text() == "Aberto" ? sts.css('color', 'rgb(53, 230, 100) ') : sts.text() == "Pausado" ? sts.css('color', 'rgb(94, 166, 230) ') : null;
            })

            let blazy = new Blazy();

            // let bLazy = new Blazy({
            //     error: function (ele, msg) {
            //         if (msg === 'missing') {
            //             ele.src = '/views/img/base.png'
            //         }
            //         else if (msg === 'invalid') {
            //             ele.src = '/views/img/base.png'
            //         }
            //     }
            // });
            $('.btn-vejamais-restaurantes').removeClass('processando');
            retorno.restaurante.length <= 0 ? $('.btn-vejamais-restaurantes').hide() : $('.btn-vejamais-restaurantes').show();
            let obj = $('.btn-vejamais-restaurantes');
            if (obj.css('display') == 'none') {
                return false;
            } else {
                obj.each(function () {
                    $(this).isInViewport() ? obj.click() : null;
                });
            }
        },
        error: function () {
            $('.btn-vejamais-restaurantes').show();
            $('.lazy-restaurantes').remove();
        }
    });
}

// ADICIONAR PESQUISA
function AddPesquisa(query) {

    $('.lista-restaurantes').empty();
    $.ajax({
        type: 'GET',
        url: "/restaurantes/categorias/" + query,
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            var itens = `<div class="lazy-restaurantes">
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
                                    <div class="ph-col-4-mod">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" class="ph-picture responsive-img b-lazy">
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
            $('.btn-vejamais-restaurantes').hide();
            $('.lista-restaurantes').append(itens);
        },
        success: function (retorno) {
            $('.btn-vejamais-restaurantes').show();
            $('.lazy-restaurantes').remove();
            //Adiciona itens na pÃ¡gina
            retorno.forEach(estabelecimento => {
                let categoria = estabelecimento.categoria.categoriarestaurante,
                    funcionamento;
                let status = '';
                if (estabelecimento.funcionamento) {
                    status = estabelecimento.funcionamento.statusfuncionamento;
                }


                let imgrest = estabelecimento.caminhofoto == "" || estabelecimento.caminhofoto == null ? '/views/img/base.png' : estabelecimento.caminhofoto;
                let tempoentrega = estabelecimento.tempo_entrega == undefined ? '--' : estabelecimento.tempo_entrega;

                let registro = `<div class="col l4 m6 s12">
                                    <a class="waves-effect waves-light item-restaurante cor-primaria card" href="/lista-restaurantes/São Luis/${estabelecimento.id}">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="` + imgrest + `" class="logo-restaurante responsive-img b-lazy">
                                        <div class="dados-restaurante">
                                            <span class="titulo-restaurante">${estabelecimento.nomefantasia}</span>
                                            <div>
                                                <span class="estrela-restaurante">★</span>
                                                <span class="nota-restaurante">${estabelecimento.codcategoria}</span> • 
                                                <span class="situacao-restaurante-${estabelecimento.email.toLowerCase()}">` + status.replace('Restaurante', '') + `</span> • ` + tempoentrega + ` min
                                            </div>
                                            <span class="categoria-restaurante">${categoria}</span>
                                        </div>
                                    </a>
                                </div>`;

                $('.lista-restaurantes').append(registro);
            });
            //Lazyload > Imagens > Restaurantes
            let bLazy = new Blazy();
        },
        error: function (xhr) {
            $('.btn-vejamais-restaurantes').show();
            $('.lazy-restaurantes').remove();
        }
    });
}


//ADICIONAR MAIS RESTAURANTES
$(document).on('click', '.btn-vejamais-restaurantes', function () {
    if ($(this).hasClass('processando')) {
        return false;
    } else {
        AddRestaurantes();
    }
});

// EXECUTAR O VER MAIS AUTOMATICO
$.fn.isInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
};
$(window).on('resize scroll ready', function () {
    let obj = $('.btn-vejamais-restaurantes');
    if (obj.css('display') == 'none') {
        return false;
    } else {
        obj.each(function () {
            $(this).isInViewport() ? obj.click() : null;
        });
    }
});

// CLICAR EM CATEGORIAS (PESQUISA)
$(document).on('click', '.categorias', function () {
    window.location.href = "/categorias/São Luis/" + $(this).attr('data-categoria');
})

$(document).on('click', '.bt-parceiro', function () {
    $('.sidenav-login').sidenav('open');
    $('.dv-logar, .dv-verificar-code, .dv-cad-email, .dv-cadastrar').hide(600);
    $('.dv-cad-rest').show(600);
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
                  
                    $('.promo-valor').attr('href', '/promocoes/valor/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
                    $('.promo-valor > img').attr('src', '/views/img/promos2.webp')

                }
                if (el.promocao.descricao == "Promoçao de Frete Gratis") {
                    $('.promo-porc').attr('href', '/promocoes/Frete Gratis/40e6215d-b5c6-4896-987c-f30f3678f608')
                    $('.promo-porc > img').attr('src', '/views/img/promos2.webp')

                }
            })

        }
    })
    $('.busca').click(function () {
        let comida = $(this).attr('data-comida');
        AddPesquisa(comida);
    });

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
                center: true,
                height: 190
            },
            600: {
                items: 2,
            },
            1000: {
                items: 4,
            }
        },
    });
    $(document).on('click', '.btnconfirmLOC', function () {
        AddRestaurantes();
    });
    $('.btnFacebook').click(function () {
        OAuth.initialize('BbqbwzTHXyg9faeZ5ebbSgPut8Q')
        OAuth.popup('facebook').done(function (facebook) {

            facebook.get('/v2.5/me?fields=name,first_name,last_name,email,gender,location,locale,work,languages,birthday,relationship_status,hometown,picture').then(data => {

                $.ajax({
                    type: 'POST',
                    url: '/cadastrarToken',
                    data: {
                        dados: data
                    },
                    success: (dados) => {
                        if (dados.tokenUsuario) {
                            Cookies.set('tokenUsuario', dados.tokenUsuario)
                            Cookies.set('nomeusuario', data.name);
                            window.location.href = "/comeae";
                        } else {
                            Cookies.set('user_new', dados.token)
                            window.location.href = "/cadastroCliente/" + data.email;
                        }

                    }

                })

            })
        });
    });
});