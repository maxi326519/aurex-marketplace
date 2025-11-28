import { MovementOrder, Business, Product, Storage } from "../../db";
import { updateOrCreateStock, subtractStock } from "./stock";
import { MovementOrderTS } from "../../interfaces/MovementOrdersTS";
import { WhereOptions, Op } from "sequelize";
import { StockTS } from "../../interfaces/StockTS";
import path from "path";
import fs from "fs";

// Tipo para archivos de Multer
type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
};

const createMovementOrder = async (
  data: MovementOrderTS,
  productsFile: MulterFile,
  recipeFile: MulterFile | null,
  BusinessId: string
) => {
  // Check parameters
  if (!data.date) throw new Error("missing parameter date");
  if (!data.type) throw new Error("missing parameter type");
  if (!data.state) throw new Error("missing parameter state");
  if (!BusinessId) throw new Error("BusinessId not found");

  // Verificar que el Business existe antes de asociarlo
  const business = await Business.findByPk(BusinessId);
  if (!business) throw new Error(`Business con ID ${BusinessId} no existe`);

  // Convertir rutas relativas a absolutas para verificación
  const productsFilePath = path.isAbsolute(productsFile.path)
    ? productsFile.path
    : path.join(process.cwd(), productsFile.path);

  // Verificar que el archivo de productos exista
  if (!fs.existsSync(productsFilePath)) {
    throw new Error(`El archivo de productos no existe: ${productsFilePath}`);
  }

  // Obtener ruta relativa desde uploads para guardar en BD
  const uploadsDir = path.join(process.cwd(), "uploads");
  const productsFileRelative = path.relative(uploadsDir, productsFilePath);

  // El remito solo es requerido para ingresos (ENTRADA)
  let recipeFilePath: string | null = null;
  let recipeFileRelative: string | null = null;
  if (recipeFile && data.type === "ENTRADA") {
    recipeFilePath = path.isAbsolute(recipeFile.path)
      ? recipeFile.path
      : path.join(process.cwd(), recipeFile.path);

    if (recipeFilePath && !fs.existsSync(recipeFilePath)) {
      throw new Error(`El archivo de remito no existe: ${recipeFilePath}`);
    }

    // Obtener ruta relativa desde uploads
    if (recipeFilePath) {
      recipeFileRelative = path.relative(uploadsDir, recipeFilePath);
    }
  }

  // Create MovementOrder (receptionDate es opcional y puede agregarse después)
  const movementOrderData: any = {
    date: data.date,
    receptionDate: data.receptionDate || null,
    type: data.type,
    state: data.state,
    sheetFile: productsFileRelative,
    remittance: recipeFileRelative || "",
    BusinessId: business.dataValues.id,
  };

  const newMovementOrder: any = await MovementOrder.create(movementOrderData);

  return newMovementOrder.dataValues;
};

const getAllMovementOrders = async (state?: string) => {
  const where: WhereOptions<any> = {};
  if (state) {
    // Si el estado contiene comas, significa que son múltiples estados
    const states = state
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (states.length > 1) {
      // Usar Op.in para múltiples estados
      where.state = { [Op.in]: states };
    } else if (states.length === 1) {
      // Un solo estado
      where.state = states[0];
    }
  }

  // Obtener todos los MovementOrders y sus usuarios asociados
  const movementOrders: any = await MovementOrder.findAll({ where });

  // Normalizar rutas: convertir rutas absolutas a relativas si es necesario
  const uploadsDir = path.join(process.cwd(), "uploads");
  const normalizedOrders = movementOrders.map((order: any) => {
    const data = order.dataValues || order;

    // Normalizar sheetFile
    if (data.sheetFile) {
      if (path.isAbsolute(data.sheetFile)) {
        // Si es ruta absoluta, convertir a relativa
        data.sheetFile = path.relative(uploadsDir, data.sheetFile);
      }
    }

    // Normalizar remittance
    if (data.remittance) {
      if (path.isAbsolute(data.remittance)) {
        // Si es ruta absoluta, convertir a relativa
        data.remittance = path.relative(uploadsDir, data.remittance);
      }
    }

    return data;
  });

  // Retornamos todos los movementOrders normalizados
  return normalizedOrders;
};

const updateMovementOrder = async (data: MovementOrderTS) => {
  // Verificamos los parametros requeridos
  if (!data.id) throw new Error("Missing parameter id");
  if (!data.date) throw new Error("Missing parameter date");
  if (!data.state) throw new Error("Missing parameter state");

  // Get and check movementOrder
  const currentMovementOrder = await MovementOrder.findByPk(data.id);
  if (!currentMovementOrder) throw new Error("MovementOrder not found");

  // Update MovementOrder
  const updateData: any = {
    date: data.date,
    state: data.state,
  };

  // Incluir receptionDate si viene
  if (data.receptionDate !== undefined) {
    updateData.receptionDate = data.receptionDate;
  }

  // Incluir type si viene (por si se necesita cambiar)
  if (data.type) {
    updateData.type = data.type;
  }

  await currentMovementOrder?.update(updateData);

  // Return updated movementOrder
  return currentMovementOrder.dataValues;
};

const deleteMovementOrder = async (movementOrderId: string) => {
  const movementOrder = await MovementOrder.findOne({
    where: { id: movementOrderId },
  });

  if (!movementOrder) throw new Error("MovementOrder not found");

  await movementOrder.destroy();
};

interface StockItem {
  ean: string;
  sku: string;
  cantidad: number;
  almacen: string;
}

interface ParsedStorage {
  rag: string;
  site: string;
  position: number;
}

/**
 * Parsea el string de almacén en formato "R1/A1/9" a objeto con rag, site y position
 * @param almacen - String en formato "R1/A1/9"
 * @returns Objeto con rag, site y position
 * @throws Error si el formato es incorrecto
 */
const parseStorageString = (almacen: string): ParsedStorage => {
  const parts = almacen.split("/");

  if (parts.length !== 3) {
    throw new Error(
      `Formato de almacén incorrecto. Debe ser "Rag/Site/Posición" (ej: "R1/A1/9"), recibido: "${almacen}"`
    );
  }

  const rag = parts[0].trim();
  const site = parts[1].trim();
  const position = parseInt(parts[2].trim(), 10);

  if (!rag || !site || isNaN(position) || position <= 0) {
    throw new Error(
      `Formato de almacén inválido. Rag, Site y Posición deben ser válidos. Recibido: "${almacen}"`
    );
  }

  return { rag, site, position };
};

const completeMovementOrder = async (
  movementOrderId: string,
  stockItems: StockItem[],
  userId: string,
  state: string
) => {
  if (!movementOrderId) throw new Error("Missing parameter: movementOrderId");
  if (!stockItems || stockItems.length === 0)
    throw new Error("Missing parameter: stockItems");
  if (!userId) throw new Error("Missing parameter: userId");
  if (!state) throw new Error("Missing parameter: state");

  // Crear transacción
  const transaction = await MovementOrder.sequelize?.transaction();

  if (!transaction) {
    throw new Error("No se pudo crear la transacción de base de datos");
  }

  try {
    // Obtener la orden de movimiento dentro de la transacción
    const movementOrder: any = await MovementOrder.findByPk(movementOrderId, {
      transaction,
    });
    if (!movementOrder) throw new Error("MovementOrder not found");

    // Obtener el Business de la orden dentro de la transacción
    const business: any = await Business.findByPk(
      movementOrder.dataValues.BusinessId,
      { transaction }
    );
    if (!business) throw new Error("Business not found");

    let successCount = 0;

    // Procesar cada item del stock
    // Si hay algún error, lanzar excepción (el catch final hará el rollback)
    for (const item of stockItems) {
      // Validar que el producto existe
      const product: any = await Product.findOne({
        where: {
          BusinessId: business.dataValues.id,
          ean: item.ean,
          sku: item.sku,
        },
        transaction,
      });

      if (!product) {
        throw new Error(
          `Producto con EAN ${item.ean} y SKU ${item.sku} no encontrado`
        );
      }

      // Parsear el string de almacén
      let parsedStorage: ParsedStorage;
      try {
        parsedStorage = parseStorageString(item.almacen);
      } catch (parseError: any) {
        throw new Error(
          `Error en formato de almacén para ${item.ean}/${item.sku}: ${parseError.message}`
        );
      }

      // Buscar Storage por rag y site
      const storage: any = await Storage.findOne({
        where: {
          rag: parsedStorage.rag,
          site: parsedStorage.site,
        },
        transaction,
      });

      if (!storage) {
        throw new Error(
          `Almacén con Rag "${parsedStorage.rag}" y Site "${parsedStorage.site}" no encontrado`
        );
      }

      // Validar que la posición existe (position debe ser <= positions)
      const maxPositions = Number(storage.dataValues.positions);
      if (isNaN(maxPositions) || maxPositions <= 0) {
        throw new Error(
          `Almacén "${item.almacen}" tiene un valor de posiciones inválido`
        );
      }

      if (parsedStorage.position > maxPositions) {
        throw new Error(
          `Posición ${parsedStorage.position} no válida para almacén "${item.almacen}". Máximo permitido: ${maxPositions}`
        );
      }

      // Si es ENTRADA, actualizar o crear stock. Si es SALIDA, restar stock
      if (movementOrder.dataValues.type === "ENTRADA") {
        // Buscar stock existente para validar antes de actualizar o crear
        const stockData: StockTS = {
          amount: Number(item.cantidad),
          enabled: Number(item.cantidad),
          isFull: false,
          ProductId: product.dataValues.id,
          StorageId: storage.dataValues.id,
        };

        await updateOrCreateStock(stockData, userId, transaction);
      } else if (movementOrder.dataValues.type === "SALIDA") {
        // Restar stock del almacén especificado
        await subtractStock(
          product.dataValues.id,
          storage.dataValues.id,
          Number(item.cantidad),
          userId,
          transaction
        );
      } else {
        throw new Error(
          `Tipo de orden de movimiento no válido: ${movementOrder.dataValues.type}`
        );
      }

      successCount++;
    }

    // Si llegamos aquí, todos los items se procesaron correctamente
    // Actualizar la orden de movimiento con el estado provisto desde el frontend
    await movementOrder.update(
      {
        state: state,
      },
      { transaction }
    );

    // Commit de la transacción
    await transaction.commit();

    return {
      movementOrder: movementOrder.dataValues,
      successCount,
      state: state,
    };
  } catch (error: any) {
    // Rollback en caso de error
    // Usar try/catch para evitar error si la transacción ya fue finalizada
    try {
      if (transaction) {
        await transaction.rollback();
      }
    } catch (rollbackError: any) {
      // Si el rollback falla (porque ya fue finalizada), ignorar el error
      // El error original es más importante
      console.warn(
        "No se pudo hacer rollback (transacción ya finalizada):",
        rollbackError.message
      );
    }
    throw error;
  }
};

export {
  createMovementOrder,
  getAllMovementOrders,
  updateMovementOrder,
  deleteMovementOrder,
  completeMovementOrder,
};
