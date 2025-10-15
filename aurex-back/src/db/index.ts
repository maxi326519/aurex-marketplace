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
  PaymentOptions,
  Product,
  Stock,
  Storage,
  User,
  Business,
  Post,
  Order,
  OrderItem,
  Reception,
  Report,
  Review,
  Chat,
  Message,
} = sequelize.models;

User.hasOne(Business);
User.hasMany(Order); // Usuario que crea la orden
User.hasMany(Report); // Usuario que crea el reporte
User.hasMany(Review); // Usuario que crea la reseña
User.hasMany(Chat); // Usuario que participa en el chat
User.hasMany(Message); // Usuario que envía mensajes

Business.belongsTo(User);
Business.hasMany(Movements);
Business.hasMany(Reception);
Business.hasMany(PaymentOptions);
Business.hasMany(Product);
Business.hasMany(Post);
Business.hasMany(Order); // Business dueño de los productos en la orden
Business.hasMany(Report); // Business reportado
Business.hasMany(Chat); // Business que participa en el chat
Business.hasMany(Message); // Business que envía mensajes
Business.hasMany(Review); // Business que recibe reseñas

Storage.hasMany(Stock);
Storage.hasMany(Movements);

Product.belongsTo(Categories);
Product.belongsTo(Business); // Producto pertenece a un Business
Product.hasMany(Stock);
Product.hasMany(Movements);
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
Product.hasMany(Post, { foreignKey: "productId", as: "posts" });

Stock.belongsTo(Storage);
Stock.belongsTo(Product);
Stock.hasMany(Movements);

Post.belongsTo(Product, { foreignKey: "productId", as: "product" });
Post.belongsTo(Business); // Post pertenece a un Business
Post.hasMany(Review); // Post tiene muchas reseñas

Movements.belongsTo(Business); // Movement pertenece a un Business
Movements.belongsTo(Storage);
Movements.belongsTo(Stock);
Movements.belongsTo(Product);

PaymentOptions.belongsTo(Business); // PaymentOptions pertenece a un Business

Reception.belongsTo(Business); // Reception pertenece a un Business

Order.belongsTo(User); // Usuario que crea la orden
Order.belongsTo(Business); // Business dueño de los productos
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
Order.hasMany(Report); // Orden puede tener reportes
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Conexiones para Report
Report.belongsTo(User); // Usuario que crea el reporte
Report.belongsTo(Business); // Business reportado
Report.belongsTo(Order); // Orden relacionada al reporte
Report.belongsTo(Chat); // Chat asociado al reporte (opcional)

// Conexiones para Review
Review.belongsTo(User); // Usuario que crea la reseña
Review.belongsTo(Post); // Post reseñado

// Conexiones para Chat
Chat.belongsTo(User); // Usuario que participa en el chat
Chat.belongsTo(Business); // Business que participa en el chat (opcional)
Chat.belongsTo(User, { foreignKey: "AdminId", as: "Admin" }); // Admin que participa en el chat (opcional)
Chat.belongsTo(Report); // Reporte asociado al chat (opcional)
Chat.hasMany(Message); // Chat tiene muchos mensajes

// Conexiones para Message
Message.belongsTo(Chat); // Mensaje pertenece a un chat
Message.belongsTo(User); // Usuario que envía el mensaje (opcional)
Message.belongsTo(Business); // Business que envía el mensaje (opcional)
Message.belongsTo(User, { foreignKey: "AdminId", as: "Admin" }); // Admin que envía el mensaje (opcional)

export const conn = sequelize;
export const models = sequelize.models;
