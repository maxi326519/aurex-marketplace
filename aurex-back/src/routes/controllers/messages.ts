import { Message, Chat, User, Business } from "../../db";
import { Request, Response } from "express";

// Crear un mensaje en el chat
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { text, type } = req.body;
    const userId = req.body.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!text || !type) {
      return res.status(400).json({ error: "Texto y tipo son requeridos" });
    }

    // Verificar que el chat existe y el usuario tiene acceso
    const chat = await Chat.findByPk(chatId, {
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
      ],
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat no encontrado" });
    }

    // Verificar acceso al chat
    const hasAccess =
      chat.dataValues.UserId === userId ||
      chat.dataValues.BusinessId === userId ||
      chat.dataValues.AdminId === userId;

    if (!hasAccess) {
      return res.status(403).json({ error: "No tienes acceso a este chat" });
    }

    // Determinar el tipo de usuario que envía el mensaje
    let messageType: "Cliente" | "Vendedor" | "Admin" = "Cliente";
    let senderId: string | undefined = undefined;
    let businessId: string | undefined = undefined;
    let adminId: string | undefined = undefined;

    if (chat.dataValues.UserId === userId) {
      messageType = "Cliente";
      senderId = userId;
    } else if (chat.dataValues.BusinessId === userId) {
      messageType = "Vendedor";
      businessId = userId;
    } else if (chat.dataValues.AdminId === userId) {
      messageType = "Admin";
      adminId = userId;
    }

    // Crear mensaje
    const newMessage = await Message.create({
      text,
      type: messageType,
      ChatId: chatId,
      UserId: senderId,
      BusinessId: businessId,
      AdminId: adminId,
    });

    // Obtener el mensaje con información del remitente
    const messageWithSender = await Message.findByPk(newMessage.dataValues.id, {
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
    });

    res.status(201).json({
      message: "Mensaje enviado exitosamente",
      data: messageWithSender,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener mensajes del chat con paginado
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const userId = req.body.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Verificar que el chat existe y el usuario tiene acceso
    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat no encontrado" });
    }

    // Verificar acceso al chat
    const hasAccess =
      chat.dataValues.UserId === userId ||
      chat.dataValues.BusinessId === userId ||
      chat.dataValues.AdminId === userId;

    if (!hasAccess) {
      return res.status(403).json({ error: "No tienes acceso a este chat" });
    }

    // Calcular offset para paginación
    const offset = (Number(page) - 1) * Number(limit);

    // Obtener mensajes con paginación
    const messages = await Message.findAndCountAll({
      where: { ChatId: chatId },
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
      order: [["date", "ASC"]],
      limit: Number(limit),
      offset: offset,
    });

    // Calcular información de paginación
    const totalPages = Math.ceil(messages.count / Number(limit));
    const hasNextPage = Number(page) < totalPages;
    const hasPrevPage = Number(page) > 1;

    res.status(200).json({
      messages: messages.rows,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalMessages: messages.count,
        hasNextPage,
        hasPrevPage,
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar mensajes del chat (solo admin)
export const deleteMessages = async (req: Request, res: Response) => {
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
        .json({ error: "Solo administradores pueden eliminar mensajes" });
    }

    // Verificar que el chat existe
    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat no encontrado" });
    }

    // Eliminar todos los mensajes del chat
    const deletedCount = await Message.destroy({
      where: { ChatId: chatId },
    });

    res.status(200).json({
      message: "Mensajes eliminados exitosamente",
      deletedCount,
    });
  } catch (error) {
    console.error("Error deleting messages:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
