import { LoginData, User, UserRol } from "../interfaces/Users";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/Auth/useAuth";
import Swal from "sweetalert2";

import Header from "../components/Marketplace/Header";
import Footer from "../components/Marketplace/Footer";
import Input from "../components/Dashboard/Inputs/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  function handleLogin(data: LoginData, cb: (user: User | undefined) => void) {
    return auth
      .login(data)
      .then(cb)
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo iniciar sesión",
        });
      });
  }

  function handleSetLogin() {
    handleLogin({ email, password }, (user: User | undefined) => {
      if (user?.rol === UserRol.CLIENT) navigate("/");
      if (user?.rol === UserRol.SELLER) navigate("/panel/vendedor/analiticas");
      if (user?.rol === UserRol.ADMIN) navigate("/panel/admin/analiticas");
    });
  }

  function handleRegister() {
    navigate("/registrarse");
  }

  function handleSetClient() {
    handleLogin({ email: "comprador@example.com", password: "123qwe" }, () =>
      navigate("/panel/compras")
    );
  }

  function handleSetSeller() {
    handleLogin({ email: "vendedor@example.com", password: "123qwe" }, () =>
      navigate("/panel/vendedor/analiticas")
    );
  }

  function handleSetAdmin() {
    handleLogin({ email: "admin@example.com", password: "123qwe" }, () =>
      navigate("/panel/admin/analiticas")
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="grow flex flex-col justify-center items-center gap-4 py-10">
        <div className="flex flex-col gap-2 max-w-[300px] w-full">
          <p className="text-center">Inicio sesión con tu cuenta</p>
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
          <Button
            type="primary"
            className="w-full"
            onClick={() => handleSetLogin()}
          >
            Iniciar sesión
          </Button>
          <Button
            type="primary"
            variant="outline"
            className="w-full"
            onClick={() => handleRegister()}
          >
            Registrarse
          </Button>
        </div>
        {import.meta.env.VITE_ENVIRONMENT === "development" && (
          <div className="flex flex-col gap-2 p-4 rounded-md border border-gray-200">
            <p className="text-center">Inicio Rapido</p>
            <div className="flex gap-4">
              <Button
                type="primary"
                variant="outline"
                onClick={() => handleSetClient()}
              >
                Comprador
              </Button>
              <Button
                type="primary"
                variant="outline"
                onClick={() => handleSetSeller()}
              >
                Venderor
              </Button>
              <Button
                type="primary"
                variant="outline"
                onClick={() => handleSetAdmin()}
              >
                Administrador
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
