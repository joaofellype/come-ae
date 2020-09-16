module.exports = {
    permissao: function (req, res, next) {

        for (let item = 0; req.user.permissao.length > item; item++) {

            console.log(req.user.permissao[item])


        }

    }
}