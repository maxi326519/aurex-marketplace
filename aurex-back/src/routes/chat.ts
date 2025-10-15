import { Router } from "express";
import {
  createChat,
  getChatByOrder,
  updateChat,
  deleteChat,
} from "./controllers/chat";

const router = Router();

// Crear un chat por orden
router.post("/", createChat);

// Obtener chat y últimos 10 mensajes por orden
router.get("/byOrder", getChatByOrder);

// Actualizar datos de un chat (solo admin)
router.patch("/:chatId", updateChat);

// Eliminar un chat y sus mensajes (solo admin)
router.delete("/:chatId", deleteChat);

export default router;
