import { LoginData, UserRol } from "../interfaces/Users";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/Auth/useAuth";

import SesionForm from "../components/Marketplace/SesionForm";
import Footer from "../components/Marketplace/Footer";
import Swal from "sweetalert2";
import HeaderSimple from "../components/Marketplace/Headers/HeaderSimple";

export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [errors, setError] = useState<Record<string, string>>({});
  const [loading, setloading] = useState<boolean>(false);

  function handleRegister(email: string, password: string, role: UserRol) {
    if (handleValidations({ email, password })) {
      setloading(true);
      auth
        .register(email, password, role)
        .then((user) => {
          if (user?.rol === UserRol.CLIENT) navigate("/registro/comprador");
          if (user?.rol === UserRol.SELLER) navigate("/registro/vendedor");
        })
        .catch((error) => {
          if (error.message === "email already exists") {
            setError({ email: "El correo ya existe" });
          } else {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo registrar",
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
    if (data.password.length < 6)
      error.password = "La contraseña debe tener al menos 6 caracteres";

    setError(error);
    return Object.keys(error).length === 0;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderSimple />
      <SesionForm
        type="register"
        mailError={errors.email}
        passwordError={errors.password}
        loading={loading}
        clearErrors={() => setError({})}
        onSubmit={handleRegister}
      />
      <Footer />
    </div>
  );
}
