$(document).ready(function () {

    $.ajax({
        url:'/listarMediaRestaurante',
        dataType:'json',
        cache:false,
        contentType: "application/json; charset=utf-8",
        success:(data)=>{
            data.length == 0 ? $('.mediaAva').text('0,0') : $('.mediaAva').text(data[0].media.substring(0,3));
            
        },
        error:(data)=>{
            
        }
    })


    $.ajax({
        type: 'GET',
        url: '/listarComentariosAvaliacao',
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            var itens = [
                `<div class="lazy-comentarios">
                    <div class="dv-card-comentario">
                        <div class="card ph-item">
                            <div class="ph-col-12-mod">
                                <div class="ph-row">
                                    <div class="ph-col-8 big"></div>
                                    <div class="ph-col-4 big"></div>
                                    <div class="ph-col-10 big"></div>
                                    <div class="ph-col-5"></div>
                                    <div class="ph-col-7"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="dv-card-comentario">
                        <div class="card ph-item">
                            <div class="ph-col-12-mod">
                                <div class="ph-row">
                                    <div class="ph-col-8 big"></div>
                                    <div class="ph-col-4 big"></div>
                                    <div class="ph-col-10 big"></div>
                                    <div class="ph-col-5"></div>
                                    <div class="ph-col-7"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
            ];
            $('.corpo-comentario').append(itens);
        },
        success: (data) => {
            console.log(data)
          
            $('.lazy-comentarios').remove();
            data.forEach(comentario => {

                let registro = `<div class="dv-card-comentario">
                                    <div class="card">
                                        <div class="card-content black-text">
                                            <div class="dv-identificador-cmt">
                                                <i class="material-icons">person</i>
                                                <span class="nome-cliente-cmt">${comentario.usuario.nomeusuario}</span>
                                            </div>
                                            <div class="dv-avaliacao-cmt">
                                                <p class="nota-avaliacao-cmt">Avaliação: ${comentario.estrelas}</p>
                                                <i class="material-icons yellow-text accent-2">star</i>
                                            </div>
                                            <div class="comentario-cmt">${comentario.avaliacao}</div>
                                            <p class="nmr-pedido-cmt">Nº do pedido: ${comentario.pedido.id}</p>
                                            <p class="date-comentario">${moment(comentario.createdAt).format('DD/MM/YYYY - HH:mm')}</p>
                                        </div>
                                    </div>
                                </div>`;
                $('.corpo-comentario').append(registro);
            });
            let msg = data.length == 0 ? $('.corpo-comentario').append('<span class="msg-cmt">Não há comentários no seu estabelecimento</span>') : null;

        }
    })

    $.ajax({
        type: 'GET',
        url: '/listarCountEstrelas',
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {

        },
        success: (data) => {
            let star1 = data.avaliacoes1[0].quantidades,star2 = data.avaliacoes2[0].quantidades,star3 = data.avaliacoes3[0].quantidades,star4 = data.avaliacoes4[0].quantidades,star5 = data.avaliacoes5[0].quantidades;

            var ctx = document.getElementById("myChart").getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ["1 estrela", "2 estrelas", "3 estrelas", "4 estrelas", "5 estrelas"],
                    datasets: [{
                        backgroundColor: [
                            "#ffeb3b",
                            "#ffd600",
                            "#ff8f00",
                            "#ff6d00",
                            "#e65100"
                        ],
                        data: [star1, star2, star3, star4, star5]
                    }]
                },
                plugins: [{
                    beforeInit: function (chart, options) {
                        // $('.divLoader').css('display', '')
                    },
                    afterInit: function (chart, options) {
                        // $('.divLoader').css('display', 'none')
                    }
                }],
                options: 50,
            });

            if(star1 == 0 && star2 == 0 && star3 == 0 && star4 == 0 && star5 == 0){
                $('#myChart').remove()
                $('.corpo-estrelas').append('<div class="corpo-comentario"><span class="msg-cmt">Sem estrelas no seu estabelecimento</span></div>');
                return false;
            }

        }
    })

    $.ajax({
        type: 'GET',
        url: '/listarAvaliacoesMes',
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {

        },
        success: (data) => {
            console.log(data)
            var canvas = document.getElementById('aval');
            var data = {
                labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                datasets: [{
                    responsive: true,
                    label: "Avaliações",
                    fill: true,
                    lineTension: 0.1,
                    borderColor: "darkorange",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "darkorange",
                    pointBackgroundColor: "darkorange",
                    pointBorderWidth: 1,
                    pointHoverRadius: 2,
                    pointHoverBackgroundColor: "darkorange",
                    pointHoverBorderWidth: 5,
                    pointRadius: 5,
                    pointHitRadius: 10,
                    data: [data.janeiro[0].count, data.fevereiro[0].count, data.marco[0].count, data.abril[0].count, data.maio[0].count, data.junho[0].count, data.julho[0].count, data.agosto[0].count, data.setembro[0].count, data.outubro[0].count, data.novembro[0].count, data.dezembro[0].count],
                }]
            };

            var option = {
                showLines: true,
                plugins: [{
                    beforeInit: function (chart, options) {
                        // $('.divLoader').css('display', '')
                    },
                    afterInit: function (chart, options) {
                        // $('.divLoader').css('display', 'none')
                    }
                }]
            };
            var myLineChart = Chart.Line(canvas, {
                data: data,
                options: option
            });
        }
    })


    // -------------------------------------------------------- //



    $('.tooltipped').tooltip();

    $(document).on('click', '.tooltipped', function () {
        $('.tooltipped').tooltip('close');
        $('.tooltipped').tooltip();
    })

});