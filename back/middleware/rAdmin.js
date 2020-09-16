module.exports={
    rAdmin: function(req,res,next){
        
        if(req.isAuthenticated()&&req.user.nomeusuario!=null){
            if( req.route.path =="/log_rest"){
               res.writeHead(302 , {
                'Location' : '/admin_start' // This is your url which you want
            });
            res.end();
           } else{

               return next();
           }
            
        } else{

           res.render('log_rest')
        }
        
    }
} 