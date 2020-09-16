$(document).on('click', '#btnModalSalvarCateg', function () {

    if ($('input[name=categoria]').val() == "") {
        msgswal('Campo Categoria vazio', 'Preencha o campo Categoria', 'error', 3000)
        return false;
    } else {

        $.ajax({
            method: "POST",
            url: "/cadastrarCategoriaProduto",
            dataType: 'json',
            data: {
                categoria: $('input[name=categoria]').val()
            },
            beforeSend: function () {
                $('.divLoader').css('display', '')
            },
            success: function (res, data) {
                msgswal(res.message, '', 'success', 3500);
                $('table.display1').DataTable().ajax.reload();
                $('.divLoader').css('display', 'none');
                $('.modal').modal('close');
            },
            error: function (res, data) {
                $('.divLoader').css('display', 'none')
                $('.modal').modal('close');
            }
        })
    }
})

$(document).on('click', '#btnModalSalvarComplesGrupo', function () {

    if ($('input[name=grupo]').val() == "") {
        msgswal('Campo Grupo vazio', 'Preencha o campo Grupo', 'error', 3000)
        return false;
    } else {
        $.ajax({
            method: "POST",
            url: "/cadastrarGrupo",
            dataType: 'json',
            data: {
                grupo: $('input[name=grupo]').val()
            },
            beforeSend: function () {
                $('.divLoader').css('display', '')
            },
            success: function (res, data) {
                msgswal(res.message, '', 'success', 3500);
                $('table.display2').DataTable().ajax.reload()
                $('.divLoader').css('display', 'none')
                $('#modalComplemento').modal('close')
            },
            error: function (res, data) {
                $('.divLoader').css('display', 'none')
                $('#modalComplemento').modal('close');
            }
        })
    }
})

$(document).on('click', '.btnDelCateg', function () {
    $('.divLoader').css('display', 'none')
    let id = $(this).parent().parent().find('td').attr('data-id');
    Swal.fire({
        title: 'Tem certeza disso?',
        text: "A ação não pode ser desfeita",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#800080',
        cancelButtonColor: '#333',
        cancelButtonText: 'Não',
        confirmButtonText: 'Sim'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: 'DELETE',
                url: '/deleteCategoriaProduto/' + id,
                dataType: "json",
                beforeSend: function () {
                    $('.divLoader').css('display', '')
                },
                success: function (res) {
                    msgswal(res.message, 'O item já não se encontra mais disponível', 'success', 3500);
                    $('table.display1').DataTable().ajax.reload()
                    $('.divLoader').css('display', 'none')
                },
                error: function (res) {
                    msgswal(res.message, 'O item ainda encontra-se disponível', 'error', 3500);
                }
            });
        }
    })
})

// COLOCAR NOME NO EDITAR CATEGORIA
$(document).on("click", ".display1 tr", function () {
    let i = $(this).find('.sorting_1:first').text();
    $('#editCategoria').find('input').val(i)
})
// COLOCAR NOME NO EDITAR GRUPO
$(document).on("click", ".display2 tr", function () {
    let i = $(this).find('.sorting_1:first').text()
    $('#editComp').find('input').val(i)
})

$(document).on('click', '.btnDelGrup', function () {
    let id = $(this).parent().parent().find('td').attr('data-id');
    $('.divLoader').css('display', 'none')
    Swal.fire({
        title: 'Tem certeza disso?',
        text: "A ação não pode ser desfeita!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#800080',
        cancelButtonColor: '#333',
        cancelButtonText: 'Não',
        confirmButtonText: 'Sim'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: 'DELETE',
                url: '/deleteGrupo/' + id,
                dataType: "json",
                beforeSend: function () {
                    $('.divLoader').css('display', '')
                },
                success: function (res) {
                    msgswal(res.message, 'O item já não se encontra mais disponível', 'success', 3500);
                    $('table.display2').DataTable().ajax.reload();
                    $('.divLoader').css('display', 'none');
                },
                error: function (res) {
                    msgswal(res.message, 'O item já não se encontra mais disponível', 'success', 3500);
                }
            });
        }
    })
})

$(document).on('click', '.btnCateg, .btnGrup', function () {
    $("#cadastra_Categoria, #modalComplemento").ready(function () {
        $('#cadastra_Categoria, #modalComplemento').find("input[type=text]").val("");
    });
})

$(document).on('click', '.btnEditCateg', function () {
    $('.idCategoria').text($(this).parent().parent().find('td').attr('data-id'));
})

$(document).on('click', '.btnEditGrup', function () {
    $('.idGrupo').text($(this).parent().parent().find('td').attr('data-id'));
})

// IR PARA PRODUTOS
$(document).on("click", '.display1 .sorting_1', function () {
    window.location.href = 'admin_card/produto/' + $(this).attr('data-id');
})
// IR PARA COMPLEMENTOS
$(document).on("click", '.display2 td.sorting_1', function () {
    window.location.href = 'admin_card/complementos/' + $(this).attr('data-id');
})

$(document).on("click", ".editCategoria", function () {
    let id = $('.idCategoria').text();

    if ($('#input_text2').val() == "" || $('#input_text2') == null) {
        msgswal('Campo Editar Categoria vazio', 'Defina algum nome para a categoria', 'error', 3000);
        return false;
    } else {
        $.ajax({
            url: '/updateCategoriaProduto/' + id,
            dataType: 'json',
            type: 'PUT',
            data: {
                categoria: $("input[name='categoria12']").val()
            },
            beforeSend: function () {
                $('.divLoader').css('display', '')
            },
            success: function (data) {
                msgswal('Confirmação', data.message, 'success', 3500);
                $('table.display1').DataTable().ajax.reload();
                $('.divLoader').css('display', 'none');
                $('.modal').modal('close');
            },
            error: function (data) {
                msgswal('Erro!', data.message, 'error', 3500);
            }
        })
    }
});

$(document).on("click", "#btnModalSalvarGrupo", function () {
    let id = $('#emailProp').attr('data-id');
    $.ajax({
        url: '/editargrupo/' + id,
        dataType: 'json',
        type: 'PUT',
        data: {
            categoria: $("input[name='nomegrupo']").val(),
            id: id,
            editarGrupo: editarGrupo
        },
        beforeSend: function () {
            $('.divLoader').css('display', '')
        },
        success: function (data) {
            msgswal('Confirmação', data.message, 'success', 3500);
            $('table.display2').DataTable().ajax.reload();
            $('.modal').modal('close');

        },
        error: function (data) {
            msgswal('Erro!', data.message, 'error', 3500);
            $('.modal').modal('close')
        }
    })
});

$(document).on('click', '#categs', function () {
    $('#categs')[0].click()
    $('#tableCateg').DataTable().columns.adjust().draw();
});

$(document).on('click', '#comples', function () {
    $('#comples')[0].click()
    $('#tableGrup').DataTable().columns.adjust().draw();
});

$(document).ready(function () {

    $('#cadastra_Categoria').modal({
        onCloseEnd: () => {
            $('table.display1').DataTable().ajax.reload()
            $('.divLoader').css('display', 'none')
        }
    })
    $('#editComp').modal()
    $('#editCategoria').modal()
    $('#modalComplemento').modal({
        onCloseEnd: () => {
            $('table.display2').DataTable().ajax.reload()
            $('.divLoader').css('display', 'none')
        }
    })

    $('.display1').DataTable({
        "ajax": '/categorias',
        beforeSend: function () {
            $('.divLoader').css('display', '')
        },
        "columns": [
            { "data": "categoriaproduto" },
            { "data": null },
        ],
        "createdRow": function (row, data, rowIndex) {
            $.each($('td', row), function (colIndex) {
                $(this).attr('data-id', data.id);
            });
        },
        "columnDefs": [
            { targets: "_all", className: 'center' },
            {
                targets: [1], width: '12%', defaultContent: "<a class='btn-floating btn-small waves-effect waves-light blue darken-2 modal-trigger btnEditCateg' href='#editCategoria'><i class='material-icons'>edit</i></a> <a class='btn-floating btn-small waves-effect waves-light red darken-4 btnDelCateg'><i class='material-icons'>delete_forever</i></a>"
            }
        ],
        "initComplete": function (settings, json) {
            $('.divLoader').css('display', 'none')
        },
        "drawCallback": function (settings) {
        },
        responsive: true,
        "scrollY": "300px",
        "scrollCollapse": true,
        "bAutoWidth": true,
        "paging": false,
        "language": {
            "lengthMenu": "",
            "zeroRecords": "Nada encontrado!",
            "info": '',
            "infoEmpty": "Sem registros encontrados!",
            "infoFiltered": "(Filtrando por um total de  _MAX_ registros)",
            "sSearch": "Buscar:",
            "sEmptyTable": function () {
                return "Nada encontrado!";
            }
        },
    });

    $('.display2').DataTable({
        "ajax": '/grupo',
        beforeSend: function () {
            $('.divLoader').css('display', '')
        },

        "columns": [
            { "data": "grupo" },
            { "data": null },
        ],
        "createdRow": function (row, data, rowIndex) {
            $.each($('td', row), function (colIndex) {
                $(this).attr('data-id', data.id);
            });
        },
        "columnDefs": [
            { targets: '_all', className: 'center' },
            {
                targets: [1], width: '10%', defaultContent: "<a class='btn-floating btn-small waves-effect waves-light blue darken-2 tooltipped modal-trigger btnEditGrup'  data-tooltip='Editar' href='#editComp' data-position='top'><i class='material-icons'>edit</i></a> <a class='btn-floating btn-small waves-effect waves-light red darken-4 btnDelGrup'><i class='material-icons'>delete_forever</i></a>"
            }],
        "initComplete": function (settings, json) {
            $('.divLoader').css('display', 'none')
        },
        "drawCallback": function (settings) {
        },
        responsive: true,
        "scrollY": "300px",
        "scrollCollapse": true,
        "bAutoWidth": true,
        "paging": false,
        "language": {
            "lengthMenu": "",
            "zeroRecords": "Nada encontrado!",
            "info": '',
            "infoEmpty": "Sem registros encontrados!",
            "infoFiltered": "(Filtrando por um total de  _MAX_ registros)",
            "sSearch": "Buscar:",
            "sEmptyTable": function () {
                return "Nada encontrado!";
            }
        },
    });

    $('.dataTables_filter input').addClass('browser-default').css('outline', 'none').css('height', '25px').css('border', '1px solid black').css('border-radius', '3px').css('padding-left', '3px').css('margin-bottom', '10px')

    $('.tabs').tabs();
});

function mascarar() {
    $('input[id=inpCompSec3').mask('#.##0,00', {
        reverse: true,
        maxlength: true
    });
    $('input[id=valorcomp').mask('#.##0,00', {
        reverse: true,
        maxlength: true
    });
}