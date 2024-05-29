module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        customername: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });

    


    return Order;
};
