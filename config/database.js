require('dotenv').config()
module.exports={
    dialect:'postgres',
    host:process.env.DB_HOST,
    port:process.env.DB_PORTA,
    username:process.env.DB_USUARIO,
    password:process.env.DB_SENHA,
    database:process.env.DB_BASE,
    timezone:process.env.TIME_ZONE,
    dialectOptions:{
        ssl:(process.env.DB_HOST!='localhost')?true:false,
        useUTC:false
    
    },

    
    define:{ 
        timestamps:true,
        underescored:true
    }

}