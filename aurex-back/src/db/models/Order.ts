export const model = (sequelize: any, DataTypes: any) => {
  sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "Pendiente",
          "Preparado",
          "Completado",
          "Cancelado"
        ),
        allowNull: false,
        defaultValue: "Pendiente",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      supplier: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      trackingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      courier: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      pickedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      preparedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completedAt: {
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
