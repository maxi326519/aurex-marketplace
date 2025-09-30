import { Request, Response } from "express";
import { Order, OrderItem, Product, User } from "../../db";
import { OrdersStatus } from "../../interfaces/OrdersTS";

// Obtener todas las órdenes con filtros opcionales
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "sku", "ean", "category1", "category2", "totalStock", "status"]
            }
          ]
        }
      ],
      limit: Number(limit),
      offset: Number(offset),
      order: [["createdAt", "DESC"]]
    });

    // Transformar datos para incluir información del cliente
    const ordersWithClientInfo = orders.rows.map(order => ({
      ...order.toJSON(),
      clientName: "Cliente Marketplace", // Por ahora hardcodeado, después se puede obtener de User
      clientEmail: "cliente@marketplace.com",
      clientPhone: "+1234567890",
      shippingAddress: {
        street: "Dirección de ejemplo",
        city: "Ciudad",
        state: "Estado",
        zipCode: "12345",
        country: "País"
      }
    }));

    return res.json({
      orders: ordersWithClientInfo,
      total: orders.count,
      limit: Number(limit),
      offset: Number(offset)
    });
  } catch (error) {
    console.error("❌ Error al obtener las órdenes:", error);
    return res.status(500).json({ error: "Error al obtener las órdenes" });
  }
};

// Obtener orden por ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "sku", "ean", "category1", "category2", "totalStock", "status"]
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    const orderWithClientInfo = {
      ...order.toJSON(),
      clientName: "Cliente Marketplace",
      clientEmail: "cliente@marketplace.com",
      clientPhone: "+1234567890",
      shippingAddress: {
        street: "Dirección de ejemplo",
        city: "Ciudad",
        state: "Estado",
        zipCode: "12345",
        country: "País"
      }
    };

    return res.json(orderWithClientInfo);
  } catch (error) {
    console.error("❌ Error al obtener la orden:", error);
    return res.status(500).json({ error: "Error al obtener la orden" });
  }
};

// Crear una nueva orden con items
export const createOrder = async (req: Request, res: Response) => {
  const { date, status, quantity, supplier, totalAmount, items } = req.body;

  const t = await Order.sequelize?.transaction();
  try {
    // Crear orden
    const order = await Order.create(
      { date, status, quantity, supplier, totalAmount },
      { transaction: t }
    );

    // Crear los items de la orden
    if (Array.isArray(items)) {
      const orderItems = items.map((item: any) => ({
        orderId: order.dataValues.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));
      await OrderItem.bulkCreate(orderItems, { transaction: t });
    }

    await t?.commit();
    return res.status(201).json({ message: "Orden creada con éxito", order });
  } catch (error) {
    await t?.rollback();
    console.error("❌ Error al crear la orden:", error);
    return res.status(500).json({ error: "Error al crear la orden" });
  }
};

// Actualizar orden y sus items
export const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, status, quantity, supplier, totalAmount, items } = req.body;

  const t = await Order.sequelize?.transaction();
  try {
    // Buscar la orden
    const order = await Order.findByPk(id, { transaction: t });
    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    // Actualizar datos de la orden
    await order.update(
      { date, status, quantity, supplier, totalAmount },
      { transaction: t }
    );

    if (Array.isArray(items)) {
      // Borrar items anteriores
      await OrderItem.destroy({ where: { orderId: id }, transaction: t });

      // Insertar nuevos items
      const orderItems = items.map((item: any) => ({
        orderId: id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));
      await OrderItem.bulkCreate(orderItems, { transaction: t });
    }

    await t?.commit();
    return res.json({ message: "Orden actualizada con éxito", order });
  } catch (error) {
    await t?.rollback();
    console.error("❌ Error al actualizar la orden:", error);
    return res.status(500).json({ error: "Error al actualizar la orden" });
  }
};

// Pickear orden (marcar como pickeada)
export const pickOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { items } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    if ((order as any).status !== OrdersStatus.PENDING) {
      return res.status(400).json({ error: "La orden no está en estado pendiente" });
    }

    // Actualizar estado a PREPARED
    await order.update({ 
      status: OrdersStatus.PREPARED,
      pickedAt: new Date()
    });

    // Actualizar cantidades pickeadas en los items
    if (Array.isArray(items)) {
      for (const item of items) {
        await OrderItem.update(
          { pickedQuantity: item.quantity, isPicked: true, pickedAt: new Date() },
          { where: { id: item.itemId, orderId } }
        );
      }
    }

    return res.json({ message: "Orden pickeada con éxito" });
  } catch (error) {
    console.error("❌ Error al pickear la orden:", error);
    return res.status(500).json({ error: "Error al pickear la orden" });
  }
};

// Escanear producto (validar EAN)
export const scanProduct = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { itemId, ean } = req.body;

    const orderItem = await OrderItem.findOne({
      where: { id: itemId, orderId },
      include: [{ model: Product, as: "product" }]
    });

    if (!orderItem) {
      return res.status(404).json({ error: "Item de orden no encontrado" });
    }

    // Validar que el EAN coincida con el producto
    const isValid = (orderItem as any).product.ean === ean;

    if (isValid) {
      // Marcar como escaneado
      await orderItem.update({
        scannedEAN: ean,
        isScanned: true,
        scannedAt: new Date()
      });
    }

    return res.json({ valid: isValid });
  } catch (error) {
    console.error("❌ Error al escanear producto:", error);
    return res.status(500).json({ error: "Error al escanear producto" });
  }
};

// Egreso de orden (finalizar preparación)
export const egressOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber, courier, notes } = req.body;

    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: "items" }]
    });

    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    if ((order as any).status !== OrdersStatus.PREPARED) {
      return res.status(400).json({ error: "La orden no está en estado preparado" });
    }

    // Verificar que todos los productos estén escaneados
    const allScanned = (order as any).items.every((item: any) => item.isScanned);
    if (!allScanned) {
      return res.status(400).json({ error: "Todos los productos deben estar escaneados" });
    }

    // Actualizar orden con información de envío
    await order.update({
      status: OrdersStatus.COMPLETED,
      trackingNumber,
      courier,
      notes,
      preparedAt: new Date(),
      completedAt: new Date()
    });

    return res.json({ message: "Orden preparada con éxito" });
  } catch (error) {
    console.error("❌ Error al preparar la orden:", error);
    return res.status(500).json({ error: "Error al preparar la orden" });
  }
};

// Cancelar orden
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    if ((order as any).status === OrdersStatus.COMPLETED) {
      return res.status(400).json({ error: "No se puede cancelar una orden completada" });
    }

    await order.update({ status: OrdersStatus.CANCELED });

    return res.json({ message: "Orden cancelada con éxito" });
  } catch (error) {
    console.error("❌ Error al cancelar la orden:", error);
    return res.status(500).json({ error: "Error al cancelar la orden" });
  }
};

// Reimprimir etiqueta
export const reimprintLabel = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    // Aquí se implementaría la lógica de reimpresión
    // Por ahora solo devolvemos éxito
    return res.json({ message: "Etiqueta reimpresa con éxito" });
  } catch (error) {
    console.error("❌ Error al reimprimir etiqueta:", error);
    return res.status(500).json({ error: "Error al reimprimir etiqueta" });
  }
};
