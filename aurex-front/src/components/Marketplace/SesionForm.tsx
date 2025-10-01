import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserRol } from "../../interfaces/Users";

import Button from "../ui/Button";

import logoImg from "../../assets/img/logos/isotipo-white.png";

interface Props {
  type: "login" | "register";
  mailError?: string;
  passwordError?: string;
  loading?: boolean;
  clearErrors?: () => void;
  onSubmit: (email: string, password: string, role: UserRol) => void;
}

export default function SesionForm({
  type = "login",
  mailError,
  passwordError,
  loading = false,
  clearErrors,
  onSubmit,
}: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<UserRol>(UserRol.ANY);

  return (
    <div className="py-10 bg-primary">
      <div className="grow flex flex-col justify-center items-center md:items-end gap-4 max-w-[1000px] m-auto py-[80px] px-6">
        {type === "register" && (
          <div className="relative z-30 flex flex-col items-center text-white">
            <span className="text-5xl md:text-7xl font-bold">TENEMOS TODO</span>
            <span className="text-5xl md:text-7xl font-bold">
              LO QUE NECESITAS.
            </span>
            <span className="text-lg md:text-xl text-center max-w-[400px] md:max-w-full font-light">
              AUREX el{" "}
              <b className="font-extrabold text-secondary">Marketplace</b> donde
              encontrar lo que buscás es tan fácil como disfrutarlo.
            </span>
          </div>
        )}

        {type === "register" && (
          <div className="relative z-30 hidden md:flex gap-4">
            <div className="flex justify-center items-center gap-2 py-2 px-6 max-w-[400px] min-w-[360px] max-h-[350px] w-full h-full border-4 text-center border-white text-white rounded-[20px] shadow-sm bg-primary">
              <h2 className="text-8xl font-bold mb-4">6</h2>
              <div className="flex flex-col items-start mb-2 font-bold">
                <h2 className="text-3xl">CUOTAS</h2>
                <h2 className="text-3xl">SIN INTERÉS</h2>
              </div>
            </div>
            <div className="flex justify-center items-center gap-2 py-2 px-6 max-w-[400px] min-w-[360px] max-h-[350px] w-full h-full border-4 text-center border-white text-white rounded-[20px] shadow-sm bg-primary">
              <h2 className="text-8xl font-bold mb-4">12</h2>
              <div className="flex flex-col items-start mb-2 font-bold">
                <h2 className="text-3xl">CUOTAS</h2>
                <h2 className="text-3xl">SIN INTERÉS</h2>
              </div>
            </div>
          </div>
        )}

        {type === "login" && (
          <div className="m-auto text-center">
            <span className="text-5xl md:text-7xl font-bold text-white">
              ¡Bienvenido de nuevo!
            </span>
            <h2 className="text-3xl font-bold mb-4 text-white text-opacity-80">
              Inicia sesión con tu cuenta
            </h2>
          </div>
        )}

        <div className="flex flex-col-reverse md:flex-row items-center justify-center w-full">
          <div className="hidden md:flex items-end w-[300px] h-[200px] md:mt-[100px]">
            <img className="w-full" src={logoImg} alt="isotipo" />
          </div>

          <div className="flex flex-col gap-2 w-full max-w-[600px]">
            <div className="mb-2">
              <label
                htmlFor="email"
                className="block ms-4 text-base font-medium text-white"
              >
                Correo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (clearErrors) clearErrors();
                }}
                disabled={loading}
                className={`mt-1 block w-full px-4 py-3 bg-white border rounded-3xl text-base placeholder-slate-400
              focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary ${
                mailError ? "border-red-500" : "border-slate-300"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="Ingresa tu correo"
              />
              {mailError && (
                <small className="ms-4 text-red-500">{mailError}</small>
              )}
            </div>
            <div className="mb-2">
              <label
                htmlFor="password"
                className="block ms-4 text-base font-medium text-white"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (clearErrors) clearErrors();
                }}
                disabled={loading}
                className={`mt-1 block w-full px-4 py-3 bg-white border rounded-3xl border-slate-300 text-base placeholder-slate-400
              focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary ${
                mailError ? "border-red-500" : "border-slate-300"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="Ingresa tu contraseña"
              />
              {passwordError && (
                <small className="ms-4 text-red-500">{passwordError}</small>
              )}
            </div>

            {(type === "login" && (
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <Button
                  type="secondary"
                  className="flex-1 py-3 font-semibold rounded-3xl bg-white bg-opacity-80 border-0"
                  loading={loading}
                  onClick={() => onSubmit(email, password, UserRol.ANY)}
                >
                  Iniciar sesión
                </Button>
                <Button
                  type="primary"
                  className="flex-1 py-3 rounded-3xl border-white"
                  disabled={loading}
                  onClick={() => navigate("/registrarse")}
                >
                  Registrarse
                </Button>
              </div>
            )) ||
              (type === "register" && (
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <Button
                    type="secondary"
                    className="flex-1 py-3 font-semibold rounded-3xl bg-white bg-opacity-80 border-0"
                    loading={role === UserRol.CLIENT ? loading : false}
                    disabled={loading}
                    onClick={() => {
                      onSubmit(email, password, UserRol.CLIENT);
                      setRole(UserRol.CLIENT);
                    }}
                  >
                    Como cliente
                  </Button>
                  <Button
                    type="secondary"
                    className="flex-1 py-3 font-semibold rounded-3xl bg-white bg-opacity-80 border-0"
                    loading={role === UserRol.SELLER ? loading : false}
                    disabled={loading}
                    onClick={() => {
                      onSubmit(email, password, UserRol.SELLER);
                      setRole(UserRol.SELLER);
                    }}
                  >
                    Como vendedor
                  </Button>
                  <Button
                    type="primary"
                    variant="solid"
                    className="flex-1 py-3 rounded-3xl border-white"
                    disabled={loading}
                    onClick={() => navigate("/login")}
                  >
                    Iniciar sesión
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
