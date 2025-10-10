import { Request, Response } from "express";
import { verificarToken } from "./controllers/verificacion";
import { Router } from "express";
import {
  createReception,
  getAllReceptions,
  updateReception,
  deleteReception,
} from "./controllers/receptions";
import multer, { FileFilterCallback } from "multer";
import path from "path";

const router = Router();

// Definir almacenamiento con nombre original + timestamp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // carpeta donde se guardan
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

// Filtrar tipos de archivo antes de guardar
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.fieldname === "products") {
    // Solo Excel
    if (!file.originalname.match(/\.(xls|xlsx)$/)) {
      return cb(new Error("Products file must be .xls or .xlsx"));
    }
  }
  if (file.fieldname === "recipe") {
    // Solo PDF o imágenes
    if (!file.originalname.match(/\.(pdf|jpg|jpeg|png)$/)) {
      return cb(new Error("Recipe file must be .pdf, .jpg, .jpeg o .png"));
    }
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

router.post(
  "/",
  upload.fields([
    { name: "products", maxCount: 1 },
    { name: "remittance", maxCount: 1 },
  ]),
  verificarToken,
  async (req: Request, res: Response) => {
    try {
      const { user, ...data } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const productsFile = files["products"]?.[0];
      const remittanceFile = files["remittance"]?.[0];

      if (!productsFile || !remittanceFile) {
        return res.status(400).json({
          error: "Both 'products' and 'remittance' files are required.",
        });
      }

      // Aquí puedes agregar validaciones adicionales para los archivos si es necesario
      if (!productsFile.originalname.match(/\.(xls|xlsx)$/)) {
        return res.status(400).json({
          error: "'products' file must be an Excel file (.xls or .xlsx).",
        });
      }

      if (!remittanceFile.originalname.match(/\.(pdf|jpg|jpeg|png)$/)) {
        return res.status(400).json({
          error:
            "'remittance' file must be a PDF or an image file (.jpg, .jpeg, .png).",
        });
      }

      const newReception = await createReception(
        data,
        productsFile,
        remittanceFile,
        user?.businessId || user?.userId // Usar businessId si existe, sino userId como fallback
      );
      res.status(200).json(newReception);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/", async (req: Request, res: Response) => {
  try {
    const { state } = req.query;
    console.log("State", state);
    const receptions = await getAllReceptions(state as string);
    res.status(200).json(receptions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/", async (req: Request, res: Response) => {
  try {
    const { user, ...data } = req.body;
    const updatedReception = await updateReception(data);
    res.status(200).json(updatedReception);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteReception(id);
    res
      .status(200)
      .json({ message: `Reception with ID ${id} successfully removed.` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
