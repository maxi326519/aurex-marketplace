import { loginUser, registerUser } from "./controllers/login";
import { Request, Response } from "express";
import { User, Business } from "../db";
import { verificarToken } from "./controllers/verificacion";
import { Router } from "express";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    console.log(email, password, role);

    if (!email) throw new Error("missing parameter 'email'");
    if (!password) throw new Error("missing parameter 'password'");
    if (!role) throw new Error("missing parameter 'role'");

    const newUser = await registerUser(email, password, role);

    res.status(200).json({ user: newUser });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
  }
});

router.post("/token", verificarToken, async (req: Request, res: Response) => {
  try {
    const { user } = req.body;

    if (!user) throw new Error("User not found");

    const userData = await User.findByPk(user.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!userData) throw new Error("User not found");

    res.status(200).json(userData);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/complete-registration", verificarToken, async (req: Request, res: Response) => {
  try {
    const { user: userFromToken } = req.body;
    const { user: userData, business: businessData } = req.body;

    if (!userFromToken) throw new Error("User not found in token");

    // Buscar el usuario actual
    const currentUser = await User.findByPk(userFromToken.userId);
    if (!currentUser) throw new Error("User not found");

    // Actualizar datos del usuario
    const updatedUser = await currentUser.update({
      name: userData.name,
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      state: userData.state,
      zipCode: userData.zipCode,
      rol: userData.rol,
    });

    let business = null;

    // Si es vendedor, crear o actualizar el negocio
    if (userData.rol === "Vendedor" && businessData) {
      business = await Business.create({
        businessName: businessData.businessName,
        businessType: businessData.businessType,
        businessDescription: businessData.businessDescription,
        address: businessData.address,
        city: businessData.city,
        state: businessData.state,
        zipCode: businessData.zipCode,
        taxId: businessData.taxId,
        bankAccount: businessData.bankAccount,
        userId: currentUser.dataValues.id,
      });

      // Actualizar el businessId en el usuario
      await updatedUser.update({ businessId: business.dataValues.id });
    }

    // Preparar respuesta
    const response: any = {
      user: {
        id: updatedUser.dataValues.id,
        name: updatedUser.dataValues.name,
        email: updatedUser.dataValues.email,
        photo: updatedUser.dataValues.photo,
        rol: updatedUser.dataValues.rol,
        status: updatedUser.dataValues.status,
        phone: updatedUser.dataValues.phone,
        address: updatedUser.dataValues.address,
        city: updatedUser.dataValues.city,
        state: updatedUser.dataValues.state,
        zipCode: updatedUser.dataValues.zipCode,
        businessId: updatedUser.dataValues.businessId,
      }
    };

    if (business) {
      response.business = business;
    }

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error completing registration:", error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
