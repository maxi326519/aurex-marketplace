import { Router } from "express";
import {
  createReview,
  getReviewsByOrder,
  getReviewByOrderItem,
  getReviewsByPost,
  deleteReview,
} from "./controllers/reviews";

const router = Router();

// Crear una reseña por OrderItem
router.post("/", createReview);

// Obtener todas las reviews de los OrderItems de una Order
router.get("/byOrder/:orderId", getReviewsByOrder);

// Obtener la review de un OrderItem específico
router.get("/byOrderItem/:orderItemId", getReviewByOrderItem);

// Obtener reviews de una publicación con paginado
router.get("/byPosts/:postsId", getReviewsByPost);

// Eliminar una review (solo admin)
router.delete("/:reviewId", deleteReview);

export default router;
