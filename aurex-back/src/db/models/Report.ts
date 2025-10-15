export const model = (sequelize: any, DataTypes: any) => {
  const Report = sequelize.define(
    "Report",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      openReason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      closeReason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      state: {
        type: DataTypes.ENUM("Abierto", "Cerrado"),
        allowNull: false,
        defaultValue: "Abierto",
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    { timestamps: false }
  );

  return Report;
};
