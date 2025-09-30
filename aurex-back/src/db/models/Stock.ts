export const model = (sequelize: any, DataTypes: any) => {
  sequelize.define(
    "Stock",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      enabled: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isFull: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    { updatedAt: false, timestamps: false }
  );
};
