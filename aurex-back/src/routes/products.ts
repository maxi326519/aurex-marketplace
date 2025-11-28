import { Request, Response } from "express";
import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  updateProducts,
  deleteProduct,
  disableProduct,
  getProductsWithStock,
  validateProducts,
  validateStockOnly,
  validateAndReserveStock,
  validateStockByStorage,
} from "./controllers/products";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { user, ...productData } = req.body;

    console.log(user);

    const newProduct = await createProduct(productData, user.userId);
    res.status(201).json(newProduct);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;

    const response = await getAllProducts(page, limit, search, status);
    res.status(200).json(response);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.patch("/", async (req: Request, res: Response) => {
  try {
    const product = req.body;
    await updateProducts(product);
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteProduct(id);
    res
      .status(200)
      .json({ message: `Product with ID ${id} successfully removed.` });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { disabled } = req.body;

    if (disabled === undefined) {
      throw new Error('The "disable" field is required in the request body');
    }

    await disableProduct(id, disabled);

    res.json({
      message: `Product ${disabled ? "disabled" : "enabled"} successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing product status" });
  }
});

router.get("/with-stock", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;
    const businessId = req.query.businessId as string | undefined;

    const response = await getProductsWithStock(
      page,
      limit,
      search,
      status,
      businessId
    );
    res.status(200).json(response);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/validate", async (req: Request, res: Response) => {
  try {
    const { user, products, businessId } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: "Products array is required" });
    }

    // Si se proporciona businessId, usarlo directamente (para admin)
    // Si no, usar el userId del usuario
    const userId = user?.userId;
    
    if (!businessId && !userId) {
      return res.status(400).json({
        error: "Either user information or businessId is required.",
      });
    }

    const validationResults = await validateProducts(products, userId, businessId);
    res.status(200).json(validationResults);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/validate-stock", async (req: Request, res: Response) => {
  try {
    const { products, businessId } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: "Products array is required" });
    }

    if (!businessId) {
      return res.status(400).json({
        error: "businessId is required.",
      });
    }

    const validationResults = await validateAndReserveStock(products, businessId);
    res.status(200).json(validationResults);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/validate-stock-only", async (req: Request, res: Response) => {
  try {
    const { products, businessId } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: "Products array is required" });
    }

    if (!businessId) {
      return res.status(400).json({
        error: "businessId is required.",
      });
    }

    const validationResults = await validateStockOnly(products, businessId);
    res.status(200).json(validationResults);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/validate-stock-by-storage", async (req: Request, res: Response) => {
  try {
    const { items, businessId } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Items array is required" });
    }

    if (!businessId) {
      return res.status(400).json({
        error: "businessId is required.",
      });
    }

    const validationResults = await validateStockByStorage(items, businessId);
    res.status(200).json(validationResults);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
