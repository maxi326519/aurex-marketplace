export const model = (sequelize: any, DataTypes: any) => {
  sequelize.define(
    "Storage",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      rag: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      site: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      positions: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currentCapacity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      totalCapacity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      updatedAt: false,
      timestamps: false,
      indexes: [
        {
          unique: true,
          name: "unique_rag_site",
          fields: ["rag", "site"],
        },
      ],
    }
  );
};
