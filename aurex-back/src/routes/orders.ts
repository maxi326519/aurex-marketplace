import { 
  getAllOrders, 
  getOrderById, 
  createOrder, 
  updateOrder, 
  pickOrder, 
  scanProduct, 
  egressOrder, 
  cancelOrder, 
  reimprintLabel 
} from "./controllers/orders";
import { Router } from "express";

const router = Router();

// Obtener todas las órdenes (con filtros opcionales)
router.get("/", getAllOrders);

// Obtener orden por ID
router.get("/:id", getOrderById);

// Crear orden
router.post("/", createOrder);

// Actualizar orden
router.put("/:id", updateOrder);

// Pickear orden
router.post("/:orderId/pick", pickOrder);

// Escanear producto (validar EAN)
router.post("/:orderId/scan", scanProduct);

// Egreso de orden (finalizar preparación)
router.post("/:orderId/egress", egressOrder);

// Cancelar orden
router.post("/:orderId/cancel", cancelOrder);

// Reimprimir etiqueta
router.post("/:orderId/reimprint", reimprintLabel);

export default router;
