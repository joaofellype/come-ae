function msgswal(title, html, icon, timer) {
    Swal.fire({
        title: title,
        html: html,
        icon: icon,
        timer: timer,
        confirmButtonColor: "#800080"
    })
}

$(window).on('load resize', function () {
    // REINICIAR DROPDOWN SAIR
    $('.dv-identificador-nav > i').html() == 'arrow_drop_up' ? setTimeout(() => { $('.dv-identificador-nav').click() }, 0) : null;
})

let loader = '<div class="loaderADM kit-flex"><div><div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue-only"></div></div><span class="fonte-primaria">Aguarde...</span></div></div>'

$(document).on('click', '.side-acoes > li, .card-resumo, .card-content', function () {
    $('.loader-place').empty();
    $('.loader-place').append(loader);
})

function corrigirDatatables() {
    $('.display').DataTable().columns.adjust().draw();
}
function atualizarDatatables() {
    $('.display').DataTable().ajax.reload();
}

$(document).on('click', '.bt-sair-adm', function () {
    Swal.fire({
        title: 'Saindo...',
        text: 'Deseja realmente sair?',
        icon: 'warning',
        showCancelButton: true,
        cancellButtonColor: "#333",
        confirmButtonColor: "#800080",
        confirmButtonText: "Sim",
        cancellButtonText: "Não"
    }).then((result) => {
        if (result.value) {
            $('.loader-place').append(loader);
            window.location.href = '/comeae-adm';
            Cookies.remove('manter');
        }
    })
})

$(document).ready(function () {

    // DROPDOWN SAIR
    $('.dropdown-sair-trigger').dropdown({
        coverTrigger: false,
        onOpenStart: () => {
            $('.dv-identificador-nav > i').html('arrow_drop_up')
        },
        onCloseStart: () => {
            $('.dv-identificador-nav > i').html('arrow_drop_down')
        },
    });

    // SIDENAV ACOES
    $('.side-acoes').sidenav({
        onOpenStart: function () {
            $('.rodape-mobile').hide(200)
            $('.navbar-comeae').attr('style', 'z-index: 99 !important');
        },
        onCloseStart: function () {
            $('.navbar-comeae').attr('style', 'z-index: 9999 !important');
            $('.rodape-mobile').show(200)
        }
    });
})