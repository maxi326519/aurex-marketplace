import { Product, Business, User, Stock, Storage } from "../../db";
import { Op } from "sequelize";

const createProduct = async (productData: any, userId: string) => {
  // Get business
  const business = await Business.findOne({ where: { UserId: userId } });
  if (!business) throw new Error(`Business not found`);

  // Verificar si ya existe un producto con el mismo EAN para esta empresa
  const existingProduct = await Product.findOne({
    where: {
      BusinessId: business.dataValues.id,
      ean: productData.ean,
    },
  });

  if (existingProduct)
    throw new Error(
      `Product with EAN ${productData.ean} already exists for this business`
    );

  // Create new product con BusinessId
  const newProduct = await Product.create({
    ...productData,
    BusinessId: business.dataValues.id,
  });

  return newProduct;
};

const getAllProducts = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string
) => {
  const offset = (page - 1) * limit;

  // Construir whereClause dinámicamente
  const whereClause: any = {};

  // Búsqueda en múltiples campos
  if (search) {
    whereClause[Op.or] = [
      { ean: { [Op.like]: `%${search}%` } },
      { sku: { [Op.like]: `%${search}%` } },
      { name: { [Op.like]: `%${search}%` } },
    ];
  }

  // Filtro por status
  if (status) {
    whereClause.status = status;
  }

  // Obtener productos con paginación
  const { count, rows } = await Product.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [["name", "ASC"]], // Ordenar por nombre alfabéticamente
  });

  const totalPages = Math.ceil(count / limit);

  return {
    data: rows,
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

const updateProducts = async (product: any) => {
  const response = await Product.findOne({
    where: { id: product.id },
  });

  if (response) await response.update(product);
  else throw new Error("Product not found");
};

const deleteProduct = async (productId: string) => {
  const product = await Product.findOne({ where: { id: productId } });

  if (!product) throw new Error("Product not found");

  await product.destroy();
};

const disableProduct = async (id: string, disabled: boolean) => {
  const product: any = await Product.findOne({
    where: { id: id },
  });
  if (product) {
    product.disabled = disabled;
    await product.save();
  } else {
    throw new Error("Product not found");
  }
};

const validateProducts = async (
  products: Array<{ ean: string; sku: string }>,
  userId?: string,
  businessId?: string
) => {
  let targetBusinessId: string;

  // Si se proporciona businessId, usarlo directamente (para admin validando órdenes de otros negocios)
  if (businessId) {
    const business = await Business.findByPk(businessId);
    if (!business) {
      throw new Error("Business not found");
    }
    targetBusinessId = businessId;
  } else if (userId) {
    // Si no hay businessId pero hay userId, obtener el business del usuario
    const business = await Business.findOne({ where: { UserId: userId } });
    if (!business) {
      throw new Error("Business not found");
    }
    targetBusinessId = business.dataValues.id;
  } else {
    throw new Error("Either userId or businessId is required");
  }

  const validationResults = [];

  for (const product of products) {
    const existingProduct = await Product.findOne({
      where: {
        BusinessId: targetBusinessId,
        ean: product.ean,
        sku: product.sku,
      },
    });

    validationResults.push({
      ean: product.ean,
      sku: product.sku,
      exists: !!existingProduct,
      product: existingProduct ? existingProduct.dataValues : null,
    });
  }

  return validationResults;
};

/**
 * Valida stock disponible sin reservarlo (solo validación)
 * Retorna información sobre disponibilidad sin modificar el stock
 */
const validateStockOnly = async (
  products: Array<{ ean: string; sku: string; cantidad: number }>,
  businessId: string
) => {
  if (!businessId) {
    throw new Error("BusinessId is required");
  }

  const business = await Business.findByPk(businessId);
  if (!business) {
    throw new Error("Business not found");
  }

  const validationResults = [];

  for (const productData of products) {
    const existingProduct = await Product.findOne({
      where: {
        BusinessId: businessId,
        ean: productData.ean,
        sku: productData.sku,
      },
    });

    if (!existingProduct) {
      validationResults.push({
        ean: productData.ean,
        sku: productData.sku,
        cantidad: productData.cantidad,
        exists: false,
        hasStock: false,
        availableStock: 0,
        product: null,
        error: "Producto no encontrado",
      });
      continue;
    }

    const totalStock = Number(existingProduct.dataValues.totalStock);
    const reservedStock = Number((existingProduct.dataValues as any).reservedStock || 0);
    const availableStock = totalStock - reservedStock;
    const requestedQuantity = Number(productData.cantidad);

    if (availableStock < requestedQuantity) {
      validationResults.push({
        ean: productData.ean,
        sku: productData.sku,
        cantidad: productData.cantidad,
        exists: true,
        hasStock: false,
        availableStock,
        totalStock,
        reservedStock,
        product: existingProduct.dataValues,
        error: `Stock insuficiente. Disponible: ${availableStock}, Requerido: ${requestedQuantity}`,
      });
      continue;
    }

    // Solo validar, no reservar
    validationResults.push({
      ean: productData.ean,
      sku: productData.sku,
      cantidad: productData.cantidad,
      exists: true,
      hasStock: true,
      availableStock,
      totalStock,
      reservedStock,
      product: existingProduct.dataValues,
      error: null,
    });
  }

  return validationResults;
};

/**
 * Valida stock disponible y reserva stock para exportaciones
 * Retorna información sobre disponibilidad y reserva el stock
 */
const validateAndReserveStock = async (
  products: Array<{ ean: string; sku: string; cantidad: number }>,
  businessId: string
) => {
  if (!businessId) {
    throw new Error("BusinessId is required");
  }

  const business = await Business.findByPk(businessId);
  if (!business) {
    throw new Error("Business not found");
  }

  const validationResults = [];
  const transaction = await Product.sequelize?.transaction();

  if (!transaction) {
    throw new Error("No se pudo crear la transacción de base de datos");
  }

  try {
    for (const productData of products) {
      const existingProduct = await Product.findOne({
        where: {
          BusinessId: businessId,
          ean: productData.ean,
          sku: productData.sku,
        },
        transaction,
      });

      if (!existingProduct) {
        validationResults.push({
          ean: productData.ean,
          sku: productData.sku,
          cantidad: productData.cantidad,
          exists: false,
          hasStock: false,
          availableStock: 0,
          product: null,
          error: "Producto no encontrado",
        });
        continue;
      }

      const totalStock = Number(existingProduct.dataValues.totalStock);
      const reservedStock = Number((existingProduct.dataValues as any).reservedStock || 0);
      const availableStock = totalStock - reservedStock;
      const requestedQuantity = Number(productData.cantidad);

      if (availableStock < requestedQuantity) {
        validationResults.push({
          ean: productData.ean,
          sku: productData.sku,
          cantidad: productData.cantidad,
          exists: true,
          hasStock: false,
          availableStock,
          totalStock,
          reservedStock,
          product: existingProduct.dataValues,
          error: `Stock insuficiente. Disponible: ${availableStock}, Requerido: ${requestedQuantity}`,
        });
        continue;
      }

      // Reservar el stock
      const newReservedStock = reservedStock + requestedQuantity;
      await existingProduct.update(
        {
          reservedStock: newReservedStock,
        },
        { transaction }
      );

      validationResults.push({
        ean: productData.ean,
        sku: productData.sku,
        cantidad: productData.cantidad,
        exists: true,
        hasStock: true,
        availableStock,
        totalStock,
        reservedStock: newReservedStock,
        product: existingProduct.dataValues,
        error: null,
      });
    }

    await transaction.commit();
    return validationResults;
  } catch (error: any) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Valida stock disponible en un almacén específico para egresos
 * Retorna información sobre disponibilidad de stock en el almacén
 */
const validateStockByStorage = async (
  items: Array<{ ean: string; sku: string; cantidad: number; almacen: string }>,
  businessId: string
) => {
  if (!businessId) {
    throw new Error("BusinessId is required");
  }

  const business = await Business.findByPk(businessId);
  if (!business) {
    throw new Error("Business not found");
  }

  const { Storage } = require("../../db");
  const validationResults = [];

  for (const itemData of items) {
    // Buscar el producto
    const product = await Product.findOne({
      where: {
        BusinessId: businessId,
        ean: itemData.ean,
        sku: itemData.sku,
      },
    });

    if (!product) {
      validationResults.push({
        ean: itemData.ean,
        sku: itemData.sku,
        cantidad: itemData.cantidad,
        almacen: itemData.almacen,
        exists: false,
        hasStock: false,
        availableStock: 0,
        product: null,
        error: "Producto no encontrado",
      });
      continue;
    }

    // Parsear el almacén (formato: R1/A1/9)
    const almacenParts = itemData.almacen.split("/");
    if (almacenParts.length !== 3) {
      validationResults.push({
        ean: itemData.ean,
        sku: itemData.sku,
        cantidad: itemData.cantidad,
        almacen: itemData.almacen,
        exists: true,
        hasStock: false,
        availableStock: 0,
        product: product.dataValues,
        error: "Formato de almacén inválido. Debe ser: Rag/Site/Position",
      });
      continue;
    }

    const rag = almacenParts[0].trim();
    const site = almacenParts[1].trim();
    const position = parseInt(almacenParts[2].trim());

    // Buscar el almacén
    const storage = await Storage.findOne({
      where: {
        rag,
        site,
      },
    });

    if (!storage) {
      validationResults.push({
        ean: itemData.ean,
        sku: itemData.sku,
        cantidad: itemData.cantidad,
        almacen: itemData.almacen,
        exists: true,
        hasStock: false,
        availableStock: 0,
        product: product.dataValues,
        error: `Almacén con Rag "${rag}" y Site "${site}" no encontrado`,
      });
      continue;
    }

    // Validar posición
    const maxPositions = Number(storage.dataValues.positions);
    if (isNaN(maxPositions) || maxPositions <= 0 || position > maxPositions) {
      validationResults.push({
        ean: itemData.ean,
        sku: itemData.sku,
        cantidad: itemData.cantidad,
        almacen: itemData.almacen,
        exists: true,
        hasStock: false,
        availableStock: 0,
        product: product.dataValues,
        error: `Posición ${position} no válida. Máximo permitido: ${maxPositions}`,
      });
      continue;
    }

    // Buscar stock en ese almacén
    const { Stock } = require("../../db");
    const stock = await Stock.findOne({
      where: {
        ProductId: product.dataValues.id,
        StorageId: storage.dataValues.id,
      },
    });

    if (!stock) {
      validationResults.push({
        ean: itemData.ean,
        sku: itemData.sku,
        cantidad: itemData.cantidad,
        almacen: itemData.almacen,
        exists: true,
        hasStock: false,
        availableStock: 0,
        product: product.dataValues,
        error: "No hay stock de este producto en el almacén especificado",
      });
      continue;
    }

    // Validar stock disponible
    const availableStock = Number(stock.dataValues.enabled);
    const requestedQuantity = Number(itemData.cantidad);

    if (availableStock < requestedQuantity) {
      validationResults.push({
        ean: itemData.ean,
        sku: itemData.sku,
        cantidad: itemData.cantidad,
        almacen: itemData.almacen,
        exists: true,
        hasStock: false,
        availableStock,
        product: product.dataValues,
        stock: stock.dataValues,
        error: `Stock insuficiente en almacén. Disponible: ${availableStock}, Requerido: ${requestedQuantity}`,
      });
      continue;
    }

    validationResults.push({
      ean: itemData.ean,
      sku: itemData.sku,
      cantidad: itemData.cantidad,
      almacen: itemData.almacen,
      exists: true,
      hasStock: true,
      availableStock,
      product: product.dataValues,
      stock: stock.dataValues,
      error: null,
    });
  }

  return validationResults;
};

const getProductsWithStock = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string,
  businessId?: string
) => {
  const offset = (page - 1) * limit;

  // Construir whereClause dinámicamente
  const whereClause: any = {};

  // Filtrar por businessId si se proporciona
  if (businessId) {
    whereClause.BusinessId = businessId;
  }

  // Búsqueda en múltiples campos
  if (search) {
    whereClause[Op.or] = [
      { ean: { [Op.like]: `%${search}%` } },
      { sku: { [Op.like]: `%${search}%` } },
      { name: { [Op.like]: `%${search}%` } },
    ];
  }

  // Filtro por status
  if (status) {
    whereClause.status = status;
  }

  // Obtener productos con sus stocks asociados y sus almacenes
  const { count, rows } = await Product.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Stock,
        required: false, // LEFT JOIN para incluir productos sin stock
        include: [
          {
            model: Storage,
            required: false, // LEFT JOIN para incluir stock sin almacén
          },
        ],
      },
    ],
    limit,
    offset,
    order: [["name", "ASC"]],
  });

  const totalPages = Math.ceil(count / limit);

  return {
    data: rows,
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export {
  createProduct,
  getAllProducts,
  updateProducts,
  deleteProduct,
  disableProduct,
  getProductsWithStock,
  validateProducts,
  validateStockOnly,
  validateAndReserveStock,
  validateStockByStorage,
};
