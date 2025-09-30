import { Request, Response } from "express";
import { Router } from "express";
import {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  getBusinessByUserId,
} from "./controllers/business";
import { verificarToken } from "./controllers/verificacion";

const router = Router();

// Crear un nuevo negocio
router.post("/", verificarToken, async (req: Request, res: Response) => {
  try {
    const businessData = req.body;
    const response = await createBusiness(businessData);
    res.status(200).json(response);
  } catch (error: any) {
    console.log(error);
    switch (error.errors?.[0]?.type) {
      case "unique violation":
        res.status(400).send({ error: error.errors[0].message });
        break;
      case "notNull Violation":
        res
          .status(500)
          .json({ error: `missing parameter (${error.errors[0].path})` });
        break;
      default:
        res.status(500).json({ error: error.message });
        break;
    }
  }
});

// Obtener todos los negocios
router.get("/", verificarToken, async (_, res: Response) => {
  try {
    const response = await getAllBusinesses();
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener negocio por ID
router.get("/:id", verificarToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await getBusinessById(id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener negocio por ID de usuario
router.get("/user/:userId", verificarToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const response = await getBusinessByUserId(userId);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar negocio
router.patch("/", verificarToken, async (req: Request, res: Response) => {
  try {
    const businessData = req.body;
    await updateBusiness(businessData);
    res.status(200).json({ msg: "Business updated successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar negocio
router.delete("/:id", verificarToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteBusiness(id);
    res.json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Error deleting business" });
  }
});

export default router;
