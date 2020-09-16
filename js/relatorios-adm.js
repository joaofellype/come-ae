var $eventSelect = $(".select-opc,.select-rest-rel");
$eventSelect.select2();
$eventSelect.on("select2:open", function (e) {
    $('.select2-search__field').addClass('browser-default').css('outline', 'none');
});

var select2Instance = $('.select-opc,.select-rest-rel').data('select2');
select2Instance.on('results:message', function (params) {
    this.dropdown._resizeDropdown();
    this.dropdown._positionDropdown();
});

function reiniciarSel2() {
    $('.select-opc,.select-rest-rel').select2({
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

function gerarRelatorio(colunas, dados, periodo, nome_arquivo, restaurante) {
    $('.bt-gerar-rel').removeAttr('disabled')
    $('.bt-gerar-rel > span').html('Gerar')
    var doc = new jsPDF('p', 'pt', 'a4');
    var img = new Image();
    doc.setTextColor(128, 0, 128);
    img.src = '/views/img/logocompletaroxo.png';
    doc.setFontSize(12)
    doc.addImage(img, 'PNG', 455, 20, 100, 40);

    doc.text(40, 30, "EMITIDO: " + moment(new Date()).format('DD/MM/YYYY HH:mm') + 'h');
    doc.text(40, 50, "REFERENTE A: " + $('.select-opc option:selected').html());
    doc.text(40, 70, "PERÍODO: " + periodo);
    doc.text(40, 90, "RESTAURANTE: " + restaurante);
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

    let opc = $('.select-opc option:selected'), dt_de = $('.pickerinicio').val(), dt_fim = $('.pickerfim').val(), chk_all = $('.checktodos').is(':checked'), dt_dia = $('.picker-dia').val(), columns = [{ title: "Quantidade", dataKey: "quantidade" }, { title: "Referente a", dataKey: "referente" }, { title: "Total", dataKey: "total" }], rest = $('.select-rest-rel option:selected');
    let opcao = $('.select-rest-rel option:selected').val()
    alert(opcao)
    if (opc.val() != "" && rest.html() != "" && dt_de != "" && dt_fim != "") {
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

                let tipourl = opc.val() == "qnt_ven_forma" ? /listarFaturamentoAdm/ : opc.val() == "qnt_ven_bairro" ? /listarBairroAdm/ : opc.val() == "qnt_ven_turno" ? /listarTurnoAdm/ : opc.val() == "prod-mais-ven" ? '/listarOsMaisAdm/' : '/listarOsMenosAdm/';

                $.ajax({
                    type: 'GET',
                    url: tipourl + opcao+ '/' + moment(dt_de, 'DD/MM/YYYY').format('YYYY.MM.DD') + '/' + moment(dt_fim, 'DD/MM/YYYY').format('YYYY.MM.DD'),
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
                        let periodo = dt_de + ' a ' + dt_fim;
                        gerarRelatorio(columns, valores, periodo, result.value, rest.html());
                    }
                })
            }
        })
    } else if (opc.val() != "" && rest.html() != "" && dt_dia != "") {
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

                let tipourl = opc.val() == "qnt_ven_forma" ? /listarFaturamentoAdmDia/ : opc.val() == "qnt_ven_bairro" ? /listarBairroAdmDia/ : opc.val() == "qnt_ven_turno" ? /listarTurnoAdmDia/ : opc.val() == "prod-mais-ven" ? '/listarOsMaisAdmDia/' : '/listarOsMenosAdmDia/';

                $.ajax({
                    type: 'GET',
                    url: tipourl + rest.html() + '/' + moment(dt_dia, 'DD/MM/YYYY').format('YYYY.MM.DD'),
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
                        gerarRelatorio(columns, valores, periodo, result.value, rest.html());
                    }
                })
            }
        })
    } else if (opc.val() != "" && rest.html() != "" && chk_all == true) {
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

                let tipourl = opc.val() == "qnt_ven_forma" ? /listarFaturamentoAdmTudo/ : opc.val() == "qnt_ven_bairro" ? /listarBairroAdmTudo/ : opc.val() == "qnt_ven_turno" ? /listarTurnoAdmTudo/ : opc.val() == "prod-mais-ven" ? '/listarOsMaisAdmTudo/' : '/listarOsMenosAdmTudo/';

                $.ajax({
                    type: 'GET',
                    url: tipourl + rest.html(),
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
                        gerarRelatorio(columns, valores, 'Todos', result.value, rest.html());
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

    // TRAZER OS RESTAURANTES AO SELECT2
    $.ajax({
        type: 'GET',
        url: '/listarAllRestaurante',
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.loader-place').empty().append(loader);
        },
        success: (data) => {
            console.log(data)
            $('.loader-place').empty();
            for (let i = 0; i < data.length; i++) {
                var option = new Option(data[i].nomefantasia.replace(/\b\s+\b/g, " ").replace(/\s/g, " "), data[i].id, true, true);
                $('.select-rest-rel').append(option).trigger('change');
            }

            $('.select-rest-rel').select2({
                placeholder: "Selecione",
                "language": {
                    "noResults": function () {
                        return "<span class='kit-flex center'>Nada encontrado!</span>";
                    }
                },
                escapeMarkup: function (markup) {
                    return markup;
                },
                dropdownAutoWidth: true,
                matcher: function (params, data) {
                    if (!params.term) return data;
                    else {
                        var text = data.text.toLowerCase(),
                            term = params.term.toLowerCase();
                        if (text.replace(/\b\s+\b/g, " ").indexOf(term) > -1) return data;
                        if (text.replace(/\s/g, " ").indexOf(term) > -1) return data;
                        return null;
                    }
                }
            });
            $('.select-rest-rel').val('').trigger('change');
            $('.select2-search__field').addClass('browser-default').css('outline', 'none');

        },
        error: () => {

        }
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