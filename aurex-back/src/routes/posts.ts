import { Router, Request, Response } from "express";
import { verificarToken } from "./controllers/verificacion";
import {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  updatePost,
  deletePost,
} from "./controllers/posts";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const router = Router();

// Configuración de multer
const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB por imagen
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (jpg, png, webp)"));
    }
  },
});

// POST /posts - Crear nueva publicación
router.post(
  "/",
  verificarToken,
  upload.array("images", 5), // Hasta 5 imágenes
  async (req: Request, res: Response) => {
    try {
      console.log("Data", req.body);

      const data = req.body;
      data.userId = req.body.user.id;

      // Validar que se envíe el productId
      if (!data.productId) {
        return res.status(400).json({ error: "productId is required" });
      }

      // Procesar imágenes
      const files = (req as any).files as Express.Multer.File[];
      if (files && files.length > 0) {
        data.images = [];
        for (const file of files) {
          // Guardar original
          const originalPath = path.join(
            __dirname,
            "../../uploads/originals",
            `${Date.now()}_${file.originalname}`
          );
          fs.writeFileSync(originalPath, new Uint8Array(file.buffer));

          // Comprimir y guardar portada
          const compressedPath = path.join(
            __dirname,
            "../../uploads/covers",
            `${Date.now()}_cover_${file.originalname}`
          );
          await sharp(file.buffer)
            .resize(400) // ancho máximo 400px
            .jpeg({ quality: 70 })
            .toFile(compressedPath);

          data.images.push({
            original: originalPath,
            cover: compressedPath,
          });
        }
      }
      console.log("Antes de creat");

      const response = await createPost(data);
      res.status(201).json(response);
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
);

// GET /posts - Obtener todas las publicaciones con filtros
router.get("/", async (req: Request, res: Response) => {
  try {
    const filters = {
      marketplace: req.query.marketplace === "true",
      title: req.query.title as string,
      category1: req.query.category1 as string,
      category2: req.query.category2 as string,
      minPrice: req.query.minPrice
        ? parseFloat(req.query.minPrice as string)
        : undefined,
      maxPrice: req.query.maxPrice
        ? parseFloat(req.query.maxPrice as string)
        : undefined,
      status: req.query.status as string,
    };

    // Remover filtros undefined
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    );

    const response = await getAllPosts(cleanFilters);
    res.status(200).json(response);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// GET /posts/:id - Obtener una publicación específica
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await getPostById(id);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET /posts/user/:userId - Obtener publicaciones de un usuario específico
router.get(
  "/user/:userId",
  verificarToken,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const response = await getPostsByUser(userId);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// PATCH /posts/:id - Actualizar publicación
router.patch("/:id", verificarToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = { ...req.body, id };

    const response = await updatePost(data);
    res.status(200).json(response);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /posts/:id - Eliminar publicación
router.delete("/:id", verificarToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await deletePost(id);
    res.status(200).json(response);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
