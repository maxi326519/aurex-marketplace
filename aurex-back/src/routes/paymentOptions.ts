import { Request, Response } from "express";
import { Router } from "express";
import {
  getPaymentOptionsByUser,
  createPaymentOption,
  updatePaymentOption,
  deletePaymentOption,
} from "./controllers/paymentOptions";

const router = Router();

// Obtener opciones de pago por usuario (userId en query o desde auth)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const options = await getPaymentOptionsByUser(userId as string);
    res.status(200).json(options);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nueva opción de pago
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newOption = await createPaymentOption(data);
    res.status(201).json(newOption);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar opción de pago
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedOption = await updatePaymentOption(id, data);
    res.status(200).json(updatedOption);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar opción de pago
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deletePaymentOption(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;