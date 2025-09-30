const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../app");
const { User } = require("../models"); // Importa el modelo de usuario

// Configuración de entorno de prueba
process.env.NODE_ENV = "test";

// Función para generar un token JWT para pruebas (por si lo necesitas en el futuro)
const generateToken = (user) => {
  return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "1h" });
};

describe("Rutas protegidas por JWT", () => {
  beforeAll(async () => {
    // Conectar a la base de datos de prueba y crear un usuario de prueba
    const hashedPassword = await bcrypt.hash("321654", 10);
    await User.create({
      email: "admin@gmail.com",
      password: hashedPassword,
      name: "Admin Test",
    });
  });

  afterAll(async () => {
    // Limpiar la base de datos después de las pruebas
    await User.destroy({ where: { email: "admin@gmail.com" } });
  });

  it("debería obtener un token y datos de usuario al iniciar sesión", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@gmail.com",
      password: "321654",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe("admin@gmail.com");
  });
});
