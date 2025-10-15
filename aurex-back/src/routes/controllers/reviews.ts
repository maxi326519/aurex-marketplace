import { Review, User, Post, Business, Order, OrderItem } from "../../db";
import { Request, Response } from "express";

// Crear una reseña por OrderItem
export const createReview = async (req: Request, res: Response) => {
  try {
    const { score, description, PostId } = req.body;
    const userId = req.body.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!score || !description || !PostId) {
      return res
        .status(400)
        .json({ error: "Score, description y PostId son requeridos" });
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({ error: "Score debe estar entre 1 y 5" });
    }

    // Verificar que el Post existe
    const post = await Post.findByPk(PostId, {
      include: [
        {
          model: Business,
          as: "Business",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Verificar si el usuario ya hizo una reseña para este Post
    const existingReview = await Review.findOne({
      where: { UserId: userId, PostId: PostId },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ error: "Ya has realizado una reseña para este producto" });
    }

    // Crear nueva reseña
    const newReview = await Review.create({
      score,
      description,
      UserId: userId,
      PostId: PostId,
    });

    // Actualizar el promedio de score del Business
    await updateBusinessAverageScore(post.dataValues.BusinessId);

    // Obtener la reseña con información del usuario
    const reviewWithUser = await Review.findByPk(newReview.dataValues.id, {
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name"],
        },
        {
          model: Post,
          as: "Post",
          attributes: ["id", "title"],
        },
      ],
    });

    res.status(201).json({
      message: "Reseña creada exitosamente",
      review: reviewWithUser,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todas las reviews de los OrderItems de una Order
export const getReviewsByOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.body.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Verificar que la orden existe y pertenece al usuario
    const order = await Order.findOne({
      where: { id: orderId, UserId: userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Post,
              as: "Post",
              attributes: ["id", "title"],
              include: [
                {
                  model: Review,
                  as: "Reviews",
                  where: { UserId: userId },
                  required: false,
                  include: [
                    {
                      model: User,
                      as: "User",
                      attributes: ["id", "name"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res
        .status(404)
        .json({ error: "Orden no encontrada o no tienes permisos" });
    }

    // Extraer reviews de los items
    const reviews = order.dataValues.items
      .map((item: any) => item.Post?.Reviews)
      .filter((review: any) => review && review.length > 0)
      .flat();

    res.status(200).json({
      reviews: reviews,
    });
  } catch (error) {
    console.error("Error getting reviews by order:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener la review de un OrderItem específico
export const getReviewByOrderItem = async (req: Request, res: Response) => {
  try {
    const { orderItemId } = req.params;
    const userId = req.body.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Verificar que el OrderItem existe y pertenece al usuario
    const orderItem = await OrderItem.findOne({
      where: { id: orderItemId },
      include: [
        {
          model: Order,
          as: "Order",
          where: { UserId: userId },
        },
        {
          model: Post,
          as: "Post",
          attributes: ["id", "title"],
          include: [
            {
              model: Review,
              as: "Reviews",
              where: { UserId: userId },
              required: false,
              include: [
                {
                  model: User,
                  as: "User",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!orderItem) {
      return res
        .status(404)
        .json({ error: "Item no encontrado o no tienes permisos" });
    }

    const review = orderItem.dataValues.Post?.Reviews?.[0] || null;

    res.status(200).json({
      review: review,
    });
  } catch (error) {
    console.error("Error getting review by order item:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener reviews de una publicación con paginado
export const getReviewsByPost = async (req: Request, res: Response) => {
  try {
    const { postsId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Verificar que el Post existe
    const post = await Post.findByPk(postsId);

    if (!post) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Calcular offset para paginación
    const offset = (Number(page) - 1) * Number(limit);

    // Obtener reviews con paginación
    const reviews = await Review.findAndCountAll({
      where: { PostId: postsId },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name"],
        },
      ],
      order: [["date", "DESC"]],
      limit: Number(limit),
      offset: offset,
    });

    // Calcular información de paginación
    const totalPages = Math.ceil(reviews.count / Number(limit));
    const hasNextPage = Number(page) < totalPages;
    const hasPrevPage = Number(page) > 1;

    res.status(200).json({
      reviews: reviews.rows,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalReviews: reviews.count,
        hasNextPage,
        hasPrevPage,
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error getting reviews by post:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar una review (solo admin)
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = req.body.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Verificar que el usuario es admin
    const isAdmin = true; // TODO: Implementar verificación de admin

    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Solo administradores pueden eliminar reseñas" });
    }

    // Obtener la review para obtener el PostId
    const review = await Review.findByPk(reviewId, {
      include: [
        {
          model: Post,
          as: "Post",
          attributes: ["BusinessId"],
        },
      ],
    });

    if (!review) {
      return res.status(404).json({ error: "Reseña no encontrada" });
    }

    // Eliminar la review
    await review.destroy();

    // Actualizar el promedio de score del Business
    await updateBusinessAverageScore(review.dataValues.Post.BusinessId);

    res.status(200).json({
      message: "Reseña eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función auxiliar para actualizar el promedio de score del Business
async function updateBusinessAverageScore(businessId: string) {
  try {
    // Obtener todas las reviews de los posts del business
    const reviews = await Review.findAll({
      include: [
        {
          model: Post,
          as: "Post",
          where: { BusinessId: businessId },
          attributes: [],
        },
      ],
    });

    if (reviews.length === 0) {
      // Si no hay reviews, establecer promedio en 0
      await Business.update(
        { averageScore: 0.0 },
        { where: { id: businessId } }
      );
      return;
    }

    // Calcular promedio
    const totalScore = reviews.reduce(
      (sum, review) => sum + review.dataValues.score,
      0
    );
    const averageScore = totalScore / reviews.length;

    // Actualizar el promedio en el Business
    await Business.update(
      { averageScore: Number(averageScore.toFixed(2)) },
      { where: { id: businessId } }
    );
  } catch (error) {
    console.error("Error updating business average score:", error);
  }
}
