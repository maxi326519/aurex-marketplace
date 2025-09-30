/**
 * Script de configuración para tests de Posts
 * Este archivo contiene utilidades y configuraciones para los tests de publicaciones
 */

const { User, Product, Post } = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Crea datos de prueba para los tests de Posts
 */
async function createTestData() {
  try {
    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash("test123", 10);
    const testUser = await User.create({
      email: "testposts@example.com",
      password: hashedPassword,
      name: "Test Posts User",
    });

    // Crear productos de prueba
    const testProducts = await Promise.all([
      Product.create({
        ean: "1234567890123",
        sku: "TEST-SKU-001",
        name: "Producto de Prueba 1",
        description: "Descripción del producto de prueba 1",
        price: 100.00,
        volumeType: 1,
        weight: 0.5,
        category1: "Electrónicos",
        category2: "Smartphones",
        totalStock: 50,
        status: "Publicado",
      }),
      Product.create({
        ean: "9876543210987",
        sku: "TEST-SKU-002",
        name: "Producto de Prueba 2",
        description: "Descripción del producto de prueba 2",
        price: 200.00,
        volumeType: 1,
        weight: 0.3,
        category1: "Hogar",
        category2: "Decoración",
        totalStock: 25,
        status: "Oculto",
      }),
      Product.create({
        ean: "5555555555555",
        sku: "TEST-SKU-003",
        name: "Producto de Prueba 3",
        description: "Descripción del producto de prueba 3",
        price: 50.00,
        volumeType: 2,
        weight: 1.0,
        category1: "Ropa",
        category2: "Camisetas",
        totalStock: 0,
        status: "Sin stock",
      })
    ]);

    // Crear publicaciones de prueba
    const testPosts = await Promise.all([
      Post.create({
        productId: testProducts[0].id,
        title: "Publicación de Prueba 1",
        content: "Esta es la primera publicación de prueba",
        price: 150.50,
        clicks: 10,
      }),
      Post.create({
        productId: testProducts[1].id,
        title: "Publicación de Prueba 2",
        content: "Esta es la segunda publicación de prueba",
        price: 250.00,
        clicks: 5,
      }),
      Post.create({
        productId: testProducts[2].id,
        title: "Publicación de Prueba 3",
        content: "Esta es la tercera publicación de prueba",
        price: 75.00,
        clicks: 0,
      })
    ]);

    return {
      user: testUser,
      products: testProducts,
      posts: testPosts,
    };
  } catch (error) {
    console.error("Error creando datos de prueba:", error);
    throw error;
  }
}

/**
 * Limpia los datos de prueba
 */
async function cleanupTestData(testData) {
  try {
    if (testData.posts) {
      await Post.destroy({
        where: { id: testData.posts.map(p => p.id) }
      });
    }
    if (testData.products) {
      await Product.destroy({
        where: { id: testData.products.map(p => p.id) }
      });
    }
    if (testData.user) {
      await User.destroy({
        where: { id: testData.user.id }
      });
    }
  } catch (error) {
    console.error("Error limpiando datos de prueba:", error);
    throw error;
  }
}

/**
 * Genera un token JWT para testing
 */
function generateTestToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
}

/**
 * Configuración de variables de entorno para testing
 */
function setupTestEnvironment() {
  process.env.NODE_ENV = "test";
  process.env.SECRET_KEY = process.env.SECRET_KEY || "test-secret-key";
}

module.exports = {
  createTestData,
  cleanupTestData,
  generateTestToken,
  setupTestEnvironment,
};

