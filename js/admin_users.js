$(document).on('click', '#tableCad > tbody > tr', function () {
    if ($(this).find('.emailperfil').html() == `{{email}}` && $("#tableCad").hasClass("collapsed")) {
        $(this).closest('tr').next('tr').find('.btnDelUser, .btnEditUser').attr('disabled', 'disabled').attr('data-email', $(this).find('.emailperfil').html())
    } else if ($("#tableCad").hasClass("collapsed")) {
        $(this).closest('tr').next('tr').find('.btnDelUser, .btnEditUser').attr('data-email', $(this).find('.emailperfil').html())
    } else {
        $(this).find('td:last a').attr('data-email', $(this).find('.emailperfil').html())
    }
})

$(window).on('resize', function () {
    $('table.display').DataTable().columns.adjust().draw();

    if ($("#tableCad").hasClass("collapsed")) {
        $('#tableCad > tbody > tr').each(function () {
            $(this).find('.emailperfil').html() == `{{email}}` ? $(this).closest('tr').next('tr').find('.btnDelUser, .btnEditUser').attr('disabled', 'disabled') : $(this).closest('tr').next('tr').find('.btnDelUser,.btnEditUser').removeAttr('disabled', 'disabled');
        })
    } else {
        $('#tableCad > tbody > tr').each(function () {
            $(this).find('.emailperfil').html() == `{{email}}` ? $(this).find('td:last a').attr('disabled', 'disabled') : $(this).find('td:last a').removeAttr('disabled', 'disabled');
        })
    }
});

$(document).on('change', '.selpermis', function () {
    var verify = $(this).val()
    verify == '' || verify == null ? $('.btnSelectAll').parent().find('p:first').text('Todas as permissões:') && $('.btnSelectAll').children('i').html('select_all') : $('.btnSelectAll').parent().find('p:first').text('Limpar permissões:') && $('.btnSelectAll').children('i').html('clear_all');
})

$(document).on('change', '.selpermis2', function () {
    var verify = $(this).val()
    verify == '' || verify == null ? $('.btnSelectAll2').parent().find('p:first').text('Todas as permissões:') && $('.btnSelectAll2').children('i').html('select_all') : $('.btnSelectAll2').parent().find('p:first').text('Limpar permissões:') && $('.btnSelectAll2').children('i').html('clear_all');
})

$(document).on('click', '.btnSelectAll', function () {
    var verify = $('.selpermis').val()

    verify == '' || verify == null ? $('.selpermis').find('option').prop('selected', 'select').end().select2() && $(this).parent().find('p:first').text('Limpar permissões:') && $(this).children('i').html('clear_all') : $('.selpermis').find('option').prop('selected', false).end().select2() && $('.selpermis').val('') && $(this).parent().find('p:first').text('Todas as permissões:') && $(this).children('i').html('select_all');

    $('.js-example-basic-multiple').select2({
        placeholder: 'Selecione as permissões'
    });
    $('.select2-search input').addClass('browser-default')
})

$(document).on('click', '.btnSelectAll2', function () {
    var verify = $('.selpermis2').val()

    verify == '' || verify == null ? $('.selpermis2').find('option').prop('selected', 'select').end().select2() && $(this).parent().find('p:first').text('Limpar permissões:') && $(this).children('i').html('clear_all') : $('.selpermis2').find('option').prop('selected', false).end().select2() && $('.selpermis2').val('') && $(this).parent().find('p:first').text('Todas as permissões:') && $(this).children('i').html('select_all');

    $('.js-example-basic-multiple').select2({
        placeholder: 'Selecione as permissões'
    });
    $('.select2-search input').addClass('browser-default')
})

//BEN DELETAR USUARIO
$(document).on('click', '.DelUsuario', function () {
    Swal.fire({
        title: 'Apagar Usuario?',
        text: 'Deseja realmente apagar este usuário?',
        icon: 'warning',
        confirmButtonColor: '#800080',
        cancelButtonColor: "#333",
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        showCancelButton: true
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: 'PUT',
                url: '/deletarUsuario/' + $(this).attr('data-id'),
                cache: false,
                beforeSend: function () {
                    $('.divLoader').show();
                },
                success: (data) => {
                    $('.divLoader').hide();
                },
                error: (data) => {
                }
            })
        }
    })
})

//BTN EDITAR USUARIO
$(document).on('click', '.EditUsuario', function () {
    let select1 = $('.selpermis2 ')
    $.ajax({
        type: 'GET',
        url: '/listarUsuariosRestaurantesOne/' + $(this).attr('data-id'),
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $('.divLoader').css('display', '');
        },
        success: (data) => {
            let permisoes = JSON.parse(data.permissao)
            $('.selPerfis2 option[value="' + data.perfil + '"]').prop('selected', true);
            $('.selPerfis2 option:selected').val(data.perfil)
            $('.inpnome2').val(data.nomeusuario);
            permisoes.forEach(el => {
                var option = new Option(el, 0, true, true);
                select1.append(option).trigger('change');
            })
            $('input[name="idusu"]').val(data.id);
            ('.divLoader').css('display', 'none');
        },
        error: () => {
        }
    })
})

$(document).on('click', '.btnCadUsu ', function () {
    $('#modalCadastrados').ready(function () {
        $('.selPerfis').prop('selectedIndex', 0)
        $('#modalCadastrados').find('input:password, input:text').val('')
        $(".js-example-basic-multiple").val('').trigger('change')
        $('.js-example-basic-multiple').select2({
            placeholder: 'Selecione as permissões'
        });
        $('.select2-search input').addClass('browser-default')
        $('#modalCadastrados').find('input').val('')
        setTimeout(function () {
            $("input[name=email], input[name=senha]").val('')
        }, 500)
    })
})

$(document).on('click', '.tooltipped', function () {
    $('.tooltipped').tooltip('close')
    $('.tooltipped').tooltip()
})

$(document).on('click', '.btnEditUser', function () {
    let i, perms = [];

    $('#modalEditarPerfil').ready(function () {
        $('.selPerfis2').prop('selectedIndex', 0)
        $('#modalEditarPerfil').find('input').val('')
        $('#modalEditarPerfil').find('input:text').val('')
        $(".js-example-basic-multiple").val('').trigger('change')
        $('.js-example-basic-multiple').select2({
            placeholder: 'Selecione as permissões'
        });
        $('.select2-search input').addClass('browser-default')
    })

    $("#tableCad").hasClass("collapsed") ? i = $(this).parents('tr:first').prev().find('td:first').html() : i = $(this).parent().parent().find('td:first').html();

    let select1 = $('.selpermis2 ')

    $.ajax({
        url: '/listaUsu/' + i,
        beforeSend: function () {
            $('.divLoader').css('display', '')
        },
        success: function (data) {
            console.log(data.perfil)
            $('.selPerfis2 option[value="' + data.perfil + '"]').prop('selected', true);
            $('input[name="nome2"]').val(data.nomeusuario).val();
            $('input[name="idusu"]').val(data.idusuario);
            data.permissao.forEach(el => {
                var option = new Option(el, 0, true, true);
                select1.append(option).trigger('change');
            })
            $('.divLoader').css('display', 'none')
        }
    })
})

$(document).on('click', '.btnEditarPerfil', function () {

    let permissao = [], select1 = $('.selpermis2').select2('data');

    for (let i = 0; i < select1.length; i++) {
        permissao.push(select1[i].text)
    }
    $.ajax({
        method: 'PUT',
        url: '/updateUsuariosRestaurante/' + $('input[name="idusu"]').val(),
        data: { nome: $('input[name="nome2"]').val(), perfil: $('.editforms option:selected').html(), permissao: permissao },
        beforeSend: function () {
            $('.divLoader').css('display', '')
        },
        success: function (data) {
            msgswal('Editado com sucesso!', 'Os dados foram salvos', 'success', 3500);
            $('#modalEditarPerfil').modal('close')
            $('.divLoader').css('display', 'none')
        },
        error: function (data) {
            msgswal('Erro ao editar!', 'Campo vazio', 'error', 3500);
            $('.divLoader').css('display', 'none')
        }
    })
});

$(document).on('click', '.btnSalvarPerfil', function () {
    let campos = {}, permissao = [], select1 = $('.selpermis').select2('data');

    $('.formulario').each(function () {
        if (typeof ($(this).attr('name')) != 'undefined') {
            if (typeof ($(this).val()) != 'undefined' && $(this).val() != null) {
                campos[$(this).attr('name')] = $(this).val();
            }
        }
    });

    for (var item = 0; item < select1.length; item++) {
        permissao.push(select1[item].text)
    }

    $.ajax({
        method: 'POST',
        url: '/createUsuarioRestaurante',
        data: { campos: campos, perfil: $('.selPerfis option:selected').text(), permissao: permissao },
        beforeSend: function () {
            $('.divLoader').css('display', '');
        },
        success: function (data) {
            msgswal('Criado com sucesso!', data.message, 'success', 3500);
            $('table.display').DataTable().ajax.reload();
            $('.modal').modal('close');
            $('.divLoader').css('display', 'none');
        },
        error: function (data) {
            msgswal('Erro ao atualizar!', data.responseJSON.validacao[0].msg, 'error', 3500);
            $('.divLoader').css('display', 'none');
        }
    })
});

$(document).on('click', '#tableCad tbody tr > td.details-control', function () {
    var sdata = $(this).closest('tr').find('td:eq(1)').text(), tr = $(this).parents('tr'), row = table.row(tr);
    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('shown');
    } else {
        if (table.row('.shown').length) {
            $('td.details-control', table.row('.shown').node()).click();
        }
        getDeposits1(sdata);
        tr.addClass('shown');
        row.child(format()).show();
    }
});

$(document).on('click', '.btnMostrarSenha', function () {
    $('input[name="senha"]').attr('type') == 'password' ? $('input[name="senha"]').attr('type', 'text') && $('input[name="confirmSenha"]').attr('type', 'text') && $(this).parent().find('p:last').text('Ocultar senha:') && $(this).children('i').html('visibility_off') : $('input[name="senha"]').attr('type', 'password') && $('input[name="confirmSenha"]').attr('type', 'password') && $(this).parent().find('p:last').text('Mostrar senha:') && $(this).children('i').html('visibility');
})

$(document).ready(function () {

    $('.divLoader').css('display', '')
    $('.divUsers input').each(function () {
        $(this).val('');
    });

    $('.js-example-basic-multiple').select2({
        placeholder: 'Selecione as permissões',
        width: '100%'
    });

    $('.select2-search input').addClass('browser-default');
    $('.tooltipped, #btnDel').tooltip();
    $('#modalCadastrados').modal();
    $('#modalEditarPerfil').modal();

    var tst = $('table.display').DataTable({
        "ajax": '/listarUsuarios',
        beforeSend: function (data) {
            $('.divLoader').css('display', '')
        },
        "columns": [
            { "data": "nomeusuario" },
            { "data": "emailusuario" },
            { "data": "perfil" },
            { "data": null, "searchable": false, "orderable": false },
        ],
        "columnDefs": [
            {
                targets: [3], render: (data) => {
                    return '<a data-id=' + data.id + ' class="btn-floating btn-small waves-effect waves-light blue darken-2 modal-trigger EditUsuario" href="#modalEditarPerfil"><i class="material-icons">edit</i></a> <a data-id=' + data.id + ' class="btn-floating btn-small waves-effect waves-light red darken-4 DelUsuario"><i class="material-icons">delete_forever</i></a>'
                }
            },
            { className: "emailperfil", targets: [1] },
            { className: 'nome', targets: [0] }
        ],
        responsive: true,
        "scrollY": "320px",
        "scrollCollapse": true,
        "paging": false,
        "language": {
            "lengthMenu": "",
            "zeroRecords": "Nada encontrado!",
            "info": '',
            "infoEmpty": "Sem registros encontrados!",
            "infoFiltered": "(Filtrando por um total de  _MAX_ registros)",
            "sSearch": "Buscar:",
        },
        "initComplete": function (settings, json) {
            $('.divLoader').css('display', 'none')
            $('#tableCad > tbody > tr').each(function () {
                $(this).find('.emailperfil').html() == `{{email}}` ? $(this).find('td:last a').attr('disabled', 'disabled').attr('data-email', $(this).find('.emailperfil').html()) : null;
                $(this).find('.btnDelUser').attr('data-email', $(this).find('.emailperfil').html())
            })
        },
        "drawCallback": function (settings) {
            $('#tableCad > tbody > tr').each(function () {
                $(this).find('.emailperfil').html() == `{{email}}` ? $(this).find('td:last a').attr('disabled', 'disabled').attr('data-email', $(this).find('.emailperfil').html()) : null;
                $(this).find('.btnDelUser').attr('data-email', $(this).find('.emailperfil').html())
            })

            $('.dataTables_filter input').on('keydown', function () {
                $("#tableCad > tbody> tr").each(function () {
                    var tr = $(this).closest('tr');
                    var row = tst.row(tr);
                    row.child.isShown() ? row.child.hide() && tr.removeClass('parent') : null;
                })
            });

        },
        "bAutoWidth": true
    });

    $('.dataTables_filter input').addClass('browser-default').css('outline', 'none').css('height', '25px').css('border', '1px solid black').css('border-radius', '3px').css('padding-left', '3px')

});