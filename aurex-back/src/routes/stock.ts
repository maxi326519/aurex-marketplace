import { Request, Response } from "express";
import { Router } from "express";
import {
  createStock,
  getStock,
  getStockByProductId,
  setEgress,
  setIngress,
  setTransfer,
} from "./controllers/stock";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { user, ...stock } = req.body;
    const newStock = await createStock(stock, user?.userId);
    res.status(200).json(newStock);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.get("/", async (_, res: Response) => {
  try {
    const stock = await getStock();
    res.status(200).json(stock);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:productId", async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const stock = await getStockByProductId(productId);
    res.status(200).json(stock);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.patch("/ingress", async (req: Request, res: Response) => {
  try {
    const { StockId, quantity, user } = req.body;
    console.log(StockId, quantity, user);

    const updatedStock = await setIngress(StockId, quantity, user?.userId);
    res.status(200).json(updatedStock);
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
});

router.patch("/egress", async (req: Request, res: Response) => {
  try {
    const { StockId, quantity, user } = req.body;
    const updatedStock = await setEgress(StockId, quantity, user?.userId);
    res.status(200).json(updatedStock);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.patch("/transfer", async (req: Request, res: Response) => {
  try {
    const { date, quantity, StockId, StorageId, user } = req.body;
    console.log(date, quantity, StockId, StorageId, user);

    const result = await setTransfer(
      date,
      quantity,
      StockId,
      StorageId,
      user?.userId
    );
    res.json(result);
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
});

export default router;
