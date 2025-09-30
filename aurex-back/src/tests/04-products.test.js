const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../app");
const { User, Product } = require("../db");

// Configuración de entorno de prueba
process.env.NODE_ENV = "test";

// Variables para almacenar datos de prueba
let testUser;
let testProducts = [];
let authToken;

// Función para generar un token JWT para pruebas
const generateToken = (user) => {
  return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "1h" });
};

describe("Rutas de Productos", () => {
  beforeAll(async () => {
    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash("test123", 10);
    testUser = await User.create({
      email: "testproducts@example.com",
      password: hashedPassword,
      name: "Test Products User",
    });

    // Generar token de autenticación
    authToken = generateToken({ id: testUser.id, email: testUser.email });
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    if (testProducts.length > 0) {
      await Product.destroy({
        where: { id: testProducts.map(p => p.id) }
      });
    }
    if (testUser) {
      await User.destroy({ where: { id: testUser.id } });
    }
  });

  describe("POST /api/products - Crear Producto", () => {
    it("debería crear un producto exitosamente", async () => {
      const productData = {
        ean: "1234567890123",
        sku: "TEST-PROD-001",
        name: "Producto de Prueba",
        description: "Descripción del producto de prueba",
        price: 150.50,
        volumeType: 1,
        weight: 0.5,
        category1: "Electrónicos",
        category2: "Smartphones",
        totalStock: 100,
        status: "Publicado",
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("ean", productData.ean);
      expect(response.body).toHaveProperty("sku", productData.sku);
      expect(response.body).toHaveProperty("name", productData.name);
      expect(response.body).toHaveProperty("description", productData.description);
      expect(response.body).toHaveProperty("price", productData.price);
      expect(response.body).toHaveProperty("volumeType", productData.volumeType);
      expect(response.body).toHaveProperty("weight", productData.weight);
      expect(response.body).toHaveProperty("category1", productData.category1);
      expect(response.body).toHaveProperty("category2", productData.category2);
      expect(response.body).toHaveProperty("totalStock", productData.totalStock);
      expect(response.body).toHaveProperty("status", productData.status);

      // Guardar para uso posterior
      testProducts.push(response.body);
    });

    it("debería crear un producto de categoría Electrónicos", async () => {
      const productData = {
        ean: "9876543210987",
        sku: "ELEC-001",
        name: "Smartphone Samsung Galaxy",
        description: "Smartphone de última generación",
        price: 599.99,
        volumeType: 1,
        weight: 0.2,
        category1: "Electrónicos",
        category2: "Smartphones",
        totalStock: 50,
        status: "Publicado",
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.category1).toBe("Electrónicos");
      expect(response.body.category2).toBe("Smartphones");

      testProducts.push(response.body);
    });

    it("debería crear un producto de categoría Ropa", async () => {
      const productData = {
        ean: "5555555555555",
        sku: "ROPA-001",
        name: "Camiseta de Algodón",
        description: "Camiseta 100% algodón",
        price: 25.00,
        volumeType: 2,
        weight: 0.3,
        category1: "Ropa",
        category2: "Camisetas",
        totalStock: 200,
        status: "Publicado",
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.category1).toBe("Ropa");
      expect(response.body.category2).toBe("Camisetas");

      testProducts.push(response.body);
    });

    it("debería crear un producto sin stock", async () => {
      const productData = {
        ean: "8888888888888",
        sku: "SIN-STOCK-001",
        name: "Producto Agotado",
        description: "Producto temporalmente sin stock",
        price: 99.99,
        volumeType: 1,
        weight: 0.8,
        category1: "Electrónicos",
        category2: "Accesorios",
        totalStock: 0,
        status: "Sin stock",
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.totalStock).toBe(0);
      expect(response.body.status).toBe("Sin stock");

      testProducts.push(response.body);
    });

    it("debería fallar al crear producto sin EAN", async () => {
      const productData = {
        sku: "PROD-ERROR-001",
        name: "Producto sin EAN",
        description: "Este producto no tiene EAN",
        price: 100.00,
        volumeType: 1,
        weight: 0.5,
        category1: "Test",
        category2: "Error",
        totalStock: 10,
        status: "Publicado",
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData);

      expect(response.status).toBe(500);
    });

    it("debería fallar al crear producto sin SKU", async () => {
      const productData = {
        ean: "1111111111111",
        name: "Producto sin SKU",
        description: "Este producto no tiene SKU",
        price: 100.00,
        volumeType: 1,
        weight: 0.5,
        category1: "Test",
        category2: "Error",
        totalStock: 10,
        status: "Publicado",
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData);

      expect(response.status).toBe(500);
    });

    it("debería fallar al crear producto sin nombre", async () => {
      const productData = {
        ean: "2222222222222",
        sku: "PROD-ERROR-003",
        description: "Este producto no tiene nombre",
        price: 100.00,
        volumeType: 1,
        weight: 0.5,
        category1: "Test",
        category2: "Error",
        totalStock: 10,
        status: "Publicado",
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData);

      expect(response.status).toBe(500);
    });

    it("debería fallar sin token de autenticación", async () => {
      const productData = {
        ean: "3333333333333",
        sku: "PROD-NO-AUTH",
        name: "Producto sin auth",
        description: "Este producto no tiene token",
        price: 100.00,
        volumeType: 1,
        weight: 0.5,
        category1: "Test",
        category2: "Error",
        totalStock: 10,
        status: "Publicado",
      };

      const response = await request(app)
        .post("/api/products")
        .send(productData);

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/products - Obtener Productos", () => {
    it("debería obtener todos los productos", async () => {
      const response = await request(app)
        .get("/api/products")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("debería fallar sin token de autenticación", async () => {
      const response = await request(app)
        .get("/api/products");

      expect(response.status).toBe(401);
    });
  });

  describe("PATCH /api/products - Actualizar Producto", () => {
    it("debería actualizar un producto existente", async () => {
      const updateData = {
        id: testProducts[0].id,
        name: "Producto Actualizado",
        description: "Descripción actualizada del producto",
        price: 199.99,
        totalStock: 150,
        status: "Publicado",
      };

      const response = await request(app)
        .patch("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Product updated successfully");
    });

    it("debería fallar al actualizar producto inexistente", async () => {
      const updateData = {
        id: "00000000-0000-0000-0000-000000000000",
        name: "Producto Inexistente",
        price: 100.00,
      };

      const response = await request(app)
        .patch("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error", "Product not found");
    });

    it("debería fallar sin token de autenticación", async () => {
      const updateData = {
        id: testProducts[0].id,
        name: "Producto sin auth",
      };

      const response = await request(app)
        .patch("/api/products")
        .send(updateData);

      expect(response.status).toBe(401);
    });
  });

  describe("PATCH /api/products/:id - Deshabilitar/Habilitar Producto", () => {
    it("debería deshabilitar un producto existente", async () => {
      const response = await request(app)
        .patch(`/api/products/${testProducts[0].id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ disabled: true });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Product disabled successfully");
    });

    it("debería habilitar un producto existente", async () => {
      const response = await request(app)
        .patch(`/api/products/${testProducts[0].id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ disabled: false });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Product enabled successfully");
    });

    it("debería fallar al deshabilitar producto inexistente", async () => {
      const response = await request(app)
        .patch("/api/products/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ disabled: true });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Error changing product status");
    });

    it("debería fallar sin campo disabled", async () => {
      const response = await request(app)
        .patch(`/api/products/${testProducts[0].id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Error changing product status");
    });

    it("debería fallar sin token de autenticación", async () => {
      const response = await request(app)
        .patch(`/api/products/${testProducts[0].id}`)
        .send({ disabled: true });

      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /api/products/:id - Eliminar Producto", () => {
    it("debería eliminar un producto existente", async () => {
      // Crear un producto temporal para eliminar
      const tempProduct = await Product.create({
        ean: "9999999999999",
        sku: "TEMP-DELETE-001",
        name: "Producto Temporal",
        description: "Producto para eliminar",
        price: 50.00,
        volumeType: 1,
        weight: 0.1,
        category1: "Test",
        category2: "Temporal",
        totalStock: 1,
        status: "Publicado",
      });

      const response = await request(app)
        .delete(`/api/products/${tempProduct.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", `Product with ID ${tempProduct.id} successfully removed.`);

      // Verificar que el producto fue eliminado
      const deletedProduct = await Product.findByPk(tempProduct.id);
      expect(deletedProduct).toBeNull();
    });

    it("debería fallar al eliminar producto inexistente", async () => {
      const response = await request(app)
        .delete("/api/products/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error", "Product not found");
    });

    it("debería fallar sin token de autenticación", async () => {
      const response = await request(app)
        .delete(`/api/products/${testProducts[0].id}`);

      expect(response.status).toBe(401);
    });
  });

  describe("Validaciones de Autenticación", () => {
    it("debería fallar todas las operaciones sin token", async () => {
      const responses = await Promise.all([
        request(app).get("/api/products"),
        request(app).post("/api/products").send({}),
        request(app).patch("/api/products").send({}),
        request(app).patch("/api/products/test-id").send({}),
        request(app).delete("/api/products/test-id"),
      ]);

      responses.forEach(response => {
        expect(response.status).toBe(401);
      });
    });

    it("debería fallar con token inválido", async () => {
      const response = await request(app)
        .get("/api/products")
        .set("Authorization", "Bearer token-invalido");

      expect(response.status).toBe(401);
    });
  });

  describe("Validaciones de Datos", () => {
    it("debería validar tipos de datos correctos", async () => {
      const productData = {
        ean: "4444444444444",
        sku: "VALID-TYPES-001",
        name: "Producto con Tipos Válidos",
        description: "Producto con todos los tipos correctos",
        price: 75.50, // number
        volumeType: 2, // number
        weight: 1.5, // number
        category1: "Validación",
        category2: "Tipos",
        totalStock: 25, // number
        status: "Oculto", // string válido del enum
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(typeof response.body.price).toBe("number");
      expect(typeof response.body.volumeType).toBe("number");
      expect(typeof response.body.weight).toBe("number");
      expect(typeof response.body.totalStock).toBe("number");
      expect(typeof response.body.status).toBe("string");

      testProducts.push(response.body);
    });

    it("debería validar estados de producto válidos", async () => {
      const validStatuses = ["Publicado", "Oculto", "Sin stock"];
      
      for (let i = 0; i < validStatuses.length; i++) {
        const productData = {
          ean: `555555555555${i}`,
          sku: `STATUS-TEST-00${i}`,
          name: `Producto Estado ${validStatuses[i]}`,
          description: `Producto con estado ${validStatuses[i]}`,
          price: 100.00,
          volumeType: 1,
          weight: 0.5,
          category1: "Validación",
          category2: "Estados",
          totalStock: 10,
          status: validStatuses[i],
        };

        const response = await request(app)
          .post("/api/products")
          .set("Authorization", `Bearer ${authToken}`)
          .send(productData);

        expect(response.status).toBe(201);
        expect(response.body.status).toBe(validStatuses[i]);

        testProducts.push(response.body);
      }
    });
  });
});

