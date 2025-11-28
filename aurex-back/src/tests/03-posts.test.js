const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../app");
const { User, Product, Post } = require("../db");

// Configuración de entorno de prueba
process.env.NODE_ENV = "test";

// Variables para almacenar datos de prueba
let testUser;
let testProduct;
let testPost;
let authToken;

// Función para generar un token JWT para pruebas
const generateToken = (user) => {
  return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "1h" });
};

describe("Rutas de Publicaciones (Posts)", () => {
  beforeAll(async () => {
    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash("test123", 10);
    testUser = await User.create({
      email: "testposts@example.com",
      password: hashedPassword,
      name: "Test Posts User",
    });

    // Generar token de autenticación
    authToken = generateToken({ id: testUser.id, email: testUser.email });

    // Crear producto de prueba
    testProduct = await Product.create({
      ean: "1234567890123",
      sku: "TEST-SKU-001",
      name: "Producto de Prueba",
      description: "Descripción del producto de prueba",
      price: 100.0,
      volumeType: 1,
      weight: 0.5,
      totalStock: 50,
      status: "Publicado",
    });
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    if (testPost) {
      await Post.destroy({ where: { id: testPost.id } });
    }
    if (testProduct) {
      await Product.destroy({ where: { id: testProduct.id } });
    }
    if (testUser) {
      await User.destroy({ where: { id: testUser.id } });
    }
  });

  describe("POST /api/posts - Crear Publicación", () => {
    it("debería crear una nueva publicación exitosamente", async () => {
      const postData = {
        productId: testProduct.id,
        title: "Publicación de Prueba",
        content: "Esta es una publicación de prueba para testing",
        price: 150.5,
      };

      const response = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send(postData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("productId", testProduct.id);
      expect(response.body).toHaveProperty("title", postData.title);
      expect(response.body).toHaveProperty("content", postData.content);
      expect(response.body).toHaveProperty("price", postData.price);
      expect(response.body).toHaveProperty("product");
      expect(response.body.product).toHaveProperty("id", testProduct.id);
      expect(response.body.product).toHaveProperty("name", testProduct.name);

      // Guardar para uso posterior
      testPost = response.body;
    });

    it("debería fallar al crear publicación sin productId", async () => {
      const postData = {
        title: "Publicación sin producto",
        content: "Esta publicación no tiene productId",
        price: 100.0,
      };

      const response = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send(postData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "productId is required");
    });

    it("debería fallar al crear publicación con productId inexistente", async () => {
      const postData = {
        productId: "00000000-0000-0000-0000-000000000000",
        title: "Producto Inexistente",
        content: "Esta publicación usa un productId que no existe",
        price: 100.0,
      };

      const response = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send(postData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Product not found");
    });

    it("debería fallar sin token de autenticación", async () => {
      const postData = {
        productId: testProduct.id,
        title: "Publicación sin auth",
        content: "Esta publicación no tiene token",
        price: 100.0,
      };

      const response = await request(app).post("/api/posts").send(postData);

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/posts - Obtener Publicaciones", () => {
    it("debería obtener todas las publicaciones", async () => {
      const response = await request(app)
        .get("/api/posts")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("product");
    });

    it("debería obtener publicaciones en modo marketplace", async () => {
      const response = await request(app)
        .get("/api/posts?marketplace=true")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0].product).toHaveProperty("id");
        expect(response.body[0].product).toHaveProperty("name");
        expect(response.body[0].product).toHaveProperty("sku");
        // En modo marketplace no debería incluir todos los campos
        expect(response.body[0].product).not.toHaveProperty("ean");
      }
    });

    it("debería filtrar publicaciones por título", async () => {
      const response = await request(app)
        .get("/api/posts?title=Prueba")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0].title).toMatch(/Prueba/i);
      }
    });

    it("debería filtrar publicaciones por categoría", async () => {
      const response = await request(app)
        .get("/api/posts?category1=Electrónicos")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0].product.category1).toBe("Electrónicos");
      }
    });

    it("debería filtrar publicaciones por rango de precios", async () => {
      const response = await request(app)
        .get("/api/posts?minPrice=100&maxPrice=200")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(parseFloat(response.body[0].price)).toBeGreaterThanOrEqual(100);
        expect(parseFloat(response.body[0].price)).toBeLessThanOrEqual(200);
      }
    });

    it("debería filtrar publicaciones por estado del producto", async () => {
      const response = await request(app)
        .get("/api/posts?status=Publicado")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0].product.status).toBe("Publicado");
      }
    });

    it("debería combinar múltiples filtros", async () => {
      const response = await request(app)
        .get("/api/posts?minPrice=100&maxPrice=200&status=Publicado")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/posts/user/:userId - Obtener Publicaciones por Usuario", () => {
    it("debería obtener publicaciones de un usuario específico", async () => {
      const response = await request(app)
        .get(`/api/posts/user/${testUser.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("PATCH /api/posts/:id - Actualizar Publicación", () => {
    it("debería actualizar una publicación existente", async () => {
      const updateData = {
        title: "Título Actualizado",
        content: "Contenido actualizado de la publicación",
        price: 200.0,
      };

      const response = await request(app)
        .patch(`/api/posts/${testPost.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", testPost.id);
      expect(response.body).toHaveProperty("title", updateData.title);
      expect(response.body).toHaveProperty("content", updateData.content);
      expect(response.body).toHaveProperty("price", updateData.price);
      expect(response.body).toHaveProperty("product");
    });

    it("debería fallar al actualizar publicación inexistente", async () => {
      const updateData = {
        title: "Título Actualizado",
        content: "Contenido actualizado",
      };

      const response = await request(app)
        .patch("/api/posts/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Post not found");
    });

    it("debería actualizar publicación cambiando producto", async () => {
      // Crear otro producto para el test
      const anotherProduct = await Product.create({
        ean: "9876543210987",
        sku: "TEST-SKU-002",
        name: "Otro Producto de Prueba",
        description: "Descripción de otro producto",
        price: 200.0,
        volumeType: 1,
        weight: 0.3,
        category1: "Hogar",
        category2: "Decoración",
        totalStock: 25,
        status: "Publicado",
      });

      const updateData = {
        productId: anotherProduct.id,
        title: "Nuevo Producto Asociado",
        content: "Publicación actualizada con nuevo producto",
        price: 300.0,
      };

      const response = await request(app)
        .patch(`/api/posts/${testPost.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("productId", anotherProduct.id);
      expect(response.body.product).toHaveProperty("id", anotherProduct.id);

      // Limpiar producto temporal
      await Product.destroy({ where: { id: anotherProduct.id } });
    });
  });

  describe("DELETE /api/posts/:id - Eliminar Publicación", () => {
    it("debería eliminar una publicación existente", async () => {
      const response = await request(app)
        .delete(`/api/posts/${testPost.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Post deleted successfully"
      );

      // Verificar que la publicación fue eliminada
      const deletedPost = await Post.findByPk(testPost.id);
      expect(deletedPost).toBeNull();
    });

    it("debería fallar al eliminar publicación inexistente", async () => {
      const response = await request(app)
        .delete("/api/posts/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Post not found");
    });
  });

  describe("Validaciones de Autenticación", () => {
    it("debería fallar todas las operaciones sin token", async () => {
      const responses = await Promise.all([
        request(app).get("/api/posts"),
        request(app).post("/api/posts").send({}),
        request(app).patch("/api/posts/test-id").send({}),
        request(app).delete("/api/posts/test-id"),
      ]);

      responses.forEach((response) => {
        expect(response.status).toBe(401);
      });
    });

    it("debería fallar con token inválido", async () => {
      const response = await request(app)
        .get("/api/posts")
        .set("Authorization", "Bearer token-invalido");

      expect(response.status).toBe(401);
    });
  });
});
