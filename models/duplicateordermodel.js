module.exports = (sequelize, DataTypes) => {
    const duplicate_Order = sequelize.define('duplicate_Order', {
        customername: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });


    return duplicate_Order;
};
