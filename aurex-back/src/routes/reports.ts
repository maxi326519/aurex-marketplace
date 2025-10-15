import { Router } from "express";
import {
  createReport,
  getReports,
  updateReport,
  deleteReport,
} from "./controllers/reports";

const router = Router();

// Crear un reporte
router.post("/", createReport);

// Obtener reportes con paginación (solo admin)
router.get("/", getReports);

// Actualizar un reporte (solo admin)
router.patch("/:reportId", updateReport);

// Eliminar un reporte (solo admin)
router.patch("/delete/:reportId", deleteReport);

export default router;
