export const model = (sequelize: any, DataTypes: any) => {
  sequelize.define(
    "PaymentOptions",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('link', 'transferencia'),
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pasarela: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cvu: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cbu: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otrosDatos: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    { timestamps: true }
  );
};