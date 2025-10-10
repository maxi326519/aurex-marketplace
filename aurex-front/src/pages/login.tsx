import { LoginData, User, UserRol } from "../interfaces/Users";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/Auth/useAuth";
import Swal from "sweetalert2";

import HeaderSimple from "../components/Marketplace/Headers/HeaderSimple";
import SesionForm from "../components/Marketplace/SesionForm";
import Footer from "../components/Marketplace/Footer";
import Button from "../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [errors, setError] = useState<Record<string, string>>({});
  const [loading, setloading] = useState<boolean>(false);

  function handleLogin(data: LoginData, cb: (user: User | undefined) => void) {
    if (handleValidations(data)) {
      setloading(true);
      auth
        .login(data)
        .then(cb)
        .catch((error) => {
          if (error.message === "User not found") {
            setError({ email: "Usuario no encontrado" });
          } else if (error.message === "Incorrect password") {
            setError({ password: "Contraseña incorrecta" });
          } else {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo iniciar sesión",
            });
          }
        })
        .finally(() => {
          setloading(false);
        });
    }
  }

  function handleValidations(data: LoginData): boolean {
    const error: Record<string, string> = {};
    const emailValid = /\S+@\S+\.\S+/.test(data.email);

    if (data.email === "") error.email = "El correo es requerido";
    if (!emailValid) error.email = "El formato del correo no es válido";
    if (data.password === "") error.password = "La contraseña es requerida";

    setError(error);
    return Object.keys(error).length === 0;
  }

  function handleSetLogin(email: string, password: string) {
    handleLogin({ email, password }, (user: User | undefined) => {
      console.log("Redirect");
      if (user?.rol === UserRol.CLIENT) navigate("/");
      if (user?.rol === UserRol.SELLER) navigate("/panel/vendedor/analiticas");
      if (user?.rol === UserRol.ADMIN) navigate("/panel/admin/analiticas");
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderSimple />
      <SesionForm
        type="login"
        mailError={errors.email}
        passwordError={errors.password}
        loading={loading}
        clearErrors={() => setError({})}
        onSubmit={handleSetLogin}
      />

      {import.meta.env.VITE_ENVIRONMENT === "development" && (
        <div className="flex flex-col items-center justify-center gap-4 p-10 bg-secondary">
          <p className="text-2xl text-center font-bold text-primary">
            INICIO RÁPIDO
          </p>
          <div className="flex gap-4">
            <Button
              type="primary"
              onClick={() =>
                handleLogin(
                  {
                    email: import.meta.env.VITE_ADMIN_USER,
                    password: import.meta.env.VITE_ADMIN_PASS,
                  },
                  () => navigate("/")
                )
              }
            >
              Comprador
            </Button>
            <Button
              type="primary"
              onClick={() =>
                handleLogin(
                  {
                    email: import.meta.env.VITE_SELLER_USER,
                    password: import.meta.env.VITE_SELLER_PASS,
                  },
                  () => navigate("/panel/vendedor/analiticas")
                )
              }
            >
              Venderor
            </Button>
            <Button
              type="primary"
              onClick={() =>
                handleLogin(
                  {
                    email: import.meta.env.VITE_CLIENT_USER,
                    password: import.meta.env.VITE_CLIENT_PASS,
                  },
                  () => navigate("/panel/admin/analiticas")
                )
              }
            >
              Administrador
            </Button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
