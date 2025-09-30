import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

const secretKey: string | undefined = process.env.SECRET_KEY;

console.log(secretKey);
if (!secretKey) {
  throw new Error(
    "The secret key is not defined in the environment variables."
  );
}

const verificarToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token to header
    const token = req.headers.authorization?.split(" ")[1];

    // Check token
    if (!token) throw new Error("Token not provided");

    // Decode info in th token
    const decoded = jwt.verify(token, secretKey);

    // Add user data to req with the next function
    req.body.user = decoded;

    next();
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

const verificarRol = (rolesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req.body;

      if (!user) {
        return res.status(401).json({ error: "User not found in token" });
      }

      if (!rolesPermitidos.includes(user.rol)) {
        return res.status(403).json({ 
          error: `Access denied. Required roles: ${rolesPermitidos.join(", ")}` 
        });
      }

      next();
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  };
};

const verificarAdmin = verificarRol(["Administrador"]);

export { verificarToken, verificarRol, verificarAdmin };
