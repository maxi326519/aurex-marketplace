import { Movements, Stock, Storage, Product, Business } from "../../db";
import { Transaction } from "sequelize";

const setMovements = async (
  date: Date,
  type: string,
  quantity: number,
  StockId: string,
  StorageId: string,
  ProductId: string,
  BusinessId?: string,
  transaction?: Transaction
) => {
  if (!date) {
    throw new Error('The "date" parameter is required.');
  }

  const newMovements: any = await Movements.create(
    {
      date,
      type,
      quantity,
    },
    { transaction }
  );

  if (StockId) {
    const stock = await Stock.findByPk(StockId, { transaction });
    if (stock) {
      await newMovements.setStock(stock, { transaction });
    }
  }
  if (StorageId) {
    const storage = await Storage.findByPk(StorageId, { transaction });
    if (storage) {
      await newMovements.setStorage(storage, { transaction });
    }
  }
  if (ProductId) {
    const product = await Product.findByPk(ProductId, { transaction });
    if (product) {
      await newMovements.setProduct(product, { transaction });
    }
  }
  if (BusinessId) {
    const business = await Business.findByPk(BusinessId, { transaction });
    if (business) {
      await newMovements.setBusiness(business, { transaction });
    }
  }
  return newMovements;
};

const getMovements = async () => {
  // Verify parameters and add the filters

  // Get movements
  const movements = Movements.findAll();

  // Return all Movements
  return movements;
};

const getMovementsByProductId = async (productId: string) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  // Get movements for a specific product
  const movements = await Movements.findAll({
    where: { ProductId: productId },
    include: [
      {
        model: Stock,
        required: false,
      },
      {
        model: Product,
        required: false,
      },
      {
        model: Storage,
        required: false,
      },
      {
        model: Business,
        required: false,
      },
    ],
    order: [["date", "DESC"]], // Más recientes primero
  });

  return movements;
};

const getMovementsByBusiness = async (businessId: string) => {
  if (!businessId) {
    throw new Error("Business ID is required");
  }

  // Get movements for a specific business
  const movements = await Movements.findAll({
    where: { BusinessId: businessId },
    include: [
      {
        model: Stock,
        required: false,
      },
      {
        model: Product,
        required: false,
      },
      {
        model: Storage,
        required: false,
      },
      {
        model: Business,
        required: false,
      },
    ],
    order: [["date", "DESC"]], // Más recientes primero
  });

  return movements;
};

const getMovementsByStorage = async (storageId: string) => {
  if (!storageId) {
    throw new Error("Storage ID is required");
  }

  // Get movements for a specific storage
  const movements = await Movements.findAll({
    where: { StorageId: storageId },
    include: [
      {
        model: Stock,
        required: false,
      },
      {
        model: Product,
        required: false,
      },
      {
        model: Storage,
        required: false,
      },
      {
        model: Business,
        required: false,
      },
    ],
    order: [["date", "DESC"]], // Más recientes primero
  });

  return movements;
};

const getMovementsByStock = async (stockId: string) => {
  if (!stockId) {
    throw new Error("Stock ID is required");
  }

  // Get movements for a specific stock
  const movements = await Movements.findAll({
    where: { StockId: stockId },
    include: [
      {
        model: Stock,
        required: false,
      },
      {
        model: Product,
        required: false,
      },
      {
        model: Storage,
        required: false,
      },
      {
        model: Business,
        required: false,
      },
    ],
    order: [["date", "DESC"]], // Más recientes primero
  });

  return movements;
};

export {
  setMovements,
  getMovements,
  getMovementsByProductId,
  getMovementsByBusiness,
  getMovementsByStorage,
  getMovementsByStock,
};
