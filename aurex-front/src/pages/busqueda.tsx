import { useState, useEffect } from "react";
import useMarketplacePosts from "../hooks/Store/useMarketplacePostsHook";

import Footer from "../components/Marketplace/Footer";
import Header from "../components/Marketplace/Headers/Header";
import ProductCard from "../components/Marketplace/ProductCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Inputs/Input";

interface SearchFilters {
  tipos: string;
  tiendasOficiales: string;
  categorias: string;
  cuotas: string;
  otros: string;
  costosEnvio: string;
  tiempoEntrega: string;
  envio: string;
  color: string;
  marca: string;
}

const tipos = [
  "Favoritos",
  "Exterior",
  "Interior",
  "Impermeable",
  "Diluyentes",
  "Pinceles",
  "Vinilos",
];

const filtersData = [
  { key: "tiendasOficiales", data: ["Solo tiendas oficiales (250)"] },
  {
    key: "categorias",
    data: [
      "Pinturería (180)",
      "Librería (23)",
      "Herramientas (3)",
      "Hogar, Muebles y Jardín (3)",
    ],
  },
  {
    key: "cuotas",
    data: ["Mismo precio en cuotas (53)", "Cuota promocionada (5)"],
  },
  { key: "otros", data: ["Es antihongos (67)", "Es lavable (57)"] },
  { key: "costosEnvio", data: ["Costo de envío", "Gratis (92)"] },
  { key: "tiempoEntrega", data: ["Tiempo de entrega", "Llegan hoy"] },
  { key: "envio", data: ["Envío", "Mercado Envíos"] },
  { key: "color", data: ["#000000", "#FF0000", "#FFFFFF", "#FFFF00"] },
  {
    key: "marca",
    data: ["Alba (200)", "Casablanca (2)", "Akzo Nobel (2)", "Premium (1)"],
  },
];

const filtersLabel = {
  tipos: "Tipos",
  tiendasOficiales: "Tiendas oficiales",
  categorias: "Categorías",
  cuotas: "Cuotas",
  otros: "Otras características",
  costosEnvio: "Costos de envío",
  tiempoEntrega: "Tiempo de entrega",
  envio: "Envío",
  color: "Color",
  marca: "Marca",
};


export default function Search() {
  const [filters, setFilters] = useState<Partial<SearchFilters>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  
  const marketplacePosts = useMarketplacePosts();

  useEffect(() => {
    // Cargar publicaciones al montar el componente
    marketplacePosts.getPosts();
  }, []);

  const handleSearch = () => {
    const searchFilters = {
      title: searchQuery || undefined,
      minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
    };
    
    marketplacePosts.getPostsWithFilters(searchFilters);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriceRange({ min: "", max: "" });
    marketplacePosts.clearFilters();
    marketplacePosts.getPosts();
  };

  return (
    <div className="flex flex-col min-h-screen h-full">
      <Header />

      {/* BANNER */}
      <div className="flex justify-center gap-4 p-6 bg-primary">
        {tipos.map((option: string) => (
          <Button
            type={filters.tipos === option ? "secondary" : "primary"}
            key={option}
            onClick={() => setFilters({ ...filters, tipos: option })}
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="flex justify-center p-8">
        <div className="flex flex-col gap-4 p-4 text-sm w-64">
          {/* Barra de búsqueda */}
          <div className="mb-4">
            <Input
              name="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="primary" onClick={handleSearch} className="w-full mt-2">
              Buscar
            </Button>
          </div>

          {/* Filtros de precio */}
          <div className="mb-4">
            <span className="text-gray-800 font-semibold block mb-2">Rango de Precio</span>
            <div className="flex gap-2">
              <Input
                name="minPrice"
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              />
              <Input
                name="maxPrice"
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              />
            </div>
          </div>

          {/* Filtros de categorías */}
          <div className="mb-4">
            <span className="text-gray-800 font-semibold block mb-2">Categorías</span>
            {filtersData.map((filter) => (
              <div className="flex flex-col mb-2" key={filter.key}>
                <span className="text-gray-600 font-medium text-xs">
                  {filtersLabel[filter.key as keyof typeof filtersLabel]}
                </span>
                {filter.data.map((option) => (
                  <span
                    key={option}
                    className="text-gray-600 text-xs cursor-pointer hover:text-blue-600"
                    onClick={() =>
                      setFilters({ ...filters, [filter.key]: option })
                    }
                  >
                    {option}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <Button type="primary" onClick={handleClearFilters} className="w-full">
            Limpiar Filtros
          </Button>
        </div>

        {/* Grid de productos */}
        <div className="flex-1 max-w-4xl">
          {marketplacePosts.loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando productos...</span>
            </div>
          ) : marketplacePosts.posts.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos disponibles</h3>
              <p className="text-gray-500">No se encontraron publicaciones en el marketplace</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplacePosts.posts.map((post) => (
                <ProductCard
                  key={post.id}
                  post={post}
                  title={post.title}
                  price={post.price}
                  image={post.product?.name || "Producto"}
                  discount={0}
                  description={post.content}
                  productInfo={{
                    sku: post.product?.sku,
                    category: post.product?.category1,
                    stock: post.product?.totalStock,
                    status: post.product?.status,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
