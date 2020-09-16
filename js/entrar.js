
$('#btnFacebook').click(function(){
    OAuth.initialize('BbqbwzTHXyg9faeZ5ebbSgPut8Q')
    OAuth.popup('facebook').done(function(facebook) {
        console.log(facebook)
      // Prompts 'welcome' message with User's email on successful login
      // #me() is a convenient method to retrieve user data without requiring you
      // to know which OAuth provider url to call
      facebook.me().then(data => {
        console.log('me data:', data);

     

        alert('Facebook says your email is:' + data.email + ".\nView browser 'Console Log' for more details");
        
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


