import { ReactInput, Search } from "../../../interfaces/Types";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../hooks/Auth/useAuth";
import useCartStore from "../../../hooks/Store/useCarrito";

import Button from "../../ui/Button";
import SearchBar from "../../ui/Inputs/SearchBar";

import logoImg from "../../../assets/img/logos/logo-blue-transparent.png";

const HeaderSimple = () => {
  const navigate = useNavigate();
  const cart = useCartStore();
  const auth = useAuth();
  const [search, setSearch] = useState<Partial<Search>>({});

  function handleChange(e: ReactInput) {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });
  }

  function handleSubmit() {
    navigate("/busqueda");
  }


  return (
    <header className="text-white">
      {/* Top Header */}
      <div className="py-2 px-4 flex items-center justify-between bg-secondary">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logoImg} className="h-20" alt="logo" />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4">
          <SearchBar
            name="text"
            placeholder="¿Qué estás buscando?"
            value={search.text}
            onChange={handleChange}
            onSearch={handleSubmit}
          />
        </div>

        {/* Location and Auth */}
        <div className="flex items-center space-x-4">
          {/*           <Button
            type="primary"
            className="flex items-center text-sm"
            onClick={() => handleSetLocation()}
          >
            <LocationEdit />
            <div className="flex flex-col items-start">
              <span className="font-bold leading-[15px]">Ingresa</span>
              <span className="font-bold leading-[15px]">tu ubicación</span>
            </div>
          </Button> */}
          {auth.isAuthenticated ? (
            <Button
              type="primary"
              className="flex items-center text-sm"
              onClick={() => navigate("/panel/perfil")}
            >
              <User />
              <div className="flex flex-col items-start">
                <span className="font-bold leading-[15px]">Hola,</span>
                <span className="font-bold leading-[15px]">
                  {auth.user?.name.split(" ")[0] || "-"}
                </span>
              </div>
            </Button>
          ) : (
            <Button
              type="primary"
              className="flex items-center text-sm"
              onClick={() => navigate("/login")}
            >
              <User />
              <div className="flex flex-col items-start">
                <span className="font-bold leading-[15px]">Hola!</span>
                <span className="font-bold leading-[15px]">Inicia sesión</span>
              </div>
            </Button>
          )}
          <button
            type="button"
            className="relative px-10"
            onClick={() => navigate("/carrito")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="absolute -top-2 right-6 bg-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cart.items.length}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderSimple;
