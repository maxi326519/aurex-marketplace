import { Chat, Message, User, Business, Order } from "../../db";
import { Request, Response } from "express";

// Crear un chat por orden
export const createChat = async (req: Request, res: Response) => {
  try {
    const { orderId, type = "Venta" } = req.body;
    const userId = req.body.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!orderId) {
      return res.status(400).json({ error: "OrderId es requerido" });
    }

    // Verificar que la orden existe y pertenece al usuario
    const order = await Order.findOne({
      where: { id: orderId, UserId: userId },
      include: [
        {
          model: Business,
          as: "Business",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!order) {
      return res
        .status(404)
        .json({ error: "Orden no encontrada o no tienes permisos" });
    }

    // Verificar si ya existe un chat para esta orden
    const existingChat = await Chat.findOne({
      where: {
        type: "Venta",
        UserId: userId,
        BusinessId: order.dataValues.BusinessId,
      },
    });

    if (existingChat) {
      return res.status(200).json({
        message: "Chat ya existe para esta orden",
        chat: existingChat,
      });
    }

    // Crear nuevo chat
    const newChat = await Chat.create({
      type: type as "Venta" | "Reporte",
      state: "Abierto",
      UserId: userId,
      BusinessId: order.dataValues.BusinessId,
    });

    res.status(201).json({
      message: "Chat creado exitosamente",
      chat: newChat,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener chat y últimos 10 mensajes por orden
export const getChatByOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.query;
    const userId = req.body.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!orderId) {
      return res.status(400).json({ error: "OrderId es requerido" });
    }

    // Verificar que la orden existe y pertenece al usuario
    const order = await Order.findOne({
      where: { id: orderId, UserId: userId },
      include: [
        {
          model: Business,
          as: "Business",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!order) {
      return res
        .status(404)
        .json({ error: "Orden no encontrada o no tienes permisos" });
    }

    // Buscar chat para esta orden
    const chat = await Chat.findOne({
      where: {
        type: "Venta",
        UserId: userId,
        BusinessId: order.dataValues.BusinessId,
      },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "email"],
        },
        {
          model: Business,
          as: "Business",
          attributes: ["id", "name", "type"],
        },
      ],
    });

    if (!chat) {
      return res
        .status(404)
        .json({ error: "No se encontró chat para esta orden" });
    }

    // Obtener últimos 10 mensajes
    const messages = await Message.findAll({
      where: { ChatId: chat.dataValues.id },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name"],
        },
        {
          model: Business,
          as: "Business",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "Admin",
          attributes: ["id", "name"],
        },
      ],
      order: [["date", "DESC"]],
      limit: 10,
    });

    res.status(200).json({
      chat: chat,
      messages: messages.reverse(), // Ordenar cronológicamente
    });
  } catch (error) {
    console.error("Error getting chat by order:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar datos de un chat (solo admin)
export const updateChat = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { state, AdminId } = req.body;
    const userId = req.body.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Verificar que el usuario es admin (aquí deberías implementar la lógica de verificación de admin)
    // Por ahora asumimos que si llega aquí es admin
    const isAdmin = true; // TODO: Implementar verificación de admin

    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Solo administradores pueden actualizar chats" });
    }

    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat no encontrado" });
    }

    // Actualizar chat
    const updateData: any = {};
    if (state) updateData.state = state;
    if (AdminId) updateData.AdminId = AdminId;

    await chat.update(updateData);

    res.status(200).json({
      message: "Chat actualizado exitosamente",
      chat: chat,
    });
  } catch (error) {
    console.error("Error updating chat:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar un chat y sus mensajes (solo admin)
export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.body.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Verificar que el usuario es admin
    const isAdmin = true; // TODO: Implementar verificación de admin

    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Solo administradores pueden eliminar chats" });
    }

    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat no encontrado" });
    }

    // Eliminar mensajes primero
    await Message.destroy({
      where: { ChatId: chatId },
    });

    // Eliminar chat
    await chat.destroy();

    res.status(200).json({
      message: "Chat y mensajes eliminados exitosamente",
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
