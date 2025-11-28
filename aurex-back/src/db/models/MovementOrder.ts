export const model = (sequelize: any, DataTypes: any) => {
  sequelize.define(
    "MovementOrder",
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
      receptionDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("ENTRADA", "SALIDA"),
        allowNull: false,
      },
      state: {
        type: DataTypes.ENUM(
          "Pendiente",
          "Aprobado",
          "En revisión",
          "Parcial",
          "Completado"
        ),
        allowNull: false,
      },
      sheetFile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      remittance: {
        type: DataTypes.STRING,
        allowNull: true, // Opcional para egresos
      },
    },
    { updatedAt: false, timestamps: false }
  );
};
