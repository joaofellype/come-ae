function msgswal(title, text, type) {
    Swal.fire({
        title: title,
        text: text,
        icon: type,
        timer: 4000,
        confirmButtonColor: "#800080"
    })
}

$('.bt-facebook-login').click(function(){
    OAuth.initialize('BbqbwzTHXyg9faeZ5ebbSgPut8Q')
    OAuth.popup('facebook').done(function(facebook) {
        console.log(facebook)
      // Prompts 'welcome' message with User's email on successful login
      // #me() is a convenient method to retrieve user data without requiring you
      // to know which OAuth provider url to call
      facebook.me().then(data => {
        
        
        })
      // Retrieves user data from OAuth provider by using #get() and
      // OAuth provider url
      facebook.get('/v2.5/me?fields=name,first_name,last_name,email,gender,location,locale,work,languages,birthday,relationship_status,hometown,picture').then(data => {
        console.log('self data:', data);

            $.ajax({
                type:'POST',
                url:'/cadastrarToken',
                data:{dados:data},
                success:(dados)=>{
                    if(dados.tokenUsuario){
                        Cookies.set('tokenUsuario',dados.tokenUsuario)
                        window.location.href="/comeae";
                    }else{
                        Cookies.set('user_new',dados.token)
                        window.location.href="/cadastroCliente/"+data.email;
                    }
                   
                }
                
            })
        
        })
    });
});


$(document).on("click", ".confirmarEmail", function () {
    if ($('input[name="emailEnviar"]').val() == "") {
        msgswal('Campo email vazio!', 'Preencha o campo email', 'error')
        return false;
    }

    $.ajax({
        type: 'POST',
        url: '/verificarEmail',
        beforeSend: function () {
            $('#btnCad').text('Enviando...').attr('disabled', 'disabled')
        },
        data: { email: $('input[name="emailEnviar"]').val() },
        success: function (data) {
            Swal.fire({
                title: 'Sucesso!',
                text: data.message,
                icon: 'success',
                timer: 4000,
                confirmButtonColor: '#800080'
            }).then((result) => {
                Cookies.get('editEmail') ? Cookies.remove('editEmail') : null;
                window.location.href = '/confirm-codigo/' + $('input[name="emailEnviar"]').val()
            })
        },
        error: function (data) {
            // há um erro aqui no "data.message" que não retorna
            msgswal('Erro!', data.message, 'error')
            $('#btnCad').text('Enviar').removeAttr('disabled')
        }
    })
});

$(document).on('click', '.esqsenha', function () {
    $('.swal2-input').attr('autocomplete')
    Swal.fire({
        validationMessage: 'Endereço de email inválido',
        html: '<p style="font-size: 27px">Digite seu email para recuperar a senha<p><br>',
        inputPlaceholder: 'Email',
        input: 'email',
        showCancelButton: true,
        cancelButtonColor: '#4b5f83',
        cancelButtonText: 'Cancelar',
        imageUrl: 'https://cdn1.iconfinder.com/data/icons/flat-business-icons/128/mail-512.png',
        imageHeight: 150,
        confirmButtonColor: 'purple',
        confirmButtonText: 'Confirmar',
        allowOutsideClick: true, //PERMITIR QUE SE FECHE O ALERT CLICANDO FORA DA CAIXA,
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
            var promise1 = new Promise(function (resolve, reject) {
                $.ajax({
                    type: 'POST',
                    url: '/redefinirSenhaCliente',
                    beforeSend: function () {
                        $('.divLoader').css('display', '')
                    },
                    data: { 'email': login },
                    cache: false,
                    success: function (response) {
                        console.log(response)
                        Swal.fire({
                            title: "Sucesso!",
                            html: response.message,
                            icon: "success",
                            confirmButtonColor: '#800080'
                        })
                        $('.divLoader').css('display', 'none')
                        resolve();
                    },
                    error: function (data) {
                        Swal.fire({
                            title: "Erro!",
                            html: data.responseJSON.message,
                            icon: "error",
                            confirmButtonColor: '#800080'
                        })
                        $('.divLoader').css('display', 'none')
                        reject();
                    }
                })
            });
        }
    })
})

$(document).on('click', '.logar', function () {
    let cont = 0;
    $('#formLogar').find('input').each(function (x) {
        $(this).val() == '' || $(this).hasClass('invalid') ? cont++ : null;
    })
    if (cont <= 0) {
        $.ajax({
            type: 'POST',
            url: '/login',
            beforeSend: function () {
                $('.logar').text('Verificando').attr('disabled', 'disabled')
            },
            dataType: 'json',
            data: { email: $('input[name="email"]').val(), senha: $('input[name="senha"]').val() },
            success: (data) => {
                Cookies.set('tokenUsuario', data.token);
                window.location.href = '/comeae'
                $('.logar').text('Sucesso!').removeAttr('disabled')
            },
            error: (error) => {
                $('.logar').text('Ops...').attr('disabled')
                Swal.fire({
                    title: 'Erro!',
                    text: error.responseJSON.message,
                    icon: 'error',
                    timer: 4000,
                    confirmButtonColor: '#800080'
                }).then(() => {
                    $('.logar').text('Confirmar').removeAttr('disabled')
                })
            }
        })
    } else {
        msgswal('Erro!', 'Há campos inválidos ou vazios', 'error')
        return false;
    }
})

$(document).ready(function () {
    Cookies.get('editEmail') ? $('#inp_email').val(Cookies.get('editEmail')) && $('#inp_email').focus()  : null;
    M.updateTextFields();
})