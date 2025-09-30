/**
 * Script de configuración para tests de Productos
 * Este archivo contiene utilidades y configuraciones para los tests de productos
 */

const { User, Product } = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Crea datos de prueba para los tests de Productos
 */
async function createTestData() {
  try {
    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash("test123", 10);
    const testUser = await User.create({
      email: "testproducts@example.com",
      password: hashedPassword,
      name: "Test Products User",
    });

    // Crear productos de prueba
    const testProducts = await Promise.all([
      Product.create({
        ean: "1234567890123",
        sku: "TEST-PROD-001",
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
        sku: "TEST-PROD-002",
        name: "Producto de Prueba 2",
        description: "Descripción del producto de prueba 2",
        price: 200.00,
        volumeType: 2,
        weight: 1.0,
        category1: "Ropa",
        category2: "Camisetas",
        totalStock: 100,
        status: "Oculto",
      }),
      Product.create({
        ean: "5555555555555",
        sku: "TEST-PROD-003",
        name: "Producto de Prueba 3",
        description: "Descripción del producto de prueba 3",
        price: 50.00,
        volumeType: 1,
        weight: 0.3,
        category1: "Hogar",
        category2: "Decoración",
        totalStock: 0,
        status: "Sin stock",
      })
    ]);

    return {
      user: testUser,
      products: testProducts,
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

/**
 * Crea un producto de prueba con datos específicos
 */
async function createTestProduct(productData = {}) {
  const defaultData = {
    ean: `TEST${Date.now()}`,
    sku: `SKU-${Date.now()}`,
    name: `Producto Test ${Date.now()}`,
    description: "Producto de prueba",
    price: 100.00,
    volumeType: 1,
    weight: 0.5,
    category1: "Test",
    category2: "Prueba",
    totalStock: 10,
    status: "Publicado",
  };

  const finalData = { ...defaultData, ...productData };
  return await Product.create(finalData);
}

/**
 * Valida la estructura de un producto
 */
function validateProductStructure(product) {
  const requiredFields = [
    'id', 'ean', 'sku', 'name', 'price', 
    'volumeType', 'weight', 'category1', 
    'category2', 'totalStock', 'status'
  ];

  const missingFields = requiredFields.filter(field => !(field in product));
  
  if (missingFields.length > 0) {
    throw new Error(`Producto inválido: faltan campos ${missingFields.join(', ')}`);
  }

  // Validar tipos
  if (typeof product.price !== 'number') {
    throw new Error('El precio debe ser un número');
  }
  
  if (typeof product.volumeType !== 'number') {
    throw new Error('El tipo de volumen debe ser un número');
  }
  
  if (typeof product.weight !== 'number') {
    throw new Error('El peso debe ser un número');
  }
  
  if (typeof product.totalStock !== 'number') {
    throw new Error('El stock total debe ser un número');
  }

  // Validar estado
  const validStatuses = ['Publicado', 'Oculto', 'Sin stock'];
  if (!validStatuses.includes(product.status)) {
    throw new Error(`Estado inválido: ${product.status}. Debe ser uno de: ${validStatuses.join(', ')}`);
  }

  return true;
}

/**
 * Genera datos de producto válidos para testing
 */
function generateValidProductData(overrides = {}) {
  const baseData = {
    ean: `TEST${Math.random().toString(36).substr(2, 9)}`,
    sku: `SKU-${Math.random().toString(36).substr(2, 9)}`,
    name: `Producto Test ${Math.random().toString(36).substr(2, 5)}`,
    description: "Descripción de producto de prueba",
    price: Math.round(Math.random() * 1000 * 100) / 100, // Precio aleatorio entre 0 y 1000
    volumeType: Math.floor(Math.random() * 3) + 1, // 1, 2, o 3
    weight: Math.round(Math.random() * 10 * 100) / 100, // Peso aleatorio entre 0 y 10
    category1: ["Electrónicos", "Ropa", "Hogar", "Deportes"][Math.floor(Math.random() * 4)],
    category2: ["Smartphones", "Camisetas", "Decoración", "Fitness"][Math.floor(Math.random() * 4)],
    totalStock: Math.floor(Math.random() * 1000), // Stock aleatorio entre 0 y 1000
    status: ["Publicado", "Oculto", "Sin stock"][Math.floor(Math.random() * 3)],
  };

  return { ...baseData, ...overrides };
}

module.exports = {
  createTestData,
  cleanupTestData,
  generateTestToken,
  setupTestEnvironment,
  createTestProduct,
  validateProductStructure,
  generateValidProductData,
};

