import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/Auth/useAuth";
import { UserRol } from "../interfaces/Users";

import Header from "../components/Marketplace/Header";
import Footer from "../components/Marketplace/Footer";
import Input from "../components/Dashboard/Inputs/Input";
import Button from "../components/ui/Button";

export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  function handleRegister(role: UserRol.CLIENT | UserRol.SELLER) {
    auth
      .register(email, password, role)
      .then((user) => {
        if (user?.rol === UserRol.CLIENT) navigate("/registro/comprador");
        if (user?.rol === UserRol.SELLER) navigate("/registro/vendedor");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleLogin() {
    navigate("/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={false} />
      <div className="grow flex flex-col justify-center items-center gap-4 py-10">
        <Input
          name="email"
          label="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          name="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2">
          <Button type="primary" onClick={() => handleRegister(UserRol.CLIENT)}>
            Comprador
          </Button>
          <Button type="primary" onClick={() => handleRegister(UserRol.SELLER)}>
            Vendedor
          </Button>
          <Button
            type="primary"
            variant="outline"
            onClick={() => handleLogin()}
          >
            Iniciar sesión
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
