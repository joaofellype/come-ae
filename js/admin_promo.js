function msgswal_title(title) {
    Swal.fire({
        title: title,
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false
    })
}

$('.checkporcent').click(function () {
    if ($(this).is(':checked')) {
        $(this).parent().parent().parent().children('span').css('display', 'none');
        $(this).parent().parent().parent().children('p').css('display', 'inline-flex').css('padding-top', '9px');
    } else {
        $(this).parent().parent().parent().children('span').css('display', '');
        $(this).parent().parent().parent().children('p').css('display', '').css('padding-top', '0px');
    }
});

$(document).on('click', '#btnSaiba1, #btnSaiba2', function () {
    $('.divporc1, .divporc2').css('display', 'none')
    Swal.fire({
        title: 'Definir a promoção para...',
        html: "<br>" +
            '<a style="background-color: purple; margin-right: 5px; margin-bottom: 5px" class="waves-effect waves-light btn-small catporc1">Categorias</a>' +
            '<a style="background-color: #4f024f; margin-left: 5px; margin-bottom: 5px" class="waves-effect waves-light btn-small catporc2">Produtos específicos</a>',
        showCancelButton: false,
        showConfirmButton: false,
        allowEscapeKey: false,
        allowOutsideClick: function () {
            $('#modalProcentagem').modal('close');
            $('.divporc1,.divporc2').css('display', 'none')
            $('.pickerinicio,.pickerfim').val('')
            Swal.close();
        }
    })
})

$(document).on('click', '#btnSaiba3, #btnSaiba4', function () {
    $('.divval1,.divval2').css('display', 'none');
    Swal.fire({
        title: 'Definir a promoção para...',
        html: "<br>" +
            '<a style="background-color: purple; margin-right: 5px; margin-bottom: 5px" class="waves-effect waves-light btn-small catval1">Categorias</a>' +
            '<a style="background-color: #4f024f; margin-left: 5px; margin-bottom: 5px" class="waves-effect waves-light btn-small catval2">Produtos específicos</a>',
        showCancelButton: false,
        showConfirmButton: false,
        allowEscapeKey: false,
        allowOutsideClick: function () {
            $('#modalValor').modal('close');
            $('.divval1,.divval2').css('display', 'none')
            Swal.close();
        }
    })
})

$(document).on('click', '#btnSaiba5, #btnSaiba6', function () {
    $('.divfrete1,.divfrete2').css('display', 'none')
    Swal.fire({
        title: 'Definir a promoção para...',
        html: "<br>" +
            '<a style="background-color: purple; margin-right: 5px; margin-bottom: 5px" class="waves-effect waves-light btn-small catfre1">Categorias</a>' +
            '<a style="background-color: #4f024f; margin-left: 5px; margin-bottom: 5px" class="waves-effect waves-light btn-small catfre2">Bairros</a>',
        showCancelButton: false,
        showConfirmButton: false,
        allowEscapeKey: false,
        allowOutsideClick: function () {
            $('#modalFrete').modal('close');
            $('.divfrete1,.divfrete2').css('display', 'none')
            Swal.close();
        }
    })
})

// Porcentagem
$(document).on('click', '.catporc1, .catporc2', function () {
    $(this).hasClass('catporc1') ? $('#checkPorcentagem').attr('data-id', 1) && $('.divporc1').show() : $('#checkPorcentagem').attr('data-id', 2) && $('.divporc2').show();
    swal.clickConfirm();
});

// Valor
$(document).on('click', '.catval1, .catval2', function () {
    $(this).hasClass('catval1') ? $('#checkvalor').attr('data-id', 1) && $('.divval1').show() : $('#checkvalor').attr('data-id', 2) && $('.divval2').show();
    swal.clickConfirm();
});

// Frete
$(document).on('click', '.catfre1, .catfre2', function () {
    $(this).hasClass('catfre1') ? $('#checkFrete').attr('data-id', 1) && $('.divfrete1').show() : $('#checkFrete').attr('data-id', 2) && $('.divfrete2').show();
    swal.clickConfirm();
});

//REINICIAR SELECT2
$(document).on('click change', '.catporc1, .catporc2, .catval1, .catval2, .catfre1, .catfre2, .selespecpromo1, .selespecpromo7', function () {
    $('.selespecpromo4, .selespecpromo5').html('').select2({ data: [{ id: null, text: null }] });
    $('.selespecpromo5 option:first, .selespecpromo4 option:first').remove();
    $('.js-example-basic-single, .js-example-basic-multiple').select2({
        placeholder: 'Selecione',
        width: '100%',
        language: {
            noResults: function () {
                return "Nada encontrado!";
            }
        }
    });
    $('.select2-search input').addClass('browser-default');
})

$(document).on('click', '.modal-close', function () {
    $('.divporc1, .divporc2, .divval1, .divval2, .divfrete1, .divfrete2').hide()
    $('.pickerinicio, .pickerfim').val('')
    $('.selespecpromo1, .selespecpromo7')[0].selectedIndex = 0;
})

$(document).on('change', '.pickerinicio', function () {
    $('.pickerfim').val('');
})

$(window).on('resize load', function () {
    $('table.display').DataTable().columns.adjust().draw();
});

$(document).on('click', '.btnDelPromo', function () {
    Swal.fire({
        title: 'Finalizar esta promoção?',
        text: 'Ao confirmar estará finalizando esta promoção',
        icon: 'warning',
        confirmButtonText: 'Sim',
        confirmButtonColor: '#800080',
        showCancelButton: true,
        allowEscapeKey: false,
        cancelButtonText: 'Não',
        cancelButtonColor: '#333',
    }).then((result) => {
        if (result.value) {
            msgswal('Promoção finalizada!', 'A promoção não encontra-se mais disponível', 'success', 3500);
        }
    })
})

$(document).on('click', '#checkPorcentagem', function () {
    let cont = 0;

    if ($(this).attr('data-id') == 2) {
        $(this).parents('.modal-content').find('input').not(':hidden, .select2-search__field.browser-default').each(function () {
            if ($(this).val() == "" || $(this).val() == null || $('#selespecpromo1').val() == "" || $('#selespecpromo4').select2('data') == "") {
                cont++;
                msgswal('Erro', 'Há campos inválidos ou vazios', 'error', 3500);
            }
        })
    }

    if ($(this).attr('data-id') == 1) {
        $(this).parents('.modal-content').find('input').not(':hidden, .select2-search__field.browser-default').each(function () {
            if ($(this).val() == "" || $(this).val() == null || $('#selcatspromo1').select2('data') == "") {
                cont++;
                msgswal('Erro', 'Há campos inválidos ou vazios', 'error', 3500);
            }
        })
    }

    if (cont > 0) {
        $(this).prop('checked', false)
    } else {
        $(this).prop('checked', true)
        let selectPorcentagem = $('.selespecpromo4').select2('data');// APPEND NO PRIMEIRO IF PRODUTOS
        let selectCategoria = $('.selcatspromo1').select2('data');// APPEND NO PRIMEIRO IF P CATEGORIA
        let descricao = "Promoçao de Porcentagem";
        let arrayProduto = [], arrayCategoria = [], idCategoria = [], idproduto = [], prods = [];
        for (let item = 0; item < selectPorcentagem.length; item++) {
            arrayProduto.push(parseFloat(selectPorcentagem[item].text.replace(/^\D+/g, "")));
            idproduto.push(selectPorcentagem[item].id);
            prods.push(selectPorcentagem[item].text);
        }
        for (let item = 0; item < selectCategoria.length; item++) {
            arrayCategoria.push(selectCategoria[item].text);
            idCategoria.push(parseInt(selectCategoria[item].id));
        }

        $.ajax({
            url: '/cadastrarPromocao',
            method: 'POST',
            data: { fotocaminho: $("input[name='fotocaminho']").val(), todosProdutos: prods, produtos: arrayProduto, idCategoria: idCategoria, idProduto: idproduto, categoria: arrayCategoria, descricao: descricao, valor: $('input[name="valorPorcentagem"]').val(), dataInicio: $('.porcentagem-ini1').val(), dataFinal: $('.porcentagem-fim1').val() },
            beforeSend: () => {
                msgswal_title('Aguarde...');
            },
            success: function (data) {
                msgswal('Enviado para análise com sucesso!', data.message, 'success', 3500);
                $('#modalProcentagem').modal('close');
                setTimeout(() => { location.reload() }, 3000);
            }, error: (data) => {
                $('#modalProcentagem').modal('close');
                msgswal('Erro!', data.message, 'error', 3500);
            }
        })
    }
})

$(document).on('click', '#checkvalor', function () {
    let cont = 0;

    if ($(this).attr('data-id') == 2) {
        $(this).parents('.modal-content').find('input').not(':hidden, .select2-search__field.browser-default').each(function () {
            if ($(this).val() == "" || $(this).val() == null || $('#selespecpromo7').val() == "" || $('#selespecpromo5').select2('data') == "") {
                cont++;
                msgswal('Erro', 'Há campos inválidos ou vazios', 'error', 3500);
            }
        })
    }

    if ($(this).attr('data-id') == 1) {
        $(this).parents('.modal-content').find('input').not(':hidden, .select2-search__field.browser-default').each(function () {
            if ($(this).val() == "" || $(this).val() == null || $('#selcatspromo2').select2('data') == "") {
                cont++;
                msgswal('Erro', 'Há campos inválidos ou vazios', 'error', 3500);
            }
        })
    }

    if (cont > 0) {
        $(this).prop('checked', false)
    } else {
        $(this).prop('checked', true)
        let selectCategoria = $('.selcatspromo2').select2('data');
        let selectPorcentagem = $('.selespecpromo5').select2('data');
        let descricao = "Promoçao de Valor";
        let arrayProduto = [], arrayCategoria = [], idCategoria = [], idproduto = [], prods = [];
        for (let item = 0; item < selectPorcentagem.length; item++) {
            arrayProduto.push(parseFloat(selectPorcentagem[item].text.replace(/^\D+/g, "")));
            idproduto.push(selectPorcentagem[item].id);
            prods.push(selectPorcentagem[item].text);
        }
        for (let item = 0; item < selectCategoria.length; item++) {
            arrayCategoria.push(selectCategoria[item].text);
            idCategoria.push(parseInt(selectCategoria[item].id));
        }

        $.ajax({
            url: '/cadastrarPromocao',
            method: 'POST',
            data: { fotocaminho: $("input[name='fotocaminho']").val(), todosProdutos: prods, produtos: arrayProduto, idcategoria: idCategoria, idproduto: idproduto, categoria: arrayCategoria, descricao: descricao, valor: $('#inpValor').val(), dataInicio: $('.valor-ini1').val(), dataFinal: $('.valor-fim1').val() },
            beforeSend: () => {
                msgswal_title('Aguarde...');
            },
            success: function (data) {
                msgswal('Enviado para análise com sucesso!', data.message, 'success', 3500);
                $('#modalValor').modal('close');
                setTimeout(() => { location.reload() }, 3000);
            }, error: (data) => {
                $('#modalValor').modal('close');
                msgswal('Erro!', data.message, 'error', 3500);
            }
        })
    }
})

$(document).on('click', '#checkFrete', function () {
    let cont = 0;

    if ($(this).attr('data-id') == 2) {
        $(this).parents('.modal-content').find('input').not(':hidden, .select2-search__field.browser-default').each(function () {
            if ($(this).val() == "" || $(this).val() == null || $('#selbairropromo').val() == "") {
                cont++;
                msgswal('Erro', 'Há campos inválidos ou vazios', 'error', 3500);
            }
        })
    }

    if ($(this).attr('data-id') == 1) {
        $(this).parents('.modal-content').find('input').not(':hidden, .select2-search__field.browser-default').each(function () {
            if ($(this).val() == "" || $(this).val() == null || $('#selcatspromo3').select2('data') == "") {
                cont++;
                msgswal('Erro', 'Há campos inválidos ou vazios', 'error', 3500);
            }
        })
    }

    if (cont > 0) {
        $(this).prop('checked', false)
    } else {
        $(this).prop('checked', true)
        let selectCategoria = $('.selcatspromo2').select2('data');
        let selectPorcentagem = $('.selbairropromo').select2('data');
        let descricao = "Promoçao de Frete Gratis";
        let arrayProduto = [], arrayCategoria = [];
        for (let item = 0; item < selectPorcentagem.length; item++) {
            arrayProduto.push(selectPorcentagem[item].text);
        }
        for (let item = 0; item < selectCategoria.length; item++) {
            arrayCategoria.push(selectCategoria[item].text);
        }

        $.ajax({
            url: '/cadastrarPromocao',
            method: 'POST',
            data: { fotocaminho: $("input[name='fotocaminho']").val(), bairros: arrayProduto, categoria: arrayCategoria, descricao: descricao, dataInicio: $('.ini1').val(), dataFinal: $('.fim1').val() },
            beforeSend: () => {
                msgswal_title('Aguarde...');
            },
            success: function (data) {
                msgswal('Enviado para análise com sucesso!', data.message, 'success', 3500);
                $('#modalFrete').modal('close');
                setTimeout(() => { location.reload() }, 3000);
            }, error: (data) => {
                $('#modalFrete').modal('close');
                msgswal('Erro!', data.message, 'error', 3500);
            }
        })
    }
})

$(document).on('change', '.selespecpromo1', function () {
    var idGrupo = $(this).val()
    $('.selespecpromo4').html('').select2({ data: [{ id: null, text: null }] });
    $('.selespecpromo4 option:first').remove();
    let idrestaurante = $('#emailProp').attr('data-id')
    $.ajax({
        url: '/all_produto/' + idGrupo + '/' + idrestaurante,
        beforeSend: function () {
            $('.divLoader').css('display', '')
        },
        success: function (response) {
            if (response.length > 0) {
                response.forEach(edit => {
                    $("#selespecpromo4").append('<option value="' + edit.id + '">' + edit.nomeproduto + "  R$" + edit.valor.replace('.', ',') + '</option')
                })
            }
            $('.divLoader').css('display', 'none')
        }
    })
})

$(document).on('change', '.selespecpromo7', function () {
    var idGrupo = $(this).val()
    $.ajax({
        url: '/all_produto/' + idGrupo,
        beforeSend: function () {
            $('.divLoader').css('display', '')
        },
        success: function (response) {
            if (response.length > 0) {
                response.forEach(edit => {
                    $("#selespecpromo5").append('<option value="' + edit.id + '">' + edit.nomeproduto + "  R$" + edit.valor.replace('.', ',') + '</option')
                })
            }
            $('.divLoader').css('display', 'none')
        }
    })
})

// FUNCTION VERIFICAR IMAGEM USER
function verificarImagem() {
    $('.img-user-perfil').attr('src') == "" ? $('.lbl-textavatar, .dv-avatar-side').show() : $('.lbl-textavatar, .dv-avatar-side').hide() && $('.img-user-side').attr('src', $('.img-user-perfil').attr('src'))
}

// BOTÃO OCULTO IMAGEM >> AO MUDAR > MODAL
$('[id*="btninput"]').on('change', function () {

    var reader = new FileReader();
    reader.onload = function (event) {
        $image_crop.croppie('bind', {
            url: event.target.result
        })
    }

    reader.readAsDataURL(this.files[0]);
    $('#modalCropUser').modal('open');
});

$(document).on('click', '[id*="btninput"]', function () {
    if ($(this).parents('.dv-imagem-user').find('[id*="imgInside"]').attr('src') !== '/views/img/base.png' && $(this).hasClass('sw-ok')) {
        Swal.fire({
            title: 'O que deseja?',
            html: "<br>" +
                '<div><button class="waves-effect waves-block btn-small bt-sw-nova green kit-flex fonte-primaria">' + 'Nova Image' + '</button>' +
                '<button class="waves-effect waves-block btn-small bt-sw-del red kit-flex fonte-primaria">' + 'Remover' + '</button></div>',
            showCancelButton: false,
            showConfirmButton: false,
            allowEscapeKey: false,
        })
        return false;
    }
})

$(document).on('click', '.bt-sw-nova', function () {
    if ($('#modalProcentagem').hasClass('open')) {
        $('#btninput').removeClass('sw-ok');
        $('#btninput').click()
        $('#btninput').addClass('sw-ok');
        Swal.close();
    } else if ($('#modalValor').hasClass('open')) {
        $('#btninput2').removeClass('sw-ok');
        $('#btninput2').click()
        $('#btninput2').addClass('sw-ok');
        Swal.close();
    } else {
        $('#btninput3').removeClass('sw-ok');
        $('#btninput3').click()
        $('#btninput3').addClass('sw-ok');
        Swal.close();
    }
    return false;
})

$(document).on('click', '.bt-sw-del', function () {
    $('[id*="imgInside"]').attr('src', '/views/img/base.png')
    $('#btninput,#btninput2,#btninput3').removeClass('sw-ok');
    Swal.close();
})

// CONFIRMAÇÃO CROP IMAGEM USER
$('.crop_image').on('click', function (event) {
    $('#btninput,#btninput2,#btninput3').addClass('sw-ok')
    $image_crop.croppie('result', {
        type: 'base64',
        format: 'jpeg' | 'png' | 'webp',
        size: 'original',
        quality: 1
    }).then(function (response) {
        if ($('#modalProcentagem').hasClass('open')) {
            $('#imgInside').attr('src', response);
        } else if ($('#modalValor').hasClass('open')) {
            $('#imgInside2').attr('src', response);
        } else {
            $('#imgInside3').attr('src', response);
        }
        $('#modalCropUser').modal('close');

        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
        var uploadfile = $("input[name=imgPerfil]")[0].files[0];
        var formData = new FormData();
        formData.append("imgPerfil", uploadfile);

        $.ajax({
            url: '/cadastrarFotoProduto',
            method: 'POST',
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                $("input[name='fotocaminho']").val(data.message);
                msgswal('Sucesso', 'Imagem modificada', 'success', 3500);
            },
            error: function (msg) { }
        })

        function imageIsLoaded(e) {
            // $('#imgInside').attr('src', e.target.result);
            // $('#btninput').attr('src', e.target.result);
        }
        // verificarImagem()
    });
});

$(document).ready(function () {

    $('#modalVisualizar').modal();

    // MODAL > CROP > IMG USER
    $('#modalCropUser').modal({
        dismissible: false,
        onOpenStart: function () {
        },
        onCloseStart: function () {
        }
    })

    $.ajax({
        type: 'GET',
        url: '/listarBairros',
        success: (data) => {
            JSON.parse(data.area).forEach(bairros => {
                $('#selbairropromo').append('<option>' + bairros.nomebairro + '</option>')
            })
        }
    })

    // INICIALIZADOR CROP IMAGEM
    $image_crop = $('#image_demo').croppie({
        enableExif: true,
        viewport: {
            width: 150,
            height: 150,
            type: 'square', //square
            quality: 1
        },
        boundary: {
            width: 300,
            height: 300,
            enforceBoundary: true
        }
    });

    $('table.display').DataTable({
        "ajax": "/promocoesAtivasRestaurante",
        beforeSend: function () {
            $('.divLoader').css('display', 'none');
        },
        "columns": [
            { "data": null },
            { "data": null },
            { "data": null },
            { "data": 'data_inicio' },
            { "data": 'data_final' },
            { "data": null },
        ],
        responsive: true,
        "scrollY": "300px",
        "scrollCollapse": true,
        "paging": false,
        "language": {
            "lengthMenu": "",
            "zeroRecords": "Nada encontrado!",
            "info": '',
            "infoEmpty": "Sem registros encontrados!",
            "infoFiltered": "(Filtrando por um total de  _MAX_ registros)",
            "sSearch": "Buscar:"
        },
        "columnDefs": [
            {
                targets: [0], render: (data) => {

                    if (data.produtos == null) {
                        return ''
                    } else {

                        return (data.produtos).replace('["', '').replace('"]', '').replace('","', ', ').substr(0, 20) + '…';
                    }
                }
            },
            {
                targets: [1], render: (data) => {
                    return (data.descricao).replace('Promoçao de ', '');
                }
            },
            {
                targets: [2], render: (data) => {
                    return (data.valor).replace('.', ',')
                }
            },
            { className: 'center', targets: '_all' },
            {
                targets: [5], render: function (data) {
                    return '<div class="kit-flex"><button data-id=' + data.id + ' class="btn-small blue kit-flex bt-action-visualizar modal-trigger" href="#modalVisualizar"><i class="material-icons">visibility</i></button> </div>';
                }, orderable: false
            }
        ],
        initComplete: function (settings, json) {
            $('.divLoader').css('display', 'none');
        },
        "drawCallback": function (settings) {

        },
        "bAutoWidth": true
    });

    $('.dataTables_filter input').addClass('browser-default').css('outline', 'none').css('height', '25px').css('border', '1px solid black').css('border-radius', '3px').css('padding-left', '3px')

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

    $('#modalProcentagem').modal({
        dismissible: false,
        onOpenStart: () => {
        },
        onCloseStart: () => {
            $('[id*="imgInside"]').attr('src', '/views/img/base.png')
        }
    })
    $('#modalValor').modal({
        dismissible: false,
        onOpenStart: () => {
        },
        onCloseStart: () => {
            $('[id*="imgInside"]').attr('src', '/views/img/base.png')
        }
    })
    $('#modalFrete').modal({
        dismissible: false,
        onOpenStart: () => {
        },
        onCloseStart: () => {
            $('[id*="imgInside"]').attr('src', '/views/img/base.png')
        }
    })

    $('#modalPromoAtivas').modal({
        dismissible: false,
        onOpenEnd: () => {
            $('table.display').DataTable().columns.adjust().draw();
        }
    })
    $('#modalProcentagem').modal()
    $('#modalValor').modal()
    $('#modalFrete').modal()

    $('.pickerinicio').datepicker({
        i18n: i18n,
        format: 'dd/mm/yyyy',
        onSelect: function (dateStr) {
            $(".pickerfim").datepicker("destroy");
            $(".pickerfim").datepicker({
                minDate: new Date(dateStr), container: 'body', format: 'dd/mm/yyyy', i18n: i18n,
            })
        },
        container: 'body',
        minDate: new Date(),
    });

    $('.pickerfim').datepicker({
        format: 'dd/mm/yyyy',
        defaultDate: new Date(),
        container: 'body',
    });
})