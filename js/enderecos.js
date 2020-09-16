// LISTA OS ENDERECOS SALVOS
function listarEnderecos() {
    $('.lista-enderecos').empty()
    $.ajax({
        type: 'GET',
        url: '/listarEnderecosUsuarios',
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            var itens = `<div class="lazy-enderecos">
                            <div class="col l4 m6 s12">
                                <div class="ph-item item-restaurante card">
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
            $('.lista-enderecos').append(itens);
        },
        success: function (retorno) {

            $('.lazy-enderecos').remove();
            retorno.forEach(itens => {
                //Condições
                itens.nmrcasa == '' || itens.nmrcasa == null ? itens.nmrcasa = 's/n' : null;
                itens.complemento == '' || itens.complemento == null ? itens.complemento = 'Sem complemento' : null;
                itens.createdAt = moment(itens.createdAt).format('DD/MM/YYYY')

                let card = `<div class="col l4 m6 s12 card-local-geral" data-principal='${itens.principal}' data-id='${itens.id}'><a class="waves-effect waves-light item-local card"><span class="txt-adc">Adicionado em:</span><span class="endereco-salvo">${itens.createdAt}</span><div class="kit-flex dv-info"><span class="item-endereco endereco-local">${itens.rua}, Nº: ${itens.nmrcasa}, ${itens.bairro} - ${itens.cidade}/${itens.uf} (${itens.complemento})</span></div><span class="principal-end">Principal</span><div class="kit-flex dv-btn-geral"><div class="kit-flex waves-effect waves-light bt-edit modal-trigger" href="#editarEnderecoDados" data-id="${itens.id}"><i class="material-icons">edit</i><span>EDITAR</span></div><div class="kit-flex waves-effect waves-light bt-excluir" data-id="${itens.id}"><i class="material-icons">delete</i><span>REMOVER<span></div></div></a></div>`;
                $('.lista-enderecos').append(card);
            });
            addnew = '<div class="col l4 m6 s12 card-local-geral modal-trigger bt-novoend" href="#editarEnderecoDados"><a class="waves-effect waves-light item-local card"><div class="kit-flex"><i class="material-icons">home</i><span class="item-endereco endereco-local">Adicionar novo endereço</span></div></a></div>'
            $('.lista-enderecos').append(addnew);
            $('.lista-enderecos').find('.card-local-geral').each(function () {
                $(this).attr('data-principal') == 'false' ? $(this).find('.dv-info').addClass('no-princ') && $(this).find('.principal-end').remove() : null;
            })

            $('.tooltipped-principal').tooltip();
        },
        error: function (xhr) {
            // criar mensagem de erro
        }
    })
}

// MENSAGEM SWAL
function msgswal(title, text, type) {
    Swal.fire({
        title: title,
        text: text,
        timer: 3500,
        icon: type,
        confirmButtonColor: '#800080'
    })
}

// BOTÃO > EXCLUIR ENDERECO
$(document).on('click', '.bt-excluir', function () {
    let idcard = $(this).attr("data-id");
    Swal.fire({
        title: 'Excluir endereço',
        text: 'Deseja realmente excluir o endereço?',
        icon: 'warning',
        confirmButtonText: 'Sim',
        confirmButtonColor: '#800080',
        cancelButtonText: 'Não',
        cancelButtonColor: '#333',
        showCancelButton: true
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: 'PUT',
                url: '/deletarEnderecoUsuario/' + idcard,
                success: (data) => {
                    msgswal('Confirmação', 'Endereço deletado com sucesso!', 'success');
                    listarEnderecos();
                    verificarEnderecoModal();
                    console.log(data)
                },
                error: (data) => {

                }
            })

        } else {
            return false;
        }
    })
})

// BOTÃO DE SAIR >> LOGGOUT
$(document).on('click', '.bt-sair, .bt-sair-side', function () {
    Swal.fire({
        title: 'Saindo...',
        text: 'Deseja realmente sair?',
        icon: 'warning',
        confirmButtonText: 'Sim',
        confirmButtonColor: '#800080',
        cancelButtonText: 'Não',
        cancelButtonColor: '#333',
        showCancelButton: true
    }).then((result) => {
        if (result.value) {
            Cookies.remove('tokenUsuario');
            window.location.href = "/comeae";
        } else {
            return false;
        }
    })
})

// DETALHES ENDEREÇO
function listarEnderecoDetalhes() {
    $(document).on('click', '.bt-edit', function () {
        $('#editarEnderecoDados .modal-footer button:last').removeClass('bt-newend').addClass('bt-confirm-edit2');
        let id = $(this).attr("data-id");
        $.ajax({
            url: '/listarEnderecos/' + id,
            cache: false,
            beforeSend: () => {
                $('.loaderModalEditEnd').show();
            },
            success: (data) => {
                $('#cep2').val(data[0].cep)
                $('#rua2').val(data[0].rua)
                $('#numero2').val(data[0].nmrcasa)
                $('#quadra2').val(data[0].quadra)
                $('#bairro2').val(data[0].bairro)
                $('#cidade2').val(data[0].cidade)
                $('#complemento2').val(data[0].complemento);
                $('#UF-Endereco2').val(data[0].uf);
                $('#UF-Endereco2').formSelect()
                $('.bt-confirm-edit2').attr('data-id', data[0].id);
                $('.loaderModalEditEnd').hide();
                data[0].principal == true ? $('.switch-principal2 input').prop('checked', true) : null;
            }
        })
    })
};

// ATUALIZAR ENDEREÇO
function atualizarEndereco() {

    $(document).on('click', '.bt-confirm-edit2', function () {
        let cont = 0;
        $('#editarEnderecoDados input').each(function () {
            $(this).attr('required') && $(this).val() == "" ? cont++ : null;
        })

        if (cont > 0) {
            msgswal('Erro', 'Há campos vazios ou inválidos', 'error');
            return false;
        } else {
            let id = $(this).attr('data-id');
            $.ajax({
                type: 'PUT',
                url: '/updateEndereco/' + id,
                cache: false,
                beforeSend: () => {
                    $('.bt-confirm-edit2').attr('disabled', 'disabled').html('Enviando')
                    $('.bt-confirm-edit2').prev().attr('disabled', 'disabled');
                },
                data: {
                    cep: $('.cep2').val(),
                    rua: $('.rua2').val(),
                    nmrcasa: $('#numero2').val(),
                    quadra: $('#quadra2').val(),
                    bairro: $('#bairro2').val(),
                    cidade: $('#cidade2').val(),
                    uf: $('select#UF-Endereco2').val(),
                    complemento: $('#complemento2').val(),
                    principal: $('.switch-principal2 input').is(':checked')
                },
                success: (data) => {
                    Cookies.set("tokenUsuario", data.refreshToken)
                    $('.bt-confirm-edit2').removeAttr('disabled').html('Confirmar');
                    $('.bt-confirm-edit2').prev().removeAttr('disabled');
                    msgswal('Sucesso', 'Endereço atualizado', 'success');
                    $('#editarEnderecoDados').modal('close');
                    verificarEnderecoModal();
                }
            })
        }
    })
}

// TRANSFORMAR BT CLASS MODAL ENDEREÇO
$(document).on('click', '.bt-novoend', function () {
    $('.loaderModalEditEnd').hide(200, function () { $('#editarEnderecoDados .modal-footer button:last').removeClass('bt-confirm-edit2').addClass('bt-newend') })
})

$(document).on('click', '.bt-newend', function () {
    let cont = 0;
    $('#editarEnderecoDados input').each(function () {
        $(this).attr('required') && $(this).val() == "" ? cont++ : null;
    })

    if (cont > 0) {
        msgswal('Erro', 'Há campos vazios ou inválidos', 'error');
        return false;
    } else {
        $.ajax({
            url: '/cadastrarEnderecoPedido',
            type: 'POST',
            data: {
                cep: $('.cep2').val(), rua: $('.rua2').val(), complemento: $('#complemento2').val(), nmrcasa: $('#numero2').val(), bairro: $('#bairro2').val(), cidade: $('#cidade2').val(), uf: $('select#UF-Endereco2').val(), principal: $('.switch-principal2 input').is(':checked')
            }, beforeSend: () => {
                $('.bt-newend').attr('disabled', 'disabled').html('Enviando');
                $('.bt-newend').prev().attr('disabled', 'disabled');
            },
            success: function (data) {
                msgswal('Sucesso', 'Endereço salvo', 'success');
                $('#editarEnderecoDados').modal('close');
                $('.bt-newend').removeAttr('disabled', 'disabled').html('Confirmar');
                $('.bt-newend').prev().removeAttr('disabled', 'disabled');
                verificarEnderecoModal();
            }
        })
    }
})

$(document).ready(function () {

    var socket = io('https://comeaee.herokuapp.com/');
    socket.emit("entrar pedidos", $('.cod').val(), function (valido) {

    });
    socket.on('atualizar pedidos', function (message) {
        Push.create("Comeaê", {
            body: message,
            icon: '/views/img/logocompletaroxo.png',
            timeout: 4000,
            onClick: function () {
                window.focus();
                this.close();
            }
        });
    })
    listarEnderecos();
    listarEnderecoDetalhes();
    atualizarEndereco();
    var socket = io('http://localhost:3000');

    socket.on('atualizar pedidos', function (message) {
        Push.create("Comeaê", {
            body: message,
            icon: '/views/img/logocompletaroxo.png',
            timeout: 4000,
            onClick: function () {
                window.focus();
                this.close();
            }
        });
    })

    // MODAL > ENDERECOS
    $('#editarEnderecoDados').modal({
        onOpenStart: function () {
            $('.rodape-mobile').css('z-index', '99')
        },
        onCloseStart: function () {
            $('.rodape-mobile').css('z-index', '9999')
            $('#editarEnderecoDados').attr('data-idcard', '')
            $('#editarEnderecoDados').find('input').each(function () {
                $(this).val('').removeClass('valid').removeClass('invalid')
            })
            $('#UF-Endereco2').val("");
            $('#UF-Endereco2').formSelect();
            $('.check-principal').prop('checked', false);
            listarEnderecos();
            $('.switch-principal2 input').prop('checked', false);
        },
    });

    // SELECT UF > MODAL > DADOS
    $('#UF-Endereco2').formSelect();
});

// VERIFICAR CEP
function limpa_formulário_cep() {
    // Limpa valores do formulário de cep.
    $("#rua2").val("");
    $("#bairro2").val("");
    $("#cidade2").val("");
    $('#UF-Endereco2').val("");
    $('#UF-Endereco2').formSelect();
}

//Quando o campo cep perde o foco.
$("#cep2").blur(function () {
    //Nova variável "cep" somente com dígitos.
    var cep = $(this).val().replace(/\D/g, '');
    //Verifica se campo cep possui valor informado.
    if (cep != "") {
        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;
        //Valida o formato do CEP.
        if (validacep.test(cep)) {
            //Preenche os campos com "..." enquanto consulta webservice.
            $("#rua2").val("...");
            $("#bairro2").val("...");
            $("#cidade2").val("...");

            //Consulta o webservice viacep.com.br/
            $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                if (!("erro" in dados)) {
                    //Atualiza os campos com os valores da consulta.
                    $("#rua2").val(dados.logradouro);
                    $("#bairro2").val(dados.bairro);
                    $("#cidade2").val(dados.localidade);
                    $('#UF-Endereco2').val(dados.uf);
                    $('#UF-Endereco2').formSelect();
                } else {
                    //CEP pesquisado não foi encontrado.
                    limpa_formulário_cep();
                    msgswal('Erro', 'CEP não encontrado', 'error')
                }
            });
        } else {
            //cep é inválido.
            limpa_formulário_cep();
            msgswal('Erro', 'Formato de CEP inválido', 'error')
        }
    } else {
        //cep sem valor, limpa formulário.
        limpa_formulário_cep();
    }
});