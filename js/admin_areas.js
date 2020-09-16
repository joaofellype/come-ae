var $eventSelect = $(".select-cidade");
$eventSelect.select2();
$eventSelect.on("select2:open", function (e) {
    $('.select2-search__field').addClass('browser-default').css('outline', 'none');
});

$(document).on('click', '.btnSalvarAreas', function () {
    let dados = [], i = 0;
    
    $('#tableBairros tbody tr').each(function () {
        dados.push({id: $(this).attr('data-id'), nomebairro: $(this).find('td:nth-child(1)').text(), status: $(this).find('.checkarea').is(':checked'), valor: $(this).find('.valor-local').val().replace(',', '.'),codrestaurante:$('#emailProp').attr('data-id') })
    })

    $.ajax({
        method: 'POST',
        url: '/cadastrarArea',
        data: { campos: dados },
     
        beforeSend: function () {
            Swal.fire({
                title: 'Salvando...',
                text: 'Este processo pode ser demorado, aguarde.',
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            })
            $('.btnSalvarAreas').attr('disabled', 'disabled').html('Salvando...');
        },
        success: function (data) {
            msgswal('Confirmação!', 'Salvo com sucesso', 'success', 3500);
            $('.btnSalvarAreas').removeAttr('disabled').html('Salvar');
            // $('#tableBairros').DataTable().ajax.reload();
        },
        error: () => {
            msgswal('Erro', 'Ocorreu um erro, tente novamente mais tarde', 'error', 3500);
            $('.btnSalvarAreas').removeAttr('disabled').html('Salvar');
        }
    })
})

$(document).on('click', '.check', function () {
    if ($(this).data('status') == false) {
        $(this).parent().parent().parent().parent().find('td:last input').css('background-color', 'white').css('color', 'black').val('').removeAttr('disabled', 'disabled').removeAttr('readonly')
        $(this).data('status', true)
        $(this).attr('checked', 'checked')
    } else {
        $(this).parent().parent().parent().parent().find('td:last input').css('background-color', 'purple').css('color', 'white').val('Indisp').attr('disabled', 'disabled').attr('readonly')
        $(this).data('status', false)
        $(this).removeAttr('checked')
    }
})

$(document).on('focus', '.textValor', function () {
    $(this).attr('inputmode', 'numeric')
    VMasker($(this)).maskMoney({
        precision: 2,
        separator: ',',
        delimiter: '.'
    });
})

$(document).on('click', '.odd, .even', function () {
    let valor = $(this).find('.valor-local').val();
    let check = $(this).find('.checkarea').is(':checked');
    if ($('.dtr-modal-content').is(':visible')) {
        $('.dtr-modal-content').find('.checkarea').prop('checked', check);
        if (check == false) {
            $('.dtr-modal-content').find('.valor-local').attr('disabled', 'disabled').val('');
        } else {
            $('.dtr-modal-content').find('.valor-local').removeAttr('disabled').val(valor);
        }
        $('.valor-local').mask("#.##0,00", { reverse: true });
    }
})

$(document).on('click', '.checkarea', function () {
    // MODAL DETALHES ABERTO
    if ($('.dtr-modal-content').is(':visible')) {
        let check = $('.dtr-modal-content').find(this).is(':checked');
        let id = $('.dtr-modal-content').find(this).attr('data-id');
        if (check == false) {
            $('.dtr-modal-content').find('.valor-local').attr('disabled', 'disabled').val('');
            $('#tableBairros tbody').find('tr').each(function () {
                $(this).attr('data-id') == id ? $(this).find('.valor-local').attr('disabled', 'disabled').val('') && $(this).find('.checkarea').prop('checked', check) : null;
            });
        } else {
            $('.dtr-modal-content').find('.valor-local').removeAttr('disabled');
            $('#tableBairros tbody').find('tr').each(function () {
                $(this).attr('data-id') == id ? $(this).find('.valor-local').removeAttr('disabled') && $(this).find('.checkarea').prop('checked', check) : null;
            });
        }
        // DETALHES NORMAL
    } else {
        let check = $(this).is(':checked');
        if (check == false) {
            $(this).parents('tr').find('.valor-local').attr('disabled', 'disabled').val('');
        } else {
            $(this).parents('tr').find('.valor-local').removeAttr('disabled');
        }
    }
})

$(document).on('input', '.valor-local', function () {
    if ($('.dtr-modal-content').is(':visible')) {
        let val = $('.dtr-modal-content').find('.valor-local').val();
        let id = $('.dtr-modal-content').find('.valor-local').attr('data-id');
        $('#tableBairros tbody').find('tr').each(function () {
            $(this).attr('data-id') == id ? $(this).find('.valor-local').val(val) : null;
        });
    }
})

$(window).on('resize', function () {
    if ($('.dtr-modal-content').is(':visible')) {
        $('.dtr-modal').remove();
    }
})

$(document).ready(function () {

    $('#tableBairros').DataTable({
        "ajax": "/areas",
        beforeSend: function () {
            $('.divLoader').css('display', '');
        },
        "columns": [
            { "data": null },
            { "data": null },
            { "data": null },
        ],
        "columnDefs": [
            {
                targets: '_all', className: 'center'
            },
            {
                targets: [0], render: function (data) {
                    return '<span data-id=' + data.id + '>' + data.bairro + '</span>'
                },
            },
            {
                targets: [1], width: '10%', orderable: false, render: function (data) {
                    return '<p><label><input class="checkarea" data-stts=' + data.stts + ' data-id=' + data.id + ' name="chklista" type="checkbox"/><span></span></label></p>'
                }
            },
            {
                targets: [2], width: '10%', orderable: false, render: function (data) {
                    // data.valor = data.valor == null ? '' : data.valor;
                    return '<input data-id=' + data.id + ' maxlength="6" class="valor-local browser-default center" value='+ data.valor +' type="text">'
                }
            },
        ],
        responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal({
                    header: function (row) {
                        var data = row.data();
                        return '<h5>Detalhes</h5>';
                    }
                }),
                renderer: $.fn.dataTable.Responsive.renderer.tableAll()
            }
        },
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
        initComplete: function (settings, json) {
            $('.divLoader').css('display', 'none');
            $('.valor-local').mask("#.##0,00", { reverse: true });

            $(this).find('tr').each(function () {
                $(this).find('input[name="chklista"]').attr('data-stts') == 'true' ? $(this).find('input[name="chklista"]').prop('checked', 'true') : null;
                $(this).find('input[class="valor-local"]').val() == 'null' ? $(this).find('input[class="valor-local"]').val('') : null;
            })
        },
        "createdRow": function (row, data, dataIndex) {
            $(row).each(function () {
                $(this).attr('data-id', data.id)
            })
        },
        "drawCallback": function (settings) { },
        "bAutoWidth": true
    });
    $('.tooltipped').tooltip();
    $('.select-cidade').select2({
        placeholder: "Selecione",
        "language": {
            "noResults": function () {
                return "Nada encontrado!";
            }
        },
        escapeMarkup: function (markup) {
            return markup;
        }
    })
})