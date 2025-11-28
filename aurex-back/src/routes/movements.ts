import { Request, Response } from "express";
import { Router } from "express";
import {
  getMovements,
  getMovementsByProductId,
  getMovementsByBusiness,
  getMovementsByStorage,
  getMovementsByStock,
} from "./controllers/movements";

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

router.get("/business/:businessId", async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const movements = await getMovementsByBusiness(businessId);
    res.status(200).json(movements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/storage/:storageId", async (req: Request, res: Response) => {
  try {
    const { storageId } = req.params;
    const movements = await getMovementsByStorage(storageId);
    res.status(200).json(movements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/stock/:stockId", async (req: Request, res: Response) => {
  try {
    const { stockId } = req.params;
    const movements = await getMovementsByStock(stockId);
    res.status(200).json(movements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
