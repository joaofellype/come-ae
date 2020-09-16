function msgswal(title, text, icon, timer) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: timer,
        confirmButtonColor: "#800080"
    })
}

// VALIDAR EMAIL
$(document).on('keyup input focus', 'input[type=email]', function () {
    $(this).val().length < 6 ? $(this).addClass('invalid').removeClass('valid') : $(this).addClass('valid').removeClass('invalid');
})
$(document).on('keyup input focus', 'input[type=email]', function () {
    validateEmail($(this).val()) ? $(this).addClass('valid').removeClass('invalid') : $(this).addClass('invalid').removeClass('valid');
})
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// VALIDAR NOME
$(document).on('input focus', '#nomeadm', function () {
    /\w+\s+\w+/.test($(this).val()) ? $(this).addClass('valid').removeClass('invalid') : $(this).addClass('invalid').removeClass('valid');
})

// VERIFICAR SENHAS
$(document).on('input focus', 'input[type=password]', function () {
    $(this).val().length >= 6 ? $(this).addClass('valid').removeClass('invalid') : $(this).addClass('invalid').removeClass('valid');
})

// SALVAR NOVO ADMIN
$(document).on('click', '.bt-add-adm', function () {
    let cont = 0;
    $('.fm-add-adm').find('input').each(function () {
        $(this).val() == '' || $(this).val().length <= 0 || $(this).hasClass('invalid') ? $(this).addClass('invalid') && cont++ : null;
    })

    if (cont <= 0) {

        $.ajax({
            type: 'POST',
            url: '/createAdmin',
            data: { nome: $('#nomeadm').val(), email: $('#emailadm').val(), senha: $('#senhaadm').val() },
            cache: false,

            beforeSend: function () {
                $('.bt-add-adm').text('Enviando').attr('disabled', 'disabled');
            },
            success: (data) => {
                $('.bt-add-adm').text('Enviar').removeAttr('disabled');
                msgswal('Confirmação', 'Novo administrador cadastrado', 'success', 3500);
                $('.fm-add-adm').find('input').each(function () {
                    $(this).removeClass('valid').val('');
                })
            },
            error: () => {
                $('.bt-add-adm').text('Enviar').removeAttr('disabled');
                msgswal('Erro', 'Ocorreu um erro', 'error', 3500)
            }
        })
    } else {
        msgswal('Inválido', 'Há campos inválidos ou vazios', 'error', 3500);
        return false;
    }
})

$(document).on('click', '[class^="tab-"]', function () {
    corrigirDatatables()
})

// CARREGAR DADOS AO CLICAR NO BTN ADMINS
$(document).on('click', '.admins', function () {
    $.ajax({
        type: 'GET',
        url: 'https://reqres.in/api/users?page=2',
        dataType: 'json',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            // $('.loader-place').append(loader);
        },
        success: (data) => {

            $('.loader-place').empty();
        },
        error: () => {
            // $('#modalVisualizar').modal('close');
        }
    })
})

$(document).on('click', '.bt-admin', function () {
    setTimeout(() => { corrigirDatatables() }, 250);
    $('.fm-add-adm').hide(200);
    $('.dv-admin-table').show(200);
    $('.bt-admin i').html('arrow_back');
    $('.bt-admin').addClass('bt-admin-rtn').addClass('bt-admin')
})

$(document).on('click', '.bt-admin-rtn', function () {
    setTimeout(() => { corrigirDatatables() }, 250);
    $('.fm-add-adm').show(200);
    $('.dv-admin-table').hide(200);
    $('.bt-admin i').html('person');
    $('.bt-admin').addClass('bt-admin').removeClass('bt-admin-rtn');
})

$(document).on('click', '.bt-action-deletar', () => {
    Swal.fire({
        title: 'Excluindo',
        icon: 'warning',
        text: 'Deseja realmente excluir este admin?',
        confirmButtonColor: "#800080",
        showCancelButton: true,
        cancelButtonColor: "#333",
        cancelButtonText: "Não",
        confirmButtonText: "Sim"
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: 'GET',
                url: 'https://reqres.in/api/users?page=2',
                dataType: 'json',
                cache: false,
                contentType: "application/json; charset=utf-8",
                beforeSend: () => {
                    // atualizarDatatables();
                },
                success: () => {
                    msgswal('Confirmação', 'Admin deletado com sucesso', 'success', 3500);
                },
                error: () => {
                    msgswal('Erro', 'Erro na execução da tarefa', 'error', 3500);
                }
            })
        }
    })
})

$(document).ready(function () {

    $('#modalVisualizar').modal({
        onOpenStart: () => {
            $('.rodape-mobile').hide(200)
        },
        onCloseStart: () => {
            $('.rodape-mobile').show(200);
            // atualizarDatatables();
        }
    });

    $('.loader-place').empty();

    $('#tableAdmin').DataTable({
        "language": {
            "lengthMenu": "",
            "zeroRecords": "Nada encontrado - Desculpe",
            "info": "Exibindo _PAGE_ de _PAGES_",
            "infoEmpty": "Sem registros",
            "infoFiltered": "(Filtrando por _MAX_ registros)",
            "sSearch": "Busca:"
        },
        "bInfo": true,
        "bPaginate": false,
        scrollY: 200,
        responsive: true,
        "columnDefs": [
            { targets: '_all', className: 'center' },
            { targets: [3], orderable: false }
        ],
        'initComplete': function (settings, json) {
            $('.loader-place').empty()
        },
        "drawCallback": function () {
        }
    });

    corrigirDatatables();

})