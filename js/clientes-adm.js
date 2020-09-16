// CARREGAR DADOS AO CLICAR NO BTN CLIENTES
$(document).on('click', '.clientes', function () {
    let id = $(this).attr('data-id');
    
    $.ajax({
        type: 'GET',
        url: '/listarOneUsuarios/'+id,
     
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: () => {
            $('.loader-place').append(loader)
        },
        success: (data) => {
           
            $('.nomeCliente').text(data.usuarios.nomeusuario)
            $('.cpfCliente').text(data.usuarios.cpf)
            $('.emailCliente').text(data.usuarios.emailusuario)
            $('.numeroCliente').text(data.usuarios.numerousuario)
            $('.cadastrado').text(data.usuarios.createdAt);
            $('.pedidosClientes').text(data.Pedidos[0].pedidos);
            $('.loader-place').empty()
        }
    })
})

$(document).ready(function () {

    $('.loader-place').append(loader)

    $('a[data-rel^=lightcase]').lightcase();

    $('#modalVisualizar').modal({
        onOpenStart: () => {
            $('.rodape-mobile').hide(200)
        },
        onCloseStart: () => {
            $('.rodape-mobile').show(200);
            atualizarDatatables();
        }
    });

    $('#tableClientes').DataTable({
        "ajax": "/listarAllClientes",
        "columns": [
            { "data": "emailusuario" },
            { "data": "nomeusuario" },
            { "data": null },
            { "data": null }
        ],
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
            { className: 'center', targets: '_all' },
            { targets: [0], render: $.fn.dataTable.render.ellipsis(40, true) },
            { targets: [1], render: $.fn.dataTable.render.ellipsis(40, true) },
            {
                targets: [2], render: function (data) {
                
                    return moment(data.createdAt).format('DD/MM/YYYY (HH:mm)')
                }
            },
            {
                targets: [3], render: function (data) {
                    return '<div class="kit-flex"> <button data-id=' + data.id + ' class="btn-small blue kit-flex bt-action-visualizar modal-trigger clientes" href="#modalVisualizar"><i class="material-icons">visibility</i></button> </div>'
                }, orderable: false
            }
        ],
        'initComplete': function (settings, json) {
            $('.loader-place').empty()
        },
        "createdRow": function (row) {
        },
        "drawCallback": function () {
        }
    });

    corrigirDatatables();

})