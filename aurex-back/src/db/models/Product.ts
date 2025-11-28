export const model = (sequelize: any, DataTypes: any) => {
  sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ean: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      volumeType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      totalStock: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM("Publicado", "Oculto", "Sin stock"),
        allowNull: false,
      },
    },
    { updatedAt: false, timestamps: false }
  );
};
