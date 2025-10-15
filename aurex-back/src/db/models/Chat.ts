export const model = (sequelize: any, DataTypes: any) => {
  const Chat = sequelize.define(
    "Chat",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM("Venta", "Reporte"),
        allowNull: false,
      },
      state: {
        type: DataTypes.ENUM("Abierto", "Cerrado"),
        allowNull: false,
        defaultValue: "Abierto",
      },
    },
    { timestamps: false }
  );

  return Chat;
};
