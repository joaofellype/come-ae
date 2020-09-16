// MSG SWAL NORMAL
function msgswal(title, html, icon, timer) {
    Swal.fire({
        title: title,
        html: html,
        icon: icon,
        timer: timer,
        confirmButtonColor: "#800080"
    })
}

// TRIGGER LOADER CHANGE PAGE
$(document).on('click', '.trigger-loader', function () {
    $('.divLoader').css('display', '')
})

var socket = io('https://comeaee.herokuapp.com/');
socket.emit("entrar", $("#nomePropEstab").attr('data-id'), function (valido) { });
socket.on('atualizar mensagens', function (message) {
    Push.create("Comeaê", {
        body: message,
        icon: '/views/img/logocompletaroxo.png',
        requireInteraction: true,
        onClick: function () {
            window.location.href = "/admin_ped";
            this.close();
        }
    });
});

// MUDAR STATUS RESTAURANTE
$(document).on('change', '.selc', function () {
    var socket = io('https://comeaee.herokuapp.com/');
    let status = $('.selc option:selected').html();
    status == 'Restaurante Aberto' ? socket.emit("entrar", $("#nomePropEstab").attr('data-id'), function (valido) { }) : null;

    msgswal('Aviso!', '<b>Restaurante ' + $(this).val() + '</b>.', 'info', 3500);
    $.ajax({
        url: '/statusfuncionamento',
        type: 'POST',
        data: { statusfuncionamento: $('.selc option:selected').text() },
        success: function (data) {
        }
    })
})

$(document).ready(function () {

    !Cookies.get('token') ? window.location.href='/comeae' : null;

    // EXIBIR O STATUS DO RESTAURANTE
    $.ajax({
        url: "/listarStatusFuncionamento",
        beforeSend: function () {
            // $('.divLoader').css('display', '')
        },
        success: function (data) {
            statusrest = data == null ? 'Fechado' : data.statusfuncionamento.replace('Restaurante', '');
            if (statusrest == " Aberto") {
                socket.emit("entrar", $("#nomePropEstab").attr('data-id'), function (valido) {
                });
            }
            $('.selc option[value=' + statusrest + ']').prop('selected', true);
            $('select').formSelect();
            // $('.divLoader').css('display', 'none');
        }
    })

    // EXIBIR PEDIDOS NO AVISO PULSE
    $.ajax({
        url: '/countNovosPedidos',
        cache: false,
        type: 'GET',
        success: (data) => {
            $('.countPedido').html(data[0].count);
        },
        error: (data) => {
        }
    })

    // BTN SAIR ADMIN REST
    $('.logout').click(function () {
        Swal.fire({
            title: 'Deseja realmente sair?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#800080',
            cancelButtonColor: '#333',
            cancelButtonText: 'Não',
            confirmButtonText: 'Sim'
        }).then((result) => {
            if (result.value) {
                Cookies.remove('token')
                window.location.href = "/comeae";
                $('.divLoader').css('display', '')
            }
        })
    })

    // SIDENAV OPÇÕES
    $('#sidenav-1').sidenav({ edge: 'left' });
    // SELECT STATUS RESTAURANTE
    $('#divHorarioTopo select').formSelect();
    // REINICIAL SELECT STATUS
    $('select').formSelect();
    // CONTADOR INPUT
    $('input#input_text, textarea#textarea2, input#nome').characterCounter();

});

window.onscroll = function () { scrollFunction() };
function scrollFunction() {
    let side = $("#sidenav-1"), bttop = $('#btnTopo');
    document.body.scrollTop > 0 || document.documentElement.scrollTop > 0 ? side.css('marginTop', '0px') && side.css('transition', '.2s') : side.css('marginTop', '65px') && side.css('transition', '.2s');

    document.body.scrollTop > 300 || document.documentElement.scrollTop > 300 ? bttop.css('display', 'block') : bttop.css('display', 'none');
}