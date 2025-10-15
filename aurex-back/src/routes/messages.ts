import { Router } from "express";
import {
  createMessage,
  getMessages,
  deleteMessages,
} from "./controllers/messages";

const router = Router();

// Crear un mensaje en el chat
router.post("/:chatId", createMessage);

// Obtener mensajes del chat con paginado
router.get("/:chatId", getMessages);

// Eliminar mensajes del chat (solo admin)
router.delete("/:chatId", deleteMessages);

export default router;
