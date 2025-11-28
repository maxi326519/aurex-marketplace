import { getMovements, getMovementsByProductId } from "./controllers/movements";
import { Request, Response } from "express";
import { Router } from "express";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const movements = await getMovements();
    res.status(200).json(movements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/product/:productId", async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const movements = await getMovementsByProductId(productId);
    res.status(200).json(movements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
