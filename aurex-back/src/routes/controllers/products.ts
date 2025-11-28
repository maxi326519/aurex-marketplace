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
};
