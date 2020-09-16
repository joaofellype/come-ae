const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = 'd6F3Efeq';
const validation={
    
    hashpassword(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8))

     },
     comparePassword(salt,password){
        return bcrypt.compareSync(password, salt);

     },
     isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
      },
     generateToken(id){
         const token =jwt.sign({
             userId:id
         },
         'bigodinho-matheus',{expiresIn:'1h'}
         );
         return token;
     },
     encrypt(text){

        var cipher = crypto.createCipher(algorithm,password)
        var crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
      },
      decrypt(text){
        var decipher = crypto.createDecipher(algorithm,password)
        var dec = decipher.update(text,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
      }
}

module.exports= validation;