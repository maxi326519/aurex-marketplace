import { Request, Response } from "express";
import { Router } from "express";
import {
  setUser,
  getAllUsers,
  updateUser,
  disableUser,
  deleteUser,
} from "./controllers/users";
import { verificarAdmin } from "./controllers/verificacion";
import { User, Business } from "../db";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const response = await setUser(user);
    res.status(200).json(response);
  } catch (error: any) {
    console.log(error);
    switch (error.errors?.[0].type) {
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

router.get("/", async (_, res: Response) => {
  try {
    const response = await getAllUsers();
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/", async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    await updateUser(userData);
    res.status(200).json({ msg: "update user successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { disabled } = req.body;

    if (disabled === undefined) {
      throw new Error('The "disable" field is required in the request body');
    }

    await disableUser(id, disabled);

    res.json({
      message: `User ${disabled ? "disabled" : "enabled"} successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing user status" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteUser(id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Ruta para obtener vendedores con datos de empresa (solo administradores)
router.get("/sellers", verificarAdmin, async (req: Request, res: Response) => {
  try {
    const sellers = await User.findAll({
      where: { rol: "Vendedor" },
      attributes: { exclude: ["password"] },
      include: [{
        model: Business,
        as: 'Business',
        required: true // Solo incluir usuarios que tengan negocio
      }]
    });

    res.status(200).json(sellers);
  } catch (error: any) {
    console.error("Error getting sellers with business:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
