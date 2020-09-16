function mascaraValor(valor) {
    valor = valor.toString().replace(/\D/g, "");
    valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
    return valor
}
function msgswalhtml(title, html, icon, timer) {
    Swal.fire({
        title: title,
        html: html,
        icon: icon,
        timer: timer,
        confirmButtonColor: '#800080'
    })
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

$(document).on('click', '.tooltipped', function () {
    $('.toottipped').tooltip('close')
    $('.tooltipped').tooltip()
})

let idCategoria = $('#nomeCategoria').attr('data-id');

$(document).on('click', '.btnDelProd', function () {
    let id = $(this).attr('data-id');
    Swal.fire({
        title: 'Deseja realmente excluir?',
        text: 'A ação não pode ser desfeita',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#800080',
        cancelButtonColor: '#333',
        cancelButtonText: 'Não'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: 'PUT',
                url: '/deleteProduto/' + id,
                beforeSend: function () {
                    $('.divLoader').css('display', '')
                },
                success: function (res) {
                    msgswal(res.message, 'O item já não se encontra mais disponíve', 'success', 3000);
                    $('.display').DataTable().ajax.reload();
                    $('.divLoader').css('display', 'none');
                },
                error: function (res) {
                    msgswal(res.message, 'O item ainda encontra-se disponíve', 'error', 3000);
                    $('.divLoader').css('display', 'none')
                }
            });
        }
    })
})

$('.btnRetorno').click(function () {
    $('.divLoader').css('display', 'none')
})

//listar dados do produto
$(document).on('click', '.btnEditCateg', function () {
    let codRestaurante = $(this).attr('data-id');

    $('#selectGrupoEdit option:selected').val() == "0" ? $('#select2edit').attr('disabled', 'disabled') : $('#select2edit').removeAttr('disabled');

    $(".js-example-basic-multiple").val('').trigger('change')

    $('#modalEditarItem #spanDias').each(function () {
        var checked = new Array()
        checked = $(this).attr('checado')

        if (checked == "true") {
            $(this).parent().children('input').attr('checked', true)
        } else {
            $(this).parent().children('input').attr('checked', false)
        }
    })

    $.ajax({
        url: '/editarProduto/' + codRestaurante,
        method: 'GET',
        dataType: 'JSON',
        beforeSend: function () {
            $('.divLoader').css('display', '')
        },
        success: function (data) {
            data.forEach(elements => {
                if (elements.caminhofoto != null) {
                    let caminhoReplace = elements.caminhofoto;
                    $('.imgatual').attr('src', caminhoReplace);
                }
                if (elements.adicionais == null) {
                    $("input[name='nomeEdit']").val(elements.nomeproduto);
                    $("input[name='valorEdit']").val(mascaraValor(elements.valor));
                    $("input[name='categoriaEdit']").val(elements.categoria.categoriaproduto);
                    $("input[name='iddesc']").val(codRestaurante);
                    $("textarea[name='descricaoEdit']").val(elements.descricao);
                }
                else {
                    let i = JSON.parse(elements.adicionais)
                    console.log(i)
                    i.forEach(elementos => {
                        console.log(elementos[0].min);
                        $("<div class='divInputMaxMin1'> <h5 style='text-align: center; background-color: rgba(128, 0, 128, 0.500); border-radius: 3px; color: white; padding-top: 5px; padding-bottom: 5px; text-shadow: 1px 1px 1px black'>" + elementos[0].grupo + "</h5> <div style='display: flex;'><p>Mínimo:</p><input maxlength='3' pattern='([0-9]{3})' class='browser-default min1' value='" + elementos[0].min + "' onkeydown='return event.keyCode !== 69' placeholder='Min' type='number' name='mini2' id='mini2'><p>Máximo:</p><input maxlength='3' pattern='([0-9]{3})' class='browser-default max1' onkeydown='return event.keyCode !== 69' placeholder='Máx' value='" + elementos[0].max + "' type='number' name='maxi2' id='maxi2'><th><p><label class='lblObg'><input type='checkbox' class='filled-in obrg' /><span class='spanObg'>Obg.</span></label></p></th></div><table class='testetable1 centered'><thead><th>Nome</th><th>Valor</th><th>Ação</th></thead><tbody></tbody></table> </div > ").appendTo("#divComples1");

                        for (let i = 1; elementos.length > i; i++) {

                            $(".testetable1:last").append("<tr><td class='nomeComp1'>" + elementos[i].nome + "&nbsp</td><td class='valor'>" + mascaraValor(elementos[i].valor) + "&nbsp</td><td><i style='cursor: pointer; color: darkred' class='material-icons excluir'>delete_forever</i></td></tr>")
                        }
                    })
                }

                $("input[name='nomeEdit']").val(elements.nomeproduto);
                $("input[name='valorEdit']").val(mascaraValor(elements.valor));
                $("input[name='categoriaEdit']").val(elements.categoria.categoriaproduto);
                $("input[name='iddesc']").val(codRestaurante);
                $("textarea[name='descricaoEdit']").val(elements.descricao);

            })

            $('.divLoader').css('display', 'none')
            $('.excluir').click(function () {
                var par = $(this).parent().parent(); //tr
                if ($(this).parent().parent().parent().find('.excluir').length <= 1) {
                    $(this).parent().parent().parent().parent().parent().remove()
                }
                par.remove();
            })
        }

    })
    $('.testetable1 tbody tr').empty();
    $('.divInputMaxMin1').remove();
})

//EDITAR Produto
$(document).on("click", ".editarProduto", function () {

    let al = [], el = [];
    let adicionais = [];
    $('#divComples1').find('.divInputMaxMin1').each(function () {
        let min = $(this).find('div .min1:first').val()
        let max = $(this).find('div .max1:first').val()
        let grupo = $(this).find('h5').text();
        al.push({ grupo: grupo, min: min, max: max });
        $(this).find('table:first tr').each(function (index) {
            if ($(this).find('.nomeComp1').text().length != 0) {

                el.push({ nome: $(this).find('.nomeComp1').text(), valor: $(this).find('td:nth-child(2)').text() })
            }

        })
        adicionais.push(al.concat(el));
        al = [];
        el = [];
    })

    let dias = [], disponibilidade = {}
    $('#modalEditarItem #divDias input').each(function (x) {
        dias.push($(this).is(':checked'))
    })
    disponibilidade = { dom: dias[0], seg: dias[1], ter: dias[2], qua: dias[3], qui: dias[4], sex: dias[5], sab: dias[6] }

    console.log(disponibilidade)

    if ($('input[name=nomeEdit]').val() == "") {
        msgswal('Campo Nome vazio', 'Preencha o campo Nome', 'error', 3000);
        return false;
    } else if ($('input[name=valorEdit]').val() == "") {
        msgswal('O valor está vazio', 'Verifique o valor do produto', 'error', 3000);
        return false
    } else {
        let campos = {}
        $('.form').each(function () {
            if (typeof ($(this).attr('name')) != 'undefined') {
                if (typeof ($(this).val()) != 'undefined' && $(this).val() != null) {
                    campos[$(this).attr('name')] = $(this).val();
                }
            }
        });

        $.ajax({
            method: 'PUT',
            url: '/updateproduto/' + $('input[name="iddesc"]').val(),
            data: { campos: campos, adicionais: adicionais, caminhofoto: $("input[name='caminhofotoEditar']").val() },
            beforeSend: function () {
                $('.divLoader').css('display', '')
            },
            success: function (data) {
                msgswal('Editado com sucesso!', data.message, 'success', 3000);
                $('table.display').DataTable().ajax.reload()
                $('.modal').modal('close')
                $('.divLoader').css('display', 'none')
            },
            error: function (data) {
                msgswal('Erro ao atualizar!', data.message, 'error', 3000);
                $('.modal').modal('close')
                $('.divLoader').css('display', 'none')
            }
        })
    }
})

$('#selectGrupo1').change(function () {
    if ($('#selectGrupo1 option:selected').val() == "0") {
        $('#select2item').attr('disabled', 'disabled')
    } else {
        $('#select2item').removeAttr('disabled')
    }
})

$('#selectGrupoEdit').change(function () {
    if ($('#selectGrupoEdit option:selected').val() == "0") {
        $('#select2edit').attr('disabled', 'disabled')
    } else {
        $('#select2edit').removeAttr('disabled')
    }
})


$(document).on("click", ".TEST", function () {
    let select = $('.tst').select2('data');
    let selctGrupo = $('#selectGrupo1 option:selected').text()

    if (select.length >= 1) {
        $('#Complementos').css('display', '')
    } else {
        $('#Complementos').css('display', 'none')
    }

    let dados = []
    let dados1 = []
    for (let item = 0; item < select.length; item++) {
        if (select[item].id == 'NaN') {
            select[item].id = ''
        }
        $('#Complementos').append('<tr><td class="nomeComplemento">' + selctGrupo + '</td><td class="complemento">' + select[item].text + '<td class="valor">' + select[item].id + '</td>' + '<td> <i  style="color: darkred; cursor:pointer" class="material-icons excluir">delete_forever</i> </td></td></tr>')
        let sel = select[item].text
    }

    $('#divNovoGrupo').css('display', '')

    $(document).on('click', '.excluir', function () {

        let i = ($("#Complementos").find('.excluir').length)

        if (i <= 0) {
            $('#Complementos').css('display', 'none')
        } else {
            $('#Complementos').css('display', '')
        }

        var par = $(this).parent().parent(); //tr
        par.remove();

    })
})

$(document).on('click', '.obr', function () {

    if ($(this).attr('checado') == 'true') {
        $(this).attr('checado', 'false');
    } else {
        $(this).attr('checado', 'true');
    }
})

//CRIAR ITEM
$("#btnSalvarItem").click(function () {
    var checked = []
    let elements = []
    let adicionais = []
    /*
    $('#Complementos  tr').each(function () {
        if ($(this).find('.nomeComplemento').text() == "" && $(this).find('.valor').text() == "" && $(this).find('.obrigatorio input').val() == undefined) {
            console.log("")
        }
        else {

            elements.push({ complemento: $(this).find('.nomeComplemento').text(), valor: $(this).find('.valor').text(), obrigatorio: $(this).find('.obrigatorio input').val() });

        }
    })
    */

    let el = [];
    let al = [];

    $('#divComples').find('.divInputMaxMin').each(function () {
        let min = $(this).find('div .min:first').val()
        let max = $(this).find('div .max:first').val()
        let obr = $(this).find('div .obr:first').attr('checado');
        if (obr == 'true') {
            obr = 'obrigatório';
        } else {
            obr = '';
        }
        let grupo = $(this).find('h5').text();

        al.push({ grupo: grupo.replace('Grupo:', ''), min: min, max: max, obrigatorio: obr });
        $(this).find('table:first tr').each(function (index) {
            if ($(this).find('.nomeComp').text().length != 0) {

                el.push({ nome: $(this).find('.nomeComp').text(), valor: $(this).find('td:nth-child(2)').text() })
            }

        })

        adicionais.push(al.concat(el));
        al = [];
        el = [];
    })

    let dias = [], disponibilidade = {}
    $('#modalItem #divDias input').each(function (x) {
        dias.push($(this).is(':checked'))
    })
    disponibilidade = { dom: dias[0], seg: dias[1], ter: dias[2], qua: dias[3], qui: dias[4], sex: dias[5], sab: dias[6] }

    console.log(disponibilidade)


    if ($('input[name=nome]').val() == "") {
        msgswal('Campo Nome vazio', 'Preencha o campo Nome', 'error', 3000);
        return false;
    } else if ($('input[name=preco]').val() == "") {
        msgswal('O valor está vazio', 'Verifique o valor do produto', 'error', 3000);
        return false
    } else {

        let campos = {};

        $('.valid').each(function () {
            if (typeof ($(this).attr('name')) != 'undefined') {
                if (typeof ($(this).val()) != 'undefined' && $(this).val() != null) {
                    campos[$(this).attr('name')] = $(this).val();
                }
            }
        });
        $.ajax({
            url: '/cadastrarProduto',
            type: 'POST',
            //enctype: 'multipart/form-data',
            data: { campos: campos, adicionais: adicionais },
            beforeSend: function () {
                $('.divLoader').css('display', '');
            },
            error: (data) => {
                msgswal('Aviso!', data.responseJSON.validacao[0].msg, 'error', 3000);
                $('.divLoader').css('display', 'none');
            },
            success: (data) => {
                msgswal('Salvo com sucesso!', data.message, 'success', 3000);
                $('table.display').DataTable().ajax.reload()
                $('.divLoader').css('display', 'none')
                $('#Complementos tbody tr').empty();
                $('.modal').modal('close')
            }
        })
    }
})

$(document).on('click', '#mini, #maxi', function () {
    $("#mini, #maxi").on("keypress", function (evt) {
        var keycode = evt.charCode || evt.keyCode;
        if (keycode == 46 || this.value.length == 3) {
            return false;
        }
    });
})

$(document).on('click', '.btnnovogrupo', function () {
    $(".js-example-basic-multiple").val('').trigger('change')
    $('#selectGrupo1').prop('selectedIndex', 0)
})

$(document).on('click', '.btnCateg', function () {
    $('#modalItem').ready(function () {
        $(this).find('#divComples').empty();
    })
})

$(document).on('click', '.btnaddcomp', function () {
    let select = $('.select2criar').select2('data').length;
    let select1 = $('.select2criar').select2('data');
    let selctGrupo = $('#selectGrupo1 option:selected').text()
    if (select <= 0) {
        msgswal('Não há item selecionado!', 'Verifique os seletores', 'error', 3500);
        return false;
    } else {
        $("<div class='divInputMaxMin'> <h5 style='text-align: center; background-color: rgba(128, 0, 128, 0.500); border-radius: 3px; color: white; padding-top: 5px; padding-bottom: 5px; text-shadow: 1px 1px 1px black'>Grupo: " + selctGrupo + "</h5> <div style='display: flex;'><p>Mínimo:</p><input maxlength='3' pattern='([0-9]{3})' class='browser-default min' onkeydown='return event.keyCode !== 69' placeholder='Min' type='number' name='mini2' id='mini2'><p>Máximo:</p><input maxlength='3' pattern='([0-9]{3})' class='browser-default max' onkeydown='return event.keyCode !== 69' placeholder='Máx' type='number' name='maxi2' id='maxi2'><th><p><label class='lblObg'><input type='checkbox' class='filled-in obr' checado='false' /><span class='spanObg'>Obg.</span></label></p></th></div><table class='testetable centered'><thead><th>Nome</th><th>Valor</th><th>Ação</th></thead><tbody></tbody></table></div > ").appendTo("#divComples");

        for (var item = 0; item < select1.length; item++) {
            if (select1[item].id == "NaN") {
                select1[item].id = '0,00'
            }

            $(".testetable:last").append("<tr><td class='nomeComp'>" + select1[item].text + "&nbsp</td><td class='valor'>" + mascaraValor(select1[item].id) + "&nbsp</td><td><i style='cursor: pointer; color: darkred' class='material-icons excluir'>delete_forever</i></td></tr>")


            $('.excluir').click(function () {
                var par = $(this).parent().parent(); //tr
                if ($(this).parent().parent().parent().find('.excluir').length <= 1) {
                    $(this).parent().parent().parent().parent().parent().remove()
                }
                par.remove();
            })
        }
        $('#modalEscolhaComp').modal('close');
        msgswal('Tabela adicionada!', '', 'success', 2000);
    }
});

$(document).on('click', '.btnaddcomp1', function () {
    let select = $('.select2editar').select2('data').length;
    let select1 = $('.select2editar').select2('data');
    let selctGrupo = $('#selectGrupo2 option:selected').text()
    if (select <= 0) {
        msgswal('Não há item selecionado!', 'Verifique os seletores', 'error', 3500);
        return false;
    } else {
        $("<div class='divInputMaxMin1'> <h5 style='text-align: center; background-color: rgba(128, 0, 128, 0.500); border-radius: 3px; color: white; padding-top: 5px; padding-bottom: 5px; text-shadow: 1px 1px 1px black'>Grupo: " + selctGrupo + "</h5> <div style='display: flex;'><p>Mínimo:</p><input maxlength='3' pattern='([0-9]{3})' class='browser-default min1' onkeydown='return event.keyCode !== 69' placeholder='Min' type='number' name='mini2' id='mini2'><p>Máximo:</p><input maxlength='3' pattern='([0-9]{3})' class='browser-default max1' onkeydown='return event.keyCode !== 69' placeholder='Máx' type='number' name='maxi2' id='maxi2'><th><p><label class='lblObg'><input type='checkbox' class='filled-in' /><span class='spanObg'>Obg.</span></label></p></th></div><table class='testetable1 centered'><thead><th>Nome</th><th>Valor</th><th>Ação</th></thead><tbody></tbody></table></div > ").appendTo("#divComples1");

        for (var item = 0; item < select1.length; item++) {
            if (select1[item].id == "NaN") {
                select1[item].id = ''
            }

            $(".testetable1:last").append("<tr><td class='nomeComp1'>" + select1[item].text + "&nbsp</td><td class='valor2'>" + mascaraValor(select1[item].id) + "&nbsp</td><td><i style='cursor: pointer; color: darkred' class='material-icons excluir'>delete_forever</i></td></tr>")


            $('.excluir').click(function () {
                var par = $(this).parent().parent(); //tr
                if ($(this).parent().parent().parent().find('.excluir').length <= 1) {
                    $(this).parent().parent().parent().parent().parent().remove()
                }
                par.remove();
            })
        }
        $('#modalEscolhaComp1').modal('close');
        msgswal('Tabela adicionada!', '', 'success', 2000);
    }
});

$(document).on('blur', '#mini, #maxi', function () {
    if ($('#maxi').val().length >= 1 && $('#mini').val().length >= 1) {
        if ($('#maxi').val() < $('#mini').val()) {
            msgswalhtml('Máximo e Mínimo incorretos!', '<b>Máximo</b> está <b>MENOR</b> que <b>Mínimo</b', 'error', 5000);
        }
    }
})
$(document).on('blur', '#mini2, #maxi2', function () {
    if ($('#maxi2').val().length >= 1 && $('#mini2').val().length >= 1) {
        if ($('#maxi2').val() < $('#mini2').val()) {
            msgswalhtml('Máximo e Mínimo incorretos!', '<b>Máximo</b> está <b>MENOR</b> que <b>Mínimo</b>', 'error', 5000);
        }
    }
})

$(document).on('click', '.btnCateg', function () {
    $('#modalItem').ready(function () {

        $(".js-example-basic-multiple").val('').trigger('change')
        $('.forrmcriar').prop('selectedIndex', 0)
        $('#modalItem').find('input:text, textarea').not('input[name=catnomee]').val('')
        $("input[name='nome']").focus();

        if ($('#selectGrupo1 option:selected').val() == "0") {
            $('#select2item').attr('disabled', 'disabled')
        } else {
            $('#select2item').removeAttr('disabled')
        }
    })
})

// DUPLICAR ITEM
$(document).on('click', '.btnDupProd', function () {
    let ii = $(this).attr('data-id');

    var categ = $('#emailProp').attr('data-cat');
    var idrestaurante = $('#emailProp').attr('data-id');

    $.ajax({
        url: '/editarProduto/' + categ + '/' + ii + '/' + idrestaurante,
        success: function (response) {
            response.forEach(edit => {
                campos = {
                    nome: edit.nomeproduto,
                    descricao: edit.descricao,
                    preco: edit.valor,
                    idcateg: edit.codcategoria,
                    adicionais: edit.adicionais
                };
                $.ajax({
                    url: '/cadastrarProduto',
                    data: { campos: campos },
                    type: 'POST',
                    success: function (data) {
                        msgswal('Produto duplicado!', '', 'success', 3500);
                        $('.display').DataTable().ajax.reload()
                    }
                })
            })
        }
    })
})

// ATIVAR/PAUSAR ITEM
$(document).on('click', '.btnStatusProd', function () {
    let i = $(this).attr('data-id');
    var status = $(this).attr('data-status') == "true" ? false : true
    $(this).attr('data-status') == 'false' || $(this).attr('data-status') == 'null' ? $(this).removeClass('grey').addClass('orange') && $(this).find('i').text('pause') : $(this).removeClass('orange').addClass('grey') && $(this).find('i').text('play_arrow');

    $.ajax({
        url: '/updateStatusProduto/' + i,
        method: 'PUT',
        dataType: 'json',
        data: { status: status },
        beforeSend: () => {
            $(this).attr('disabled', 'disabled')
        },
        success: function (data) {
            $(this).removeAttr('disabled')
            msgswal('Atualizado com sucesso!', data.message, 'success', 3000);
            $('.display').DataTable().ajax.reload();
        },
        error: function (data) {
            $(this).removeAttr('disabled');
            msgswal('Erro ao salvar!', data.message, 'error', 3000);
            $('.display').DataTable().ajax.reload();
        }

    })

})

$(document).on('click', '#btnCat', function () {
    window.location.href = '/admin_card'
    $('.divLoader').css('display', '')
})

// IMPRIMIR RELATORIO
$(document).on('click', '.btnPDF', function () {
    let nomecat = $('#nomeCategoria b').text();

    Swal.fire({
        title: 'Defina o nome do arquivo',
        input: 'text',
        inputValue: `Relatório Geral de Produtos`,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: "#333",
        confirmButtonColor: "#800080",
        confirmButtonText: 'Gerar',
        inputValidator: (value) => {
            if (value == '' || value == null) {
                return 'Você precisa definir um nome'
            } else {

                $.ajax({
                    url: '/relatorio_produto',
                    beforeSend: function () {
                        $('.divLoader').css('display', '')
                    },
                    success: function (data) {
                        let strig1 = [];
                        if (data.length == 0) {
                            data.push([{ rowSpan: 1, colSpan: 6, styles: { halign: 'center', fontSize: 13 }, content: "Esta lista está vazia!" }]);
                        } else {
                            let datac = "";

                            data.forEach(element => {
                                //PEGA VALOR DA DATA
                                datac = element[4].toString()
                                //ENVIA DATA CORRETA
                                element[4] = datac.substr(8, 2) + '/' + datac.substr(5, 2) + '/' + datac.substr(0, 4);

                                //ENVIA VALOR FORMATADO
                                element[2] = mascaraValor(element[2])
                                if (element[2].length <= 2) {
                                    element[2] += ",00";
                                }


                            })
                        }


                        var cols = ["Categoria", "Nome produto", "Valor", "Desc", "Data Criada"]

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
                        doc.setFontSize(12)
                        doc.addImage(img, 'PNG', 40, 20, 100, 44);
                        doc.text(40, 120, `Local: {{nome}}`);
                        doc.text(40, 140, `Tipo: Tabela Geral de Produtos`);
                        var hoje = "Gerado: " + today;
                        doc.text(40, 100, hoje);

                        doc.autoTable(cols, data, {
                            startY: 170,

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
                                5: { cellWidth: 80 },
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
                                valign: 'middle',
                                halign: 'center',
                                fontSize: 12
                            },
                            alternateRowStyles: {
                                fillColor: [250, 250, 250]
                            },
                        });

                        doc.save(`${value}.pdf`);
                        $('.divLoader').css('display', 'none')
                        msgswal('Pronto!', 'O seu PDF já foi gerado', 'success', 2000);
                    }
                })
            }
        }
    })
})

// SAIR
$(document).on('click', '.logout', function () {
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


$(document).on('click', '#toolAddGrupo', function (e) {
    e.preventDefault();
    var i = $('.clone-campos').length;    //pega a quantidade de clones;
    var elementos = elm_html.replace(/\[[0\]]\]/g, '[' + i++ + ']');  //substitui o valor dos index e incrementa++
    $('#cloneCampos').append(elementos);  //exibe o clone.
});

$(document).on('change', '#selectGrupo1', function () {
    var idGrupo = $(this).val()
   
    let select1 = $('.select2criar')

    $.ajax({
        url: '/comple/' + idGrupo,
        beforeSend: function () {
            $('.divLoader').css('display', '')
        },
        success: function (response) {
            if (response.length > 0) {
                console.log(response)
                response.forEach(edit => {
                    var option = new Option(edit.nome, edit.valor, true, true);
                    select1.append(option).trigger('change');
                })
            }
            $('.divLoader').css('display', 'none')
        }
    })
    $('.select2criar').val(null).trigger('change');
})

$(document).on('change', '#selectGrupo2', function () {
    var idGrupo = $(this).val()
    let select1 = $('.select2editar')

    $.ajax({
        url: '/comple/' + idGrupo,
        beforeSend: function () {
            $('.divLoader').css('display', '')
        },
        success: function (response) {
            if (response.length > 0) {
                console.log(response)
                response.forEach(edit => {
                    var option = new Option(edit.nome, edit.valor, true, true);
                    select1.append(option).trigger('change');
                })
            }
            $('.divLoader').css('display', 'none')
        }
    })
    $('.select2editar').val(null).trigger('change');
})

$(document).on('click', '#confirmModalDel', function () {
    window.location.href = '/excluir_produto/' + id + '/' + idCategori
})

$(document).on('click', '#btnAddGrupos', function (e) {
    e.preventDefault();
    var i = $('.selcomp').length;    //pega a quantidade de clones;
    var elementos2 = elm_html2.replace(/\[[0\]]\]/g, '[' + i++ + ']');  //substitui o valor dos index e incrementa++
    $('.divAdCont').append(elementos2);  //exibe o clone.
});

$(document).on('click', '#adicionarComplementos', function () {
    var result = $('.check[type="checkbox"]:checked')

    setTimeout(function () {
        $('.tooltipped').tooltip();
    }, 50)

    $('#divResult').css('display', '')
    var grupo = $('.titleComps').html().toString()


    if (result.length > 0) {
        var resultString = []
        result.each(function () {
            resultString.push([$(this).val()])
            elements.push(JSON.stringify({ grupo: grupo, adicional: $(this).val() }))
        });

        $('#tableResult').append('<tr><td style="text-align: center">' + $('.titleComps').html() + '</td><td style="text-align: center">' + resultString + '</td><td style="text-align: center"><i style="color: darkred; cursor:pointer;text-shadow: 0.2px 0.2px 1px black" class="material-icons tooltipped" data-position="right" data-tooltip="Excluir complemento">delete</i></td></tr>')

        $("input[name='adicionaisComp']").val(elements);
    }
    else {
        $('#divResult').html(" No checkbox  is checked");
    }
})

//pegar valores do select
$(document).on('change', '#divHorarioTopo select', function () {
    $('#divHorarioTopo select').formSelect();
    var instance = M.FormSelect.getInstance($('#divHorarioTopo select'));
    var valor = instance.getSelectedValues();
});

//resertar select
$(document).on("click", '#btnDel', function () {
    $('#selcomp option').prop('selected', function () {
        return this.defaultSelected;
    });
});

$(document).on('click', '.excluir', function () {
    window.location.href = '/excluir_produto/' + idexcluir
})

$(document).on('click', '.excl', function () {
    idexcluir = jQuery(this).attr('data-id')
})

$(document).on('click', '.abrir', function () {
    id = $(this).attr('data-id')
    $.ajax({
        url: '/produtos1/' + id,
        success: function (response) {
            console.log(response)
            response.produtos.forEach(edit => {
                $('#descTable').append('<tr><td style="width: 33%; text-align: center">' + edit.nomeproduto + '</td><td style="width: 33%; text-align: center">' + edit.categoriaproduto + '</td><td style="width: 33%; text-align: center">' + edit.valor + '</td></tr>')
                $('#tableDesc').append('<tr><td style="text-align:center">' + edit.descricao + '</td></tr>')
            })
        }
    })
})

$(document).on('click', '.editcad', function () {
    $('#complementosEdit').empty()
    var ideditcad = jQuery(this).attr('data-id');
    $.ajax({
        url: '/produtos1/' + ideditcad,
        success: function (response) {
            response.produtos.forEach(edit => {
                $("input[name='nomeEdit']").val(edit.nomeproduto);
                $("input[name='valorEdit']").val(edit.valor);
                $("input[name='categoriaEdit']").val(edit.categoriaproduto);
                $("input[name='iddesc']").val(edit.idproduto);
                $("textarea[name='descricaoEdit']").val(edit.descricao);
                console.log(edit.adicionais)
                $('#complementosEdit').append('<tr><td>bebida</td><td class="complemento">' + edit.adicionais + '</td><td> <i  style="color: darkred; cursor:pointer" class="material-icons excluir">delete_forever</i> </td></td></tr>')
                $('.excluir').click(function () {
                    var par = $(this).parent().parent(); //tr
                    par.remove();
                })
            });
        }
    })
})

$(document).on('click', '.btnadcprod', function () {
    $.ajax({
        url: '/produtos/' + idprod1,
        success: function (response) {
            response.forEach(edit => {
                $("input[name='catnomee']").val(edit.categoriaproduto);
                $("input[name='catnomee']").val(edit.categoriaproduto);
                $("input[name='idcateg']").val(edit.idcategoriaproduto);
            })
        }
    })
})

// BOTÃO OCULTO IMAGEM >> AO MUDAR > MODAL create
$('#btninput1').on('change', function () {

    var reader = new FileReader();
    reader.onload = function (event) {
        $image_cropcreate.croppie('bind', {
            url: event.target.result
        })
    }

    reader.readAsDataURL(this.files[0]);
    $('#modalCropUserCreate').modal('open');
});

// CONFIRMAÇÃO CROP IMAGEM rest - create
$('.crop_imagecreate').on('click', function (event) {
    $image_cropcreate.croppie('result', {
        type: 'base64',
        format: 'jpeg' | 'png' | 'webp',
        size: 'original',
        quality: 1
    }).then(function (response) {
        $('#imgInside1').attr('src', response);
        $('#modalCropUserCreate').modal('close');

        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
        var uploadfile = $("input[name=imgPerfil]")[0].files[0];
        var formData = new FormData();
        formData.append("imgPerfil", uploadfile);
        console.log( $("input[name=imgPerfil]").val())
        $.ajax({
            url: '/cadastrarFotoProduto',
            method: 'POST',
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                console.log(data)
                $("input[name='fotocaminho']").val(data.message);
                msgswal('Sucesso', 'Imagem modificada', 'success')
            },
            error: function (msg) { }
        })

        function imageIsLoaded(e) {
            $('#imgInside1').attr('src', e.target.result);
            $('#btninput1').attr('src', e.target.result);
        }
    });
});

// BOTÃO OCULTO IMAGEM >> AO MUDAR > MODAL edit
$('#btninput2').on('change', function () {

    var reader = new FileReader();
    reader.onload = function (event) {
        $image_cropedit.croppie('bind', {
            url: event.target.result
        })
    }

    reader.readAsDataURL(this.files[0]);
    $('#modalCropUserEdit').modal('open');
});

// CONFIRMAÇÃO CROP IMAGEM rest - edit
$('.crop_imageedit').on('click', function (event) {
    $image_cropedit.croppie('result', {
        type: 'base64',
        format: 'jpeg' | 'png' | 'webp',
        size: 'original',
        quality: 1
    }).then(function (response) {
        $('#imgInside2').attr('src', response);
        $('#modalCropUserEdit').modal('close');

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
                msgswal('Sucesso', 'Imagem modificada', 'success')
            },
            error: function (msg) { }
        })

        function imageIsLoaded(e) {
            $('#imgInside2').attr('src', e.target.result);
            $('#btninput2').attr('src', e.target.result);
        }
    });
});

$(document).on('change', '.selc', function () {
    var socket = io('https://comeaee.herokuapp.com/');
    let status = $('.selc option:selected').html();
    if (status == 'Restaurante Aberto') {
        socket.emit("entrar", $("#nomePropEstab").attr('data-id'), function (valido) {
            console.log(valido)
        });
    }
    msgswalhtml('Aviso!', '<b>Restaurante ' + $(this).val() + '</b>.', 'info', 3500);
    $.ajax({
        url: '/statusfuncionamento',
        type: 'POST',
        data: { statusfuncionamento: $('.selc option:selected').text() },
        success: function (data) {
        }
    })
})

$(document).ready(function () {
   
   
        var socket = io('https://comeaee.herokuapp.com/');
        socket.on('atualizar mensagens', function (message) {
            Push.create("Comeaê", {
                body: message,
                icon: '/views/img/logocompletaroxo.png',
                requireInteraction: true,
                onClick: function () {
                    window.focus();
                    this.close();
                }
            });
        });
    
        $.ajax({
            url: "/listarStatusFuncionamento",
            beforeSend: function () {
                $('.divLoader').css('display', '')
            },
            success: function (data) {
                statusrest = data == null ? 'Fechado' : data.statusfuncionamento.replace('Restaurante', '');
                if (statusrest == " Aberto") {
                    socket.emit("entrar", $("#nomePropEstab").attr('data-id'), function (valido) {
                    });
                }
                $('.selc option[value=' + statusrest + ']').prop('selected', true);
                $('select').formSelect();
                $('.divLoader').css('display', 'none');
            }
        })

    $('#modalEscolhaComp').modal()
    $('#modalEscolhaComp1').modal()
    $('#modalDescComp').modal()
    $('#modalComplemento').modal()
    $('#modalEditarItem').modal({
        onCloseEnd: () => {
            $('#imgInside2').attr('src', '/views/img/base.png')
        },
        onOpenStart: () => {
            $('#modalEditarItem').find('input, textarea').each(function () {
                $(this).val('');
            })
        }
    })
    $('#modalItem').modal({
        onCloseEnd: () => {
            $('#imgInside1').attr('src', '/views/img/base.png')
        }
    })
    $('#modalExibItem').modal()

    // MODAL create > CROP > IMG CREATE
    $('#modalCropUserCreate').modal({
        dismissible: false,
        onOpenStart: function () {
        },
        onCloseStart: function () {
        }
    })
    // MODAL edit > CROP > IMG EDIT
    $('#modalCropUserEdit').modal({
        dismissible: false,
        onOpenStart: function () {
        },
        onCloseStart: function () {
        }
    })

    // INICIALIZADOR CROP IMAGEM create
    $image_cropcreate = $('#image_democreate').croppie({
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
    // INICIALIZADOR CROP IMAGEM edit
    $image_cropedit = $('#image_demoedit').croppie({
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

    VMasker(document.querySelector(".precocriar")).maskMoney({
        precision: 2,
        separator: ',',
        delimiter: '.'
    });

    VMasker(document.querySelector(".precoeditar")).maskMoney({
        precision: 2,
        separator: ',',
        delimiter: '.'
    });

    $('#Complementos').css('display', 'none')

    $('.js-example-basic-multiple').select2({
        placeholder: 'Selecione',
        language: {
            noResults: function () {
                return "Nada encontrado!";
            }
        }
    });
    $('.select2-search input').addClass('browser-default')

    let idCategoria = $('#nomeCategoria').attr('data-id');

    $('.display').DataTable({
        "ajax": '/listarProduto/' + idCategoria,
        "columns": [
            { "data": "nomeproduto" },
            { "data": null },
        ],
        "createdRow": function (row, data, rowIndex) {
        },
        "columnDefs": [
            { targets: '_all', className: 'center' },
            {
                targets: [1], width: '20%', render: (data) => {
                    return '<a data-id=' + data.id + ' class="btn-floating btn-small waves-effect waves-light blue darken-2 modal-trigger btnEditCateg" href="#modalEditarItem"><i class="material-icons">edit</i></a> <a data-id=' + data.id + ' class="btn-floating btn-small waves-effect waves-light red darken-4 btnDelProd"><i class="material-icons">delete_forever</i></a> <a data-id=' + data.id + ' class="btn-floating btn-small waves-effect waves-light green darken-2 btnDupProd"><i class="material-icons">content_copy</i></a> <a data-id=' + data.id + ' class="btn-floating btn-small waves-effect waves-light orange darken-3 btnStatusProd" data-status=' + data.status + '><i class="material-icons">pause</i></a>'
                }
            }
        ],
        "initComplete": function (settings, json) {
            $('.divLoader').css('display', 'none')
        },
        "drawCallback": function (settings) {
            $('table.display tr').each(function () {
                let bt = $(this).find('.btnStatusProd');
                bt.attr('data-status') == 'false' || bt.attr('data-status') == 'null' ? bt.removeClass('orange').addClass('grey') && bt.find('i').text('play_arrow') : bt.removeClass('grey').addClass('orange') && bt.find('i').text('pause');
            })
        },
        responsive: true,
        "scrollY": "260px",
        "scrollCollapse": true,
        "paging": false,
        "language": {
            "lengthMenu": "",
            "info": '',
            "zeroRecords": "Nada encontrado!",
            "infoEmpty": "Sem registros encontrados!",
            "infoFiltered": "(Filtrando por um total de  _MAX_ registros)",
            "sSearch": "Buscar:",
            "sEmptyTable": function () {
                return "Nada encontrado!";
            },

        },
        "bAutoWidth": true
    });

    $('.dataTables_filter input').addClass('browser-default').css('outline', 'none').css('height', '25px').css('border', '1px solid black').css('border-radius', '3px').css('padding-left', '3px')

    var elm_html = $('#clones').html();   //faz uma cópia dos elementos a serem clonados.

    $('.sidenav').sidenav();
    $('#sidenav-1').sidenav({ edge: 'left' });
    $('#divHorarioTopo select').formSelect();
    $('select').formSelect();
    $('input#input_text, textarea#textarea2').characterCounter();
    $('input#nome, textarea#textarea2').characterCounter();
    $('.tooltipped').tooltip();
    $('.tabs').tabs();
    $('.materialboxed').materialbox();

    var idCategori = $('#nomeCategoria').attr('data-id')

    $("input[name='idcat']").val(idCategori);

    $('.tst').on("select2:select select2:unselect", function (e) {
        let i = e.params.data, valor = i.id
        valor = valor == 'NaN' ? 0 : null;
    })

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