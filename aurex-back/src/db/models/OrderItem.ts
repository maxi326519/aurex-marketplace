export const model = (sequelize: any, DataTypes: any) => {
  sequelize.define(
    "OrderItem",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      pickedQuantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      isPicked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isScanned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      scannedEAN: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pickedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      scannedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { 
      updatedAt: false, 
      timestamps: true,
      createdAt: true,
      deletedAt: false
    }
  );
};
