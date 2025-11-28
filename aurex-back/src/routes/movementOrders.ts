import { Request, Response, Router } from "express";
import { Business } from "../db";
import {
  createMovementOrder,
  getAllMovementOrders,
  updateMovementOrder,
  deleteMovementOrder,
  completeMovementOrder,
} from "./controllers/movementOrders";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Asegurar que el directorio uploads existe
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Definir almacenamiento con nombre original + timestamp en carpeta por businessId
// NOTA: Multer no soporta funciones async en destination, por lo que usamos un directorio temporal
// y luego movemos los archivos en la ruta después de obtener el businessId
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Usar un directorio temporal, luego moveremos los archivos después de obtener el businessId
    const tempDir = path.join(uploadsDir, "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
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
    { name: "remittance", maxCount: 1 }, // Opcional para egresos
  ]),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Obtener userId del token (desde req.user que fue establecido por verificarToken)
      const user = (req as any).user || req.body.user;
      const userId = user?.userId;
      
      if (!userId) {
        return res.status(400).json({
          error: "UserId no encontrado en el token de usuario.",
        });
      }

      const { ...data } = req.body;
      const productsFile = files["products"]?.[0];
      const remittanceFile = files["remittance"]?.[0];
      const orderType = data.type;

      if (!productsFile) {
        return res.status(400).json({
          error: "El archivo de productos es requerido.",
        });
      }

      // El remito solo es requerido para ingresos (ENTRADA)
      if (orderType === "ENTRADA" && !remittanceFile) {
        return res.status(400).json({
          error: "El archivo de remito es requerido para órdenes de ingreso.",
        });
      }

      // Validaciones de archivos
      if (!productsFile.originalname.match(/\.(xls|xlsx)$/)) {
        return res.status(400).json({
          error: "'products' file must be an Excel file (.xls or .xlsx).",
        });
      }

      if (
        remittanceFile &&
        !remittanceFile.originalname.match(/\.(pdf|jpg|jpeg|png)$/)
      ) {
        return res.status(400).json({
          error:
            "'remittance' file must be a PDF or an image file (.jpg, .jpeg, .png).",
        });
      }

      // Obtener el business desde la base de datos usando el userId
      const business = await Business.findOne({ where: { UserId: userId } });
      if (!business) {
        return res.status(400).json({
          error: "Business no encontrado para este usuario.",
        });
      }

      const businessId = business.dataValues.id;

      // Mover archivos del directorio temporal al directorio del business
      const businessDir = path.join(uploadsDir, "movement-orders", businessId);
      if (!fs.existsSync(businessDir)) {
        fs.mkdirSync(businessDir, { recursive: true });
      }

      // Mover archivo de productos
      const productsFinalPath = path.join(
        businessDir,
        path.basename(productsFile.path)
      );
      fs.renameSync(productsFile.path, productsFinalPath);
      productsFile.path = productsFinalPath;

      // Mover archivo de remito si existe
      if (remittanceFile) {
        const remittanceFinalPath = path.join(
          businessDir,
          path.basename(remittanceFile.path)
        );
        fs.renameSync(remittanceFile.path, remittanceFinalPath);
        remittanceFile.path = remittanceFinalPath;
      }

      const newMovementOrder = await createMovementOrder(
        data,
        productsFile,
        remittanceFile || null,
        businessId
      );
      res.status(200).json(newMovementOrder);
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
    // El state puede ser un string simple o múltiples estados separados por comas
    const movementOrders = await getAllMovementOrders(state as string);
    res.status(200).json(movementOrders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/", async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const updatedMovementOrder = await updateMovementOrder(data);
    res.status(200).json(updatedMovementOrder);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteMovementOrder(id);
    res
      .status(200)
      .json({ message: `MovementOrder with ID ${id} successfully removed.` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/complete", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stockItems, state } = req.body;
    
    // Obtener userId del token (desde req.user que fue establecido por verificarToken)
    const user = (req as any).user || req.body.user;
    const userId = user?.userId;
    
    if (!userId) {
      return res.status(400).json({
        error: "UserId no encontrado en el token de usuario.",
      });
    }

    if (!state) {
      return res.status(400).json({
        error: "El estado es requerido.",
      });
    }

    const result = await completeMovementOrder(id, stockItems, userId, state);
    res.status(200).json(result);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
