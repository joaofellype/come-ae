$(document).on('click', '.btnCateg', function () {
    $('input[name=nome]').val('')
    $('input[name=desc]').val('')
    $('input[name=valor]').val('')
})

function mascaraValor(valor) {
    valor = valor.toString().replace(/\D/g, "");
    valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
    return valor
}

function msgswal(title, text, icon, timer) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: timer,
        confirmButtonColor: "#800080"
    })
}

$(document).on('click', '#btnCat', function () {
    window.location.href = '/admin_card#test-swipe-2'
    $('.divLoader').css('display', '')
})

// BOTAO PDF
$(document).on('click', '.btnPDF', function () {
    Swal.fire({
        title: 'Defina o nome do arquivo',
        input: 'text',
        inputValue: `Relatório Geral de Complementos`,
        showCancelButton: true,
        confirmButtonColor: '#800080',
        cancelButtonColor: "#333",
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Gerar',
        inputValidator: (value) => {
            if (value == '' || value == null) {
                return 'Você precisa definir um nome'
            } else {
                $.ajax({
                    url: '/relatorio_adicionais',
                    beforeSend: function () {
                        $('.divLoader').css('display', '')
                    },
                    success: function (data) {

                        if (data.length == 0) {
                            data.push([{ rowSpan: 1, colSpan: 5, styles: { halign: 'center', fontSize: 13 }, content: "Esta lista está vazia!" }]);
                        } else {
                            let datac = "";
                            data.forEach(element => {
                                //PEGA VALOR DA DATA
                                datac = element[4].toString()
                                //ENVIA DATA CORRETA
                                element[4] = datac.substr(8, 2) + '/' + datac.substr(5, 2) + '/' + datac.substr(0, 4);

                                //FORMATAR VALOR
                                element[2] = mascaraValor(element[2])
                            })
                        }

                        var cols = ["Nome do Adicional", "Grupo", "Valor", "Descrição", "Data Criada"]

                        var m_names = new Array("Janeiro", "Fevereiro", "Março",
                            "Abril", "Maio", "Junho", "Julho",
                            "Agosto", "Setembro",
                            "Outubro", "Novembro", "Dezembro");
                        var today = new Date();
                        var curr_date = today.getDate();
                        var curr_month = today.getMonth();
                        var curr_year = today.getFullYear();

                        today = curr_date + " de " + m_names[curr_month] + " de " + curr_year;
                        var hoje = today;
                        var doc = new jsPDF('p', 'pt', 'a4');
                        var img = new Image();
                        doc.setTextColor(128, 0, 128);
                        doc.setFont('PTSans');
                        img.src = '/views/img/logocompletaroxo.png';
                        doc.autoTable(cols, data, {
                            startY: 160,

                            styles: {
                                lineColor: [218, 226, 210],
                                lineWidth: 0.2,
                                font: 'PTSans'
                            },
                            columnStyles: {
                                0: { cellWidth: 80 },
                                1: { cellWidth: 80 },
                                2: { cellWidth: 80 },
                                3: { cellWidth: 80 },
                                4: { cellWidth: 80 },
                            },
                            headStyles: {
                                fillColor: [128, 0, 128],
                                fontSize: 11,
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

                        doc.setFontSize(12)
                        doc.addImage(img, 'PNG', 40, 20, 100, 44);
                        doc.text(40, 140, `Tipo: Tabela Geral de Complementos`);
                        doc.text(40, 120, `Local: {{nome}}`);
                        var hoje = "Gerado: " + today;
                        doc.text(40, 100, hoje);
                        doc.save(`${value}.pdf`);

                        $('.divLoader').css('display', 'none')
                        msgswal('Pronto!', 'O seu PDF já foi gerado', 'success', 2000)
                    }
                })
            }
        }
    })
})

$(document).on("click", '#btnModalSalvar2', function () {

    if ($('input[name=nome]').val() == "") {
        msgswal('Campo Nome vazio', 'Preencha o campo Nome', 'error', 3000)
        return false;
    } else {
        let campos = {};
        $('.form').each(function () {
            if (typeof ($(this).attr('name')) != 'undefined') {
                if (typeof ($(this).val()) != 'undefined' && $(this).val() != null) {
                    campos[$(this).attr('name')] = $(this).val();
                }
            }
        });

        let codRestaurante = $('#emailProp').attr('data-id');

        $.ajax({
            url: '/cadastrarAdicional',
            type: 'POST',
            data: { campos: campos },
            beforeSend: function () {
                $('.divLoader').css('display', '')
            },
            success: (data) => {
                msgswal('Confirmação!', data.message, 'success', 3000)
                $('.display').DataTable().ajax.reload()
                $('.divLoader').css('display', 'none')
                $('.modal').modal('close')
            },
            error: (data) => {
                msgswal('Aviso', data.responseJSON.validacao[0].msg, 'error', 2000)
            }
        })
    }
})

$(document).on("click", ".display tr", function () {
    codRestaurante1 = $(this).find('.sorting_1:first').text();
})

$(document).on("click", ".btnEditComples", function () {
    let i = $(this).attr('data-id');

    $.ajax({
        url: '/editarAdicionais/' + i,
        dataType: 'JSON',
        beforeSend: function () {
            $('.divLoader').css('display', '')
            $("input[name='valorComple']").val("")
            $("input[name='nomeComple']").val("")
            $("textarea[name='descComple']").val("")
            $("input[name='categoComple']").val("")
            $("input[name='idAdicional']").val("")
        },
        success: function (data) {
            data.forEach(elements => {
                console.log(elements)
                if (elements.valor == "NaN" || elements.valor == null) {
                    $("input[name='valorComple']").val("");
                } else {
                    $("input[name='valorComple']").val(mascaraValor(elements.valor));
                }
                $("input[name='nomeComple']").val(elements.nome);
                $("textarea[name='descComple']").val(elements.descricao);
                $("input[name='categoComple']").val(elements.grupo.grupo);
                $("input[name='idAdicional']").val(elements.id);
                $(".idEditar").text(i);
            })
            $('.divLoader').css('display', 'none')
        },
        error: function (data) {
            msgswal('Erro ao buscar dados!', 'Tente novamente', 'error', 2000)
            $('.divLoader').css('display', 'none')
            $('.modal').modal('close')
        }
    })
})

//  EDITAR COMPLEMENTOS
$(document).on("click", ".editarComplemento", function () {
    let campos = {};
    let id = $('.idEditar').text();

    $('.formEditar').each(function () {
        if (typeof ($(this).attr('name')) != 'undefined') {
            if (typeof ($(this).val()) != 'undefined' && $(this).val() != null) {
                campos[$(this).attr('name')] = $(this).val();
            }
        }
    });

    $.ajax({
        method: 'PUT',
        url: '/updateAdicionais/' + id,
        data: { campos: campos },
        beforeSend: function () {
            $('.divLoader').css('display', '')
        },
        success: (data) => {
            msgswal('Salvo com sucesso!', data.message, 'success', 3000)
            $('.display').DataTable().ajax.reload()
            $('.divLoader').css('display', 'none')
            $('.modal').modal('close')
        },
        error: (data) => {
            msgswal('Aviso!', data.responseJSON.validacao[0].msg, 'error', 2000)
            $('.divLoader').css('display', 'none')
        }
    })
})

$(document).on('click', '.btnDelComples', function () {
    let i = $(this).attr('data-id');
    Swal.fire({
        title: 'Deseja realmente deletar?',
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
                url: '/excluir_complemento/' + i,
                dataType: "json",
                beforeSend: function () {
                    $('.divLoader').css('display', '')
                },
                success: function (res) {
                    msgswal(res.message, 'O item já não se encontra mais disponível', 'success', 3500)
                    $('.display').DataTable().ajax.reload()
                    $('.divLoader').css('display', 'none')
                },
                error: function (res) {
                    msgswal(res.message, 'O item ainda encontra-se disponível', 'error', 3500)
                    $('.display').DataTable().ajax.reload()
                    $('.divLoader').css('display', 'none')
                }
            })
        }
    })
})


$(document).ready(function () {

    $('#modalEditProd').modal()
    $('#modalComplemento').modal()

    VMasker(document.querySelector(".valorcriar")).maskMoney({
        precision: 2,
        separator: ',',
        delimiter: '.'
    });

    VMasker(document.querySelector(".valoreditar")).maskMoney({
        precision: 2,
        separator: ',',
        delimiter: '.'
    });

    let idCategoria = $('#idgrupocomp').attr('data-id');

    $('.display').DataTable({

        "ajax": '/listarAdicionais/' + idCategoria,
        "columns": [
            { "data": "nome" },
            { "data": null },
        ],
        "createdRow": function (row, data, rowIndex) {
        },
        "columnDefs": [
            { targets: '_all', className: 'center' },
            {
                targets: [1], width: '10%', render: (data) => {
                    return '<a data-id=' + data.id + ' class="btn-floating btn-small waves-effect waves-light blue darken-2 modal-trigger btnEditComples"' +
                        'href="#modalEditProd"><i class="material-icons">edit</i></a> <a data-id=' + data.id + ' class="btn-floating btn-small waves-effect waves-light red darken-4 btnDelComples"><i class="material-icons">delete_forever</i></a>'
                }
            }],
        "initComplete": function (settings, json) {
            $('.divLoader').css('display', 'none')
        },
        "drawCallback": function (settings) {

        },
        responsive: true,
        "scrollY": "300px",
        "scrollCollapse": true,
        "paging": false,
        "language": {
            "lengthMenu": "Exibindo _MENU_ ",
            "info": '',
            "zeroRecords": "Nada encontrado!",
            "infoEmpty": "Sem registros encontrados!",
            "infoFiltered": "(Filtrando por um total de  _MAX_ registros)",
            "sSearch": "Buscar:",
            "sEmptyTable": function () {
                return "Nada encontrado!";
            }

        },
        "bAutoWidth": true
    });

    $('.dataTables_filter input').addClass('browser-default').css('outline', 'none').css('height', '25px').css('border', '1px solid black').css('border-radius', '3px').css('padding-left', '3px')

    $('.dataTables_length select').addClass('browser-default');

    var idgrupocomp = jQuery('#idgrupocomp').attr('data-id')
    var idexcluir

    $('.excluir').click(function () {
        window.location.href = '/excluir_comp/' + idexcluir + '/' + idgrupocomp
    })

    $('.excl').click(function () {
        idexcluir = jQuery(this).attr('data-id')
    })

    $('.btndup').click(function () {
        var idcompl = jQuery(this).attr('data-id')
        $.ajax({
            url: '/adicionais/' + idcompl,
            success: function (response) {
                console.log(response)
                response.forEach(edit => {
                    $("input[name='nome']").val(edit.nome);
                    $("textarea[name='descricao']").val(edit.descricao);
                    $("input[name='grupo']").val(idgrupocomp);
                    $("input[name='valor']").val(edit.valor);
                    $('.formescondido').submit()
                })
            }
        })
    })



    //!-- mascaras dinheiro 

    //  $('input[name=precoCriarItem], input[id=valoreditprod], input[id=valoreditprod2], input[id=inpCompSec3]').mask('#.##0,00', { reverse: true, maxlength: true });

    var elm_html = $('#clones').html();   //faz uma cópia dos elementos a serem clonados.

    $(document).on('click', '#toolAddGrupo', function (e) {
        e.preventDefault();
        var i = $('.clone-campos').length;    //pega a quantidade de clones;
        var elementos = elm_html.replace(/\[[0\]]\]/g, '[' + i++ + ']');  //substitui o valor dos index e incrementa++
        $('#cloneCampos').append(elementos);  //exibe o clone.
    });


    $('.logout').click(function () {
        Swal.fire({
            title: 'Deseja realmente sair?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#800080',
            cancelButtonColor: '#333',
            confirmButtonText: 'Sim'
        }).then((result) => {
            if (result.value) {
                window.location.href = "/comeae";
            }
        })
    })

    $('.sidenav').sidenav();
    $('#sidenav-1').sidenav({ edge: 'left' });
    $('#divHorarioTopo select').formSelect();
    $('select').formSelect();
    $('input#input_text, textarea#textarea2').characterCounter();
    $('input#nome, textarea#textarea2').characterCounter();
    $('.tooltipped').tooltip();
    $('.tabs').tabs();

});

//pegar valores do select
$('#divHorarioTopo select').change(function () {
    $('#divHorarioTopo select').formSelect();
    var instance = M.FormSelect.getInstance($('#divHorarioTopo select'));
    var valor = instance.getSelectedValues();

});

window.onscroll = function () { scrollFunction() };
function scrollFunction() {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
        document.getElementById("sidenav-1").style.marginTop = "0px";
        document.getElementById("sidenav-1").style.transition = ".2s";
    } else {
        document.getElementById("sidenav-1").style.marginTop = "65px";
        document.getElementById("sidenav-1").style.transition = ".2s";
    }
}