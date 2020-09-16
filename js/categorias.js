

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
    let local = JSON.parse(Cookies.get("endereco"));
    console.log(local)
    $.ajax({
        type: 'GET',
        url: '/restaurantes-categorias/'+ local[2]+'/' + $('.search').val(),
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function (data) {
            $('.tab-rest a').addClass('enviando')
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
                        </div>`;
            $('.lista-restaurantes').append(itens);
        },
        success: function (retorno) {
            console.log(retorno);
            $('.lazy-restaurantes').remove();

            retorno.restaurante.forEach(estabelecimento => {
                console.log(estabelecimento)
                let funcionamento = '';
                let categoria = estabelecimento.restaurante.categoria.categoriarestaurante;
                if (estabelecimento.restaurante.funcionamento != null) {

                    funcionamento = estabelecimento.restaurante.funcionamento.statusfuncionamento;
                }
                if (estabelecimento.restaurante.caminhofoto == null) {
                    estabelecimento.restaurante.caminhofoto = ''
                }
                let registro = `<div class="col l4 m6 s12 item-rest" data-id="${estabelecimento.restaurante.id}">
                                    <a class="waves-effect waves-light item-restaurante cor-primaria card" href="${'/lista-restaurante/' + estabelecimento.restaurante.id}">
                                        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="${estabelecimento.restaurante.caminhofoto.replace('/app', '')}" class="logo-restaurante responsive-img b-lazy">
                                        <div class="dados-restaurante">
                                            <span class="titulo-restaurante">${estabelecimento.restaurante.nomefantasia}</span>
                                            <div>
                                                <span class="estrela-restaurante">★</span>
                                                <span data-id='${estabelecimento.restaurante.id}' class="nota-restaurante"></span> • 
                                                <span class="situacao-restaurante">${funcionamento.replace('Restaurante ','').toUpperCase()}</span>
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

            retorno.restaurante.length <= 0 ? $('.lista-restaurantes').append('<div class="busca-vazia"><img src="/views/img/noresult.png"><span>Desculpe, não encontramos nada!</span></div>') : null;

            $('.tab-rest a').removeClass('enviando')

            
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
        },
        error: function (xhr) {
            $('.lazy-restaurantes').remove();
        }
    });
}

//ADICIONAR MAIS RESTAURANTES
$(document).on('click', '.bt-tab', function () {
    $(this).hasClass('enviando') ? null : $(this).addClass('enviando') && $(this).html() == 'Restaurantes' ? $('.lista-restaurantes').empty() && AddRestaurantes() : $('.lista-pratos').empty();
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

$(document).ready(function () {

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
    $(document).on('click', '.categorias', function () {
        window.location.href = "/categorias/São Luís/" + $(this).attr('data-categoria');
    })
    $('.materialboxed').materialbox();
    /* Tabs > Busca */
    $('.tabs').tabs();

    //Adiciona Restaurantes
    AddRestaurantes();
});