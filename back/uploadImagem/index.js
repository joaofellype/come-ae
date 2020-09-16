const multer = require('multer');

module.exports = (multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            console.log(req);
            cb(null, '/app/views/img/uploads/');
        },
        filename: (req, file, cb) => {

            cb(null, Date.now() + file.originalname)
        }
    }),
        fileFilter: (req, file, cb) => {
            const isAccepted = ['image/png','image/jpg','image/jpeg'].find(formatoAceito=>formatoAceito==file.mimetype);

            if(isAccepted){
                return cb(null,true);
            }
            return cb(null,false);
       }


}));
