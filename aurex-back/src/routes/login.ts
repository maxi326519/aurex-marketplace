import { loginUser, registerUser } from "./controllers/login";
import { UserRol, UserStatus, UserTS } from "../interfaces/UserTS";
import { Request, Response } from "express";
import { verificarToken } from "./controllers/verificacion";
import { User, Business } from "../db";
import { BusinessTS } from "../interfaces/Business";
import { Router } from "express";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    res
      .status(400)
      .json({ error: error?.message || "Error al registrar usuario" });
  }
});

router.post("/signup", async (req: Request, res: Response) => {
  try {
    // Get data to request
    const { email, password, role } = req.body;
    const validateEmail = (email: string) => !/\S+@\S+\.\S+/.test(email);

    // Validate params
    if (email === "") throw new Error("missing parameter (email)");
    if (validateEmail(email)) throw new Error("Invalid email format");
    if (role === "") throw new Error("missing parameter (role)");
    if (role !== UserRol.CLIENT && role !== UserRol.SELLER)
      throw new Error("invalid role");
    if (password === "") throw new Error("missing parameter (password)");
    if (password.length < 6)
      throw new Error("password must be at least 6 characters long");

    // Create new the user and login
    await registerUser(email, password, role);

    // Response confirmation
    res.status(200).json({ message: "User registered successfully" });
  } catch (error: any) {
    console.log(error);
    res
      .status(404)
      .json({ error: error?.message || "Error al registrar usuario" });
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

router.put(
  "/complete-registration",
  verificarToken,
  async (req: Request, res: Response) => {
    try {
      // Get data to request
      const userToken = req.body.user;
      const userData: UserTS = req.body.userData as UserTS;
      const businessData: BusinessTS = req.body.businessData as BusinessTS;

      console.log(req.body);
      console.log(userData?.id, userToken?.userId);
      console.log(userData?.id !== userToken?.userId);

      // Check allowed access
      if (userData?.id !== userToken?.userId)
        throw new Error("The user id not allowed access");

      // Check user data required
      if (!userData) throw new Error("userData not found");
      if (!userData.id) throw new Error("userData.id not found");
      if (!userData.name) throw new Error("userData.name not found");

      // Check business data required
      if (!businessData) throw new Error("businessData not found");
      if (!businessData.name) throw new Error("businessData.name not found");
      if (!businessData.type) throw new Error("businessData.type not found");
      if (!businessData.description)
        throw new Error("businessData.description not found");

      // Get user current data
      const currentUser = await User.findByPk(userData.id);
      if (!currentUser) throw new Error("User not found");
      const businessExist = await Business.findOne({
        where: { userId: userData.id },
      });
      if (businessExist) throw new Error("Business already exists");

      // Update user data
      const updatedUser = await currentUser.update({
        name: userData.name,
        status: UserStatus.WAITING,
        photo: userData.photo,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zipCode: userData.zipCode,
      });

      // Create business and connect with the user
      const business = await Business.create({
        name: businessData.name,
        type: businessData.type,
        description: businessData.description,
        address: businessData.address,
        city: businessData.city,
        state: businessData.state,
        zipCode: businessData.zipCode,
        taxId: businessData.taxId,
        bankAccount: businessData.bankAccount,
        userId: currentUser.dataValues.id,
      });

      // Connect the business with the user
      await updatedUser.update({ businessId: business.dataValues.id });

      // Format user data
      const userResponse = updatedUser.dataValues;
      delete userResponse.password;
      const response = {
        user: userResponse,
        business: business.dataValues,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.error("Error completing registration:", error);
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
