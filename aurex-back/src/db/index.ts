import { Sequelize, DataTypes } from "sequelize";
import path from "path";
import fs from "fs";
require("dotenv").config();

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

const options: any = {
  dialect: "mysql",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  logging: false,
  native: false,
  dialectOptions: {
    allowPublicKeyRetrieval: true,
  },
};

const sequelize = new Sequelize(options);

const basename = path.basename(__filename);

// Leer todos los archivos de la carpeta models y agregarlos al arreglo modelDefiners
const modelDefiners: Array<(sequelize: any, DataTypes: any) => void> = [];
fs.readdirSync(__dirname + "/models")
  /*   .map((file) => {
    console.log("File:", file);
    return file;
  }) */
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".ts" || file.slice(-3) === ".js")
  )
  .forEach((file) => {
    const modelDefiner = require(path.join(__dirname + "/models", file)).model;
    modelDefiners.push(modelDefiner);
  });

// Agregar todos los modelos definidos al objeto sequelize.models
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize, DataTypes);
}

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
export const {
  Categories,
  Movements,
  Product,
  Stock,
  Storage,
  User,
  Business,
  Post,
  Order,
  OrderItem,
  Reception,
} = sequelize.models;

User.hasMany(Movements);
User.hasMany(Reception);
User.hasOne(Business);

Business.belongsTo(User);

Reception.belongsTo(User);

Storage.hasMany(Stock);
Storage.hasMany(Movements);

Product.belongsTo(Categories);
Product.hasMany(Stock);
Product.hasMany(Movements);
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
Product.hasMany(Post, { foreignKey: "productId", as: "posts" });

Stock.belongsTo(Storage);
Stock.belongsTo(Product);
Stock.hasMany(Movements);

Post.belongsTo(Product, { foreignKey: "productId", as: "product" });

Movements.belongsTo(User);
Movements.belongsTo(Storage);
Movements.belongsTo(Stock);
Movements.belongsTo(Product);

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

export const conn = sequelize;
export const models = sequelize.models;
