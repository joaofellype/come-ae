const {
    Model,
    DataTypes
} = require('sequelize');

class Estados extends Model {
    static init(sequelize) {
        super.init({
                    estado:DataTypes.STRING,
                    stts:DataTypes.BOOLEAN
        }, {
            sequelize
        })
    } 
 
}
module.exports = Estados;