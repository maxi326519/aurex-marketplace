import { Request, Response } from "express";
import { Router } from "express";
import {
  createStorage,
  getAllStorage,
  updateStorage,
  deleteStorage,
  disableStorage,
} from "./controllers/storages";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const storage = req.body;
    const newStorage = await createStorage(storage);
    res.status(200).json(newStorage);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const storage = await getAllStorage();
    res.status(200).json(storage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/", async (req: Request, res: Response) => {
  try {
    const storage = req.body;
    const existingUserIds = await updateStorage(storage);
    res.status(200).json(existingUserIds);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteStorage(id);
    res
      .status(200)
      .json({ message: `Storage with ID ${id} successfully removed.` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/disable/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await disableStorage(id);
    res
      .status(200)
      .json({ message: `Storage with ID ${id} successfully disabled.` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
