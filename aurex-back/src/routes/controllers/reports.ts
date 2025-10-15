import { Report, User, Business, Order, Chat } from "../../db";
import { Request, Response } from "express";

// Crear un reporte
export const createReport = async (req: Request, res: Response) => {
  try {
    const {
      openReason,
      description,
      OrderId,
      BusinessId,
      ChatId,
    } = req.body;
    const userId = req.body.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!openReason || !description) {
      return res
        .status(400)
        .json({ error: "openReason y description son requeridos" });
    }

    // Verificar que al menos uno de los IDs esté presente
    if (!OrderId && !BusinessId) {
      return res
        .status(400)
        .json({ error: "Debe especificar OrderId o BusinessId" });
    }

    // Si se proporciona OrderId, verificar que la orden existe y pertenece al usuario
    if (OrderId) {
      const order = await Order.findOne({
        where: { id: OrderId, UserId: userId },
      });

      if (!order) {
        return res
          .status(404)
          .json({ error: "Orden no encontrada o no tienes permisos" });
      }
    }

    // Si se proporciona BusinessId, verificar que el business existe
    if (BusinessId) {
      const business = await Business.findByPk(BusinessId);

      if (!business) {
        return res.status(404).json({ error: "Negocio no encontrado" });
      }
    }

    // Si se proporciona ChatId, verificar que el chat existe y pertenece al usuario
    if (ChatId) {
      const chat = await Chat.findOne({
        where: { id: ChatId, UserId: userId },
      });

      if (!chat) {
        return res
          .status(404)
          .json({ error: "Chat no encontrado o no tienes permisos" });
      }
    }

    // Crear nuevo reporte
    const newReport = await Report.create({
      openReason,
      description,
      UserId: userId,
      OrderId: OrderId || null,
      BusinessId: BusinessId || null,
      ChatId: ChatId || null,
      state: "Abierto",
    });

    // Obtener el reporte con información relacionada
    const reportWithDetails = await Report.findByPk(newReport.dataValues.id, {
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
          required: false,
        },
        {
          model: Order,
          as: "Order",
          attributes: ["id", "totalPrice"],
          required: false,
        },
        {
          model: Chat,
          as: "Chat",
          attributes: ["id", "type"],
          required: false,
        },
      ],
    });

    res.status(201).json({
      message: "Reporte creado exitosamente",
      report: reportWithDetails,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener reportes con paginación (solo admin)
export const getReports = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.body.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Verificar que el usuario es admin
    const isAdmin = true; // TODO: Implementar verificación de admin

    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Solo administradores pueden ver reportes" });
    }

    // Calcular offset para paginación
    const offset = (Number(page) - 1) * Number(limit);

    // Obtener reportes con paginación
    const reports = await Report.findAndCountAll({
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
          required: false,
        },
        {
          model: Order,
          as: "Order",
          attributes: ["id", "totalPrice"],
          required: false,
        },
        {
          model: Chat,
          as: "Chat",
          attributes: ["id", "type"],
          required: false,
        },
      ],
      order: [["date", "DESC"]],
      limit: Number(limit),
      offset: offset,
    });

    // Calcular información de paginación
    const totalPages = Math.ceil(reports.count / Number(limit));
    const hasNextPage = Number(page) < totalPages;
    const hasPrevPage = Number(page) > 1;

    res.status(200).json({
      reports: reports.rows,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalReports: reports.count,
        hasNextPage,
        hasPrevPage,
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error getting reports:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar un reporte (solo admin)
export const updateReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const { closeReason, notes, state, AdminId } = req.body;
    const userId = req.body.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Verificar que el usuario es admin
    const isAdmin = true; // TODO: Implementar verificación de admin

    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Solo administradores pueden actualizar reportes" });
    }

    // Buscar el reporte
    const report = await Report.findByPk(reportId);

    if (!report) {
      return res.status(404).json({ error: "Reporte no encontrado" });
    }

    // Preparar datos de actualización
    const updateData: any = {};
    if (closeReason !== undefined) updateData.closeReason = closeReason;
    if (notes !== undefined) updateData.notes = notes;
    if (state !== undefined) updateData.state = state;
    if (AdminId !== undefined) updateData.AdminId = AdminId;

    // Actualizar el reporte
    await report.update(updateData);

    // Obtener el reporte actualizado con información relacionada
    const updatedReport = await Report.findByPk(reportId, {
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
          required: false,
        },
        {
          model: Order,
          as: "Order",
          attributes: ["id", "totalPrice"],
          required: false,
        },
        {
          model: Chat,
          as: "Chat",
          attributes: ["id", "type"],
          required: false,
        },
      ],
    });

    res.status(200).json({
      message: "Reporte actualizado exitosamente",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar un reporte (solo admin)
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const userId = req.body.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Verificar que el usuario es admin
    const isAdmin = true; // TODO: Implementar verificación de admin

    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Solo administradores pueden eliminar reportes" });
    }

    // Buscar el reporte
    const report = await Report.findByPk(reportId);

    if (!report) {
      return res.status(404).json({ error: "Reporte no encontrado" });
    }

    // Eliminar el reporte
    await report.destroy();

    res.status(200).json({
      message: "Reporte eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
