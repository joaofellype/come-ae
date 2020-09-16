var $eventSelect = $(".select-opc,.select-opc-ped,.select-opc-fatu,.select-opc-card,.select-opc-promo");
$eventSelect.select2();
$eventSelect.on("select2:open", function (e) {
    $('.select2-search__field').addClass('browser-default');
});

function reiniciarSel2() {
    $('.select-opc').select2({
        placeholder: "Selecione",
        "language": {
            "noResults": function () {
                return "<span class='kit-flex center'>Nada encontrado!</span>";
            }
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    });
    $('.select2-search__field').addClass('browser-default').css('outline', 'none');
}

function gerarRelatorio(colunas, dados, periodo, nome_arquivo) {
    $('.bt-gerar-rel').removeAttr('disabled')
    $('.bt-gerar-rel > span').html('Gerar')
    var doc = new jsPDF('p', 'pt', 'a4');
    var img = new Image();
    doc.setTextColor(128, 0, 128);
    img.src = '/views/img/logocompletaroxo.png';
    doc.setFontSize(12)
    doc.addImage(img, 'PNG', 455, 20, 100, 40);

    doc.text(40, 30, "Emitido: " + moment(new Date()).format('DD/MM/YYYY HH:mm') + 'h');
    doc.text(40, 50, "Referente a: " + $('.select-opc option:selected').html());
    doc.text(40, 70, "Período: " + periodo);
    doc.autoTable(colunas, dados, {
        startY: 120,
        styles: {
            lineColor: [218, 226, 210],
            lineWidth: 0.2,
        },
        headStyles: {
            fillColor: [128, 0, 128],
            fontSize: 12,
            valign: 'middle',
            halign: 'center'
        },
        bodyStyles: {
            fillColor: [252, 240, 252],
            textColor: 50,
            fontSize: 12,
            valign: 'middle',
            halign: 'center'
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250]
        },
    });
    doc.save(nome_arquivo + `.pdf`);
    msgswal('Gerado com sucesso!', 'PDF gerado', 'success', 3500);
}


$(document).on('change', '.pickerinicio', function () {
    $('.pickerfim, .picker-dia').val('');
})

$(document).on('change', '.pickerfim', function () {
    $('.picker-dia').val('');
})

$(document).on('change', '.picker-dia', function () {
    $('.pickerinicio, .pickerfim').val('');
})

$(document).on('change', '.pickerinicio, .pickerfim, .picker-dia', function () {
    $('.checktodos').prop('checked', false);
})

$(document).on('click', '.checktodos', function () {
    $(this).is(':checked') ? $('.pickerinicio, .pickerfim, .picker-dia').attr('disabled', 'disabled').val('') : $('.pickerinicio, .pickerfim, .picker-dia').removeAttr('disabled').val('');
})


$(document).on('click', '.bt-gerar-rel', function () {

    let opc = $('.select-opc option:selected'), dt_de = $('.pickerinicio').val(), dt_fim = $('.pickerfim').val(), chk_all = $('.checktodos').is(':checked'), dt_dia = $('.picker-dia').val(), columns = [{ title: "Quantidade", dataKey: "quantidade" }, { title: "Referente a", dataKey: "referente" }, { title: "Total", dataKey: "total" }];

    if (opc.val() != "" && dt_de != "" && dt_fim != "") {
        Swal.fire({
            title: 'Defina o nome do arquivo',
            showCancelButton: true,
            confirmButtonText: 'Gerar',
            input: 'text',
            inputValue: 'Relatório',
            inputAttributes: {
                autocapitalize: 'off'
            },
            confirmButtonColor: '#800080',
            cancelButtonColor: "#333",
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            console.log(result)
            if (result.value) {

                let tipourl = opc.val() == "qnt_ven_forma" ? /listarFaturamento/ : opc.val() == "qnt_ven_bairro" ? /listarBairro/ : opc.val() == "qnt_ven_turno" ? /listarTurno/ : opc.val() == "prod-mais-ven" ? '/listarOsMais/' : '/listarOsMenos/';

                $.ajax({
                    type: 'GET',
                    url: '/listarFaturamento',
                
                    data:{
                        dataInicial: moment(dt_de, 'DD/MM/YYYY').format('YYYY/MM/DD'),
                        dataFinal: moment(dt_fim, 'DD/MM/YYYY').format('YYYY/MM/DD')
                    },
        
                    beforeSend: function () {
                        $('.bt-gerar-rel').attr('disabled', 'disabled');
                        $('.bt-gerar-rel > span').html('Aguarde...');
                    },
                    success: function (data) {
                        console.log(data)
                        let valores = [];

                        if (data.length == 0) {
                            msgswal('Informação', 'Nada encontrado!', 'info', 3500);
                            return false;
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                valores.push({ quantidade: data[i].quantidade, referente: data[i].referente, total: data[i].valortotal.replace('.', ',') })
                            }
                        }
                        let periodo = dt_de + ' a ' + dt_fim;
                        gerarRelatorio(columns, valores, periodo, result.value);
                    }
                })
            }
        })
    } else if (opc.val() != "" && dt_dia != "") {
        Swal.fire({
            title: 'Defina o nome do arquivo',
            showCancelButton: true,
            confirmButtonText: 'Gerar',
            input: 'text',
            inputValue: 'Relatório',
            inputAttributes: {
                autocapitalize: 'off'
            },
            confirmButtonColor: '#800080',
            cancelButtonColor: "#333",
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {

                let tipourl = opc.val() == "qnt_ven_forma" ? /listarFaturamentoDia/ : opc.val() == "qnt_ven_bairro" ? /listarBairroDia/ : opc.val() == "qnt_ven_turno" ? /listarTurnoDia/ : opc.val() == "prod-mais-ven" ? '/listarOsMaisDia/' : '/listarOsMenosDia/';

                $.ajax({
                    type: 'GET',
                    url: tipourl + moment(dt_dia, 'DD/MM/YYYY').format('YYYY.MM.DD'),
                    dataType: 'json',
                    cache: false,
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function () {
                        $('.bt-gerar-rel').attr('disabled', 'disabled');
                        $('.bt-gerar-rel > span').html('Aguarde...');
                    },
                    success: function (data) {
                        console.log(data)
                        let valores = [];

                        if (data.length == 0) {
                            msgswal('Informação', 'Nada encontrado!', 'info', 3500);
                            return false;
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                valores.push({ quantidade: data[i].quantidade, referente: data[i].referente, total: data[i].valortotal.replace('.', ',') })
                            }
                        }
                        let periodo = dt_dia;
                        gerarRelatorio(columns, valores, periodo, result.value);
                    }
                })
            }
        })
    } else if (opc.val() != "" && chk_all == true) {
        Swal.fire({
            title: 'Defina o nome do arquivo',
            showCancelButton: true,
            confirmButtonText: 'Gerar',
            input: 'text',
            inputValue: 'Relatório',
            inputAttributes: {
                autocapitalize: 'off'
            },
            confirmButtonColor: '#800080',
            cancelButtonColor: "#333",
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {

                let tipourl = opc.val() == "qnt_ven_forma" ? /listarFaturamentoTudo/ : opc.val() == "qnt_ven_bairro" ? /listarBairroTudo/ : opc.val() == "qnt_ven_turno" ? /listarTurnoTudo/ : opc.val() == "prod-mais-ven" ? '/listarOsMaisTudo/' : '/listarOsMenosTudo/';

                $.ajax({
                    type: 'GET',
                    url: tipourl,
                    dataType: 'json',
                    cache: false,
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function () {
                        $('.bt-gerar-rel').attr('disabled', 'disabled');
                        $('.bt-gerar-rel > span').html('Aguarde...');
                    },
                    success: function (data) {
                        console.log(data)
                        let valores = [];

                        if (data.length == 0) {
                            msgswal('Informação', 'Nada encontrado!', 'info', 3500);
                            return false;
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                valores.push({ quantidade: data[i].quantidade, referente: data[i].referente, total: data[i].valortotal.replace('.', ',') })
                            }
                        }
                        gerarRelatorio(columns, valores, 'Todos', result.value);
                    }
                })
            }
        })
    } else {
        msgswal('Erro', 'Verifique as opções selecionadas', 'error', 4000);
        return false;
    }
})

$(document).ready(function () {
    var socket = io('http://localhost:3000');
  
    socket.on('my other event', function (message) {
        Push.create("Comeaê", {
            body: message,
            icon: '/views/img/logocompletaroxo.png',
            requireInteraction: true,
            onClick: function () {
                console.log(message)
                window.location.href = '';
                this.close();
            }
        });
    })
    let i18n = {
        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabádo'],
        weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        today: 'Hoje',
        clear: 'Limpar',
        cancel: 'Sair',
        done: 'OK',
        labelMonthNext: 'Próximo mês',
        labelMonthPrev: 'Mês anterior',
        labelMonthSelect: 'Selecione um mês',
        labelYearSelect: 'Selecione um ano',
        selectMonths: true,
        selectYears: 10,
    }

    $('.divLoader').css('display', 'none');

    reiniciarSel2();

    $('.pickerinicio').datepicker({
        i18n: i18n,
        format: 'dd/mm/yyyy',
        onSelect: function (dateStr) {
            $(".pickerfim, .picker-dia").datepicker("destroy");

            let inicio = new Date(dateStr), proximodia = new Date();
            proximodia.setDate(inicio.getDate() + 1);

            $(".pickerfim").datepicker({
                minDate: proximodia, container: 'body', format: 'dd/mm/yyyy', i18n: i18n,
            })
            $(".picker-dia").datepicker({
                container: 'body', format: 'dd/mm/yyyy', i18n: i18n,
            })
        },
        container: 'body',
        // minDate: new Date(),
    });

    $('.pickerfim').datepicker({
        format: 'dd/mm/yyyy',
        // defaultDate: new Date(),
        container: 'body',
    });

    $('.picker-dia').datepicker({
        format: 'dd/mm/yyyy',
        // defaultDate: new Date(),
        container: 'body',
    });

});