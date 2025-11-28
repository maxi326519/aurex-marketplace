import { Stock, Product, Storage } from "../../db";
import { MovementsType } from "../../interfaces/MovementTS";
import { setMovements } from "../controllers/movements";
import { Transaction } from "sequelize";
import { ProductTS } from "../../interfaces/ProductTS";
import { StockTS } from "../../interfaces/StockTS";

const createStock = async (
  stock: StockTS,
  userId: string,
  transaction?: Transaction
) => {
  // Create a new stock register
  const newStock: any = await Stock.create({ ...stock }, { transaction });

  // Bind the new stock with the product
  const product = await Product.findByPk(stock.ProductId, { transaction });
  if (!product) throw new Error("Product not found");
  await newStock.setProduct(product, { transaction });

  // Update product amount
  await product.update(
    {
      totalStock:
        Number((product.dataValues as ProductTS).totalStock) +
        Number(stock.amount),
    },
    { transaction }
  );

  // Create the movement
  const newMovement = await setMovements(
    new Date(),
    MovementsType.ingreso,
    stock.amount,
    newStock.dataValues.id,
    stock.StorageId || "",
    (product.dataValues as ProductTS).id,
    userId,
    transaction
  );

  // Return the new Stock and Movement
  return {
    Stock: newStock,
    Product: product,
    Movement: newMovement,
  };
};

const getStock = async (includeProduct: boolean = false) => {
  const options: any = {};
  if (includeProduct) {
    options.include = [
      {
        model: Product,
        required: false,
      },
      {
        model: Storage,
        required: false,
      },
    ];
  }
  const response = await Stock.findAll(options);
  return response;
};

const getStockByProductId = async (
  productId: string,
  includeProduct: boolean = false
) => {
  const options: any = {
    where: { ProductId: productId },
  };
  if (includeProduct) {
    options.include = [
      {
        model: Product,
        required: false,
      },
      {
        model: Storage,
        required: false,
      },
    ];
  }
  const response = await Stock.findAll(options);
  return response;
};

const getStockByStorageId = async (storageId: string) => {
  const response = await Stock.findAll({
    where: { StorageId: storageId },
    include: [
      {
        model: Product,
        required: false,
      },
      {
        model: Storage,
        required: false,
      },
    ],
    order: [["amount", "DESC"]],
  });
  return response;
};

const setIngress = async (
  stockId: string,
  stockModel: any,
  quantity: number,
  userId: string,
  transaction?: Transaction
) => {
  // Check parameters
  if (!stockId && !stockModel)
    throw new Error("missing parameter: stockId or stockModel");
  if (!quantity || quantity <= 0)
    throw new Error("missing or invalid parameter: quantity");

  // Obtener el stock si no se proporcionó el modelo
  let stock: any = stockModel;
  if (!stock) {
    stock = await Stock.findByPk(stockId, { transaction });
    if (!stock) throw new Error(`Stock not found`);
  }

  // Actualizar el stock sumando la cantidad
  const newAmount = Number(stock.dataValues.amount) + Number(quantity);
  const newEnabled = Number(stock.dataValues.enabled) + Number(quantity);

  await stock.update(
    {
      amount: newAmount,
      enabled: newEnabled,
      isFull: newEnabled > 0,
    },
    { transaction }
  );

  // Obtener y actualizar el producto
  const product: any = await Product.findByPk(stock.dataValues.ProductId, {
    transaction,
  });
  if (!product) throw new Error("Product not found");

  const currentTotalStock = Number(
    (product.dataValues as ProductTS).totalStock
  );
  await product.update(
    {
      totalStock: currentTotalStock + Number(quantity),
    },
    { transaction }
  );

  // Crear el movimiento
  const movement = await setMovements(
    new Date(),
    MovementsType.ingreso,
    quantity,
    stock.dataValues.id,
    stock.dataValues.StorageId,
    stock.dataValues.ProductId,
    undefined, // BusinessId (opcional)
    transaction
  );

  // Return the updated stock and the new movement
  return {
    Stock: stock,
    Product: product,
    Movement: movement,
  };
};

const setEgress = async (
  stockId: string,
  stockModel: any,
  quantity: number,
  userId: string,
  transaction?: Transaction
) => {
  // Check parameters
  if (!stockId && !stockModel)
    throw new Error("missing parameter: stockId or stockModel");
  if (!quantity || quantity <= 0)
    throw new Error("missing or invalid parameter: quantity");

  // Obtener el stock si no se proporcionó el modelo
  let stock: any = stockModel;
  if (!stock) {
    stock = await Stock.findByPk(stockId, { transaction });
    if (!stock) throw new Error(`Stock not found`);
  }

  // Validar que hay suficiente stock disponible
  const availableStock = Number(stock.dataValues.enabled);
  if (availableStock < Number(quantity)) {
    throw new Error(
      `Stock insuficiente. Disponible: ${availableStock}, Requerido: ${quantity}`
    );
  }

  // Restar la cantidad del stock
  const newAmount = Number(stock.dataValues.amount) - Number(quantity);
  const newEnabled = Number(stock.dataValues.enabled) - Number(quantity);

  await stock.update(
    {
      amount: newAmount,
      enabled: newEnabled,
      isFull: newEnabled > 0,
    },
    { transaction }
  );

  // Obtener y actualizar el producto
  const product: any = await Product.findByPk(stock.dataValues.ProductId, {
    transaction,
  });
  if (!product) throw new Error("Product not found");

  const currentTotalStock = Number(
    (product.dataValues as ProductTS).totalStock
  );
  const currentReservedStock = Number(
    (product.dataValues as any).reservedStock || 0
  );

  // Restar del totalStock y también del reservedStock si estaba reservado
  const newTotalStock = currentTotalStock - Number(quantity);
  const newReservedStock = Math.max(0, currentReservedStock - Number(quantity));

  await product.update(
    {
      totalStock: newTotalStock,
      reservedStock: newReservedStock,
    },
    { transaction }
  );

  // Crear el movimiento de salida
  const movement = await setMovements(
    new Date(),
    MovementsType.egreso,
    quantity,
    stock.dataValues.id,
    stock.dataValues.StorageId,
    stock.dataValues.ProductId,
    undefined, // BusinessId (opcional)
    transaction
  );

  // Return the updated stock and the new movement
  return {
    Stock: stock,
    Product: product,
    Movement: movement,
  };
};

const setTransfer = async (
  date: string,
  quantity: number,
  StockId: string,
  StorageId: {
    egress: string;
    ingress: string;
  },
  userId: string
) => {
  // Check parameters
  if (!date) throw new Error("missing parameter: date");
  if (!new Date(date)?.getTime()) throw new Error("invalid date");
  if (!StorageId.egress) throw new Error("missing parameter: ingress storage");
  if (!StorageId.ingress) throw new Error("missing parameter: egress storage");
  if (StorageId.egress === StorageId.ingress)
    throw new Error("the storages cannot be the same");

  // Get the esgress Storage
  const egressStock: any = await Stock.findByPk(StockId);

  // Check if Storage exist, and is enough quantity in stock
  if (!egressStock) throw new Error("Egress stock not found");
  if (Number(egressStock.quantity) < Number(quantity))
    throw new Error("Insufficient stock");

  // Get the esgress Storage
  let ingressStock: any = await Stock.findOne({
    where: {
      StorageId: StorageId.ingress,
      ProductId: egressStock.ProductId,
    },
  });

  // Check if the stock in this storage already exist
  if (ingressStock) {
    // Add new amounts
    ingressStock.quantity = Number(ingressStock.quantity) + Number(quantity);
    await ingressStock.save();
  } else {
    // Else create it
    ingressStock = await Stock.create({
      StorageId: StorageId.ingress,
      ProductId: egressStock.ProductId,
      quantity: Number(quantity),
    });
  }

  // Subtract the quantity and save
  egressStock.quantity = Number(egressStock.quantity) - Number(quantity);
  await egressStock.save();

  // Create the egress movement
  const egressMovement = await setMovements(
    new Date(date),
    MovementsType.transferencia,
    Number(quantity),
    egressStock.id,
    StorageId.egress,
    egressStock.ProductId,
    userId
  );

  // Create the ingress movement
  const ingressMovement = await setMovements(
    new Date(date),
    MovementsType.transferencia,
    Number(quantity),
    ingressStock.id,
    StorageId.ingress,
    egressStock.ProductId,
    userId
  );

  // Return the Stocks and movements
  return {
    Stocks: {
      egress: egressStock,
      ingress: ingressStock,
    },
    Movements: {
      egress: egressMovement,
      ingress: ingressMovement,
    },
  };
};

const subtractStock = async (
  productId: string,
  storageId: string,
  quantity: number,
  userId: string,
  transaction?: Transaction
) => {
  if (!productId) throw new Error("Missing parameter: productId");
  if (!storageId) throw new Error("Missing parameter: storageId");
  if (!quantity || quantity <= 0)
    throw new Error("Missing or invalid parameter: quantity");

  // Buscar el stock existente para este producto y almacén
  const stock: any = await Stock.findOne({
    where: {
      ProductId: productId,
      StorageId: storageId,
    },
    transaction,
  });

  if (!stock) {
    throw new Error(
      `Stock no encontrado para el producto y almacén especificados`
    );
  }

  // Usar setEgress con el modelo de stock encontrado
  return await setEgress(
    stock.dataValues.id,
    stock,
    quantity,
    userId,
    transaction
  );
};

/**
 * Actualiza o crea stock para un producto en un almacén específico
 * Si el stock existe, lo actualiza usando setIngress
 * Si no existe, lo crea usando createStock
 */
const updateOrCreateStock = async (
  stockData: StockTS,
  userId: string,
  transaction?: Transaction
) => {
  if (!stockData.ProductId) throw new Error("Missing parameter: ProductId");
  if (!stockData.StorageId) throw new Error("Missing parameter: StorageId");
  if (!stockData.amount || stockData.amount <= 0)
    throw new Error("Missing or invalid parameter: amount");

  // Buscar si ya existe stock para este producto y almacén
  const existingStock: any = await Stock.findOne({
    where: {
      ProductId: stockData.ProductId,
      StorageId: stockData.StorageId,
    },
    transaction,
  });

  if (existingStock) {
    // Si existe, actualizar usando setIngress
    return await setIngress(
      existingStock.dataValues.id,
      existingStock,
      stockData.amount,
      userId,
      transaction
    );
  } else {
    // Si no existe, crear usando createStock
    return await createStock(stockData, userId, transaction);
  }
};

export {
  createStock,
  getStock,
  getStockByProductId,
  getStockByStorageId,
  setIngress,
  setEgress,
  setTransfer,
  subtractStock,
  updateOrCreateStock,
};
