import { useState } from "react";

import BrandCard from "../components/Marketplace/BrandCard";
import CategoryButton from "../components/Marketplace/CategroyButtor";
import Footer from "../components/Marketplace/Footer";
import Header from "../components/Marketplace/Header";
import HorizontalScroll from "../components/Marketplace/HorizontalScroll";
import Newsletter from "../components/Marketplace/Newsletter";
import ProductCard from "../components/Marketplace/ProductCard";
import Button from "../components/ui/Button";
import Title from "../components/Marketplace/Title";

import category1 from "../assets/img/payments/IMG-20250820-WA0002.jpg";
import category2 from "../assets/img/payments/IMG-20250820-WA0003.jpg";
import category3 from "../assets/img/payments/IMG-20250820-WA0004.jpg";
import category4 from "../assets/img/payments/IMG-20250820-WA0005.jpg";
import category5 from "../assets/img/payments/IMG-20250820-WA0006.jpg";
import category6 from "../assets/img/payments/IMG-20250820-WA0007.jpg";
import category7 from "../assets/img/payments/IMG-20250820-WA0008.jpg";
import category8 from "../assets/img/payments/IMG-20250820-WA0009.jpg";
import category9 from "../assets/img/payments/IMG-20250820-WA0010.jpg";

import news1 from "../assets/img/news/IMG-20250820-WA0011.jpg";
import news2 from "../assets/img/news/IMG-20250820-WA0012.jpg";
import news3 from "../assets/img/news/IMG-20250820-WA0013.jpg";
import news4 from "../assets/img/news/IMG-20250820-WA0014.jpg";

import img1 from "../assets/img/IMG-20250820-WA0015.jpg";
import img2 from "../assets/img/IMG-20250820-WA0016.jpg";
import img3 from "../assets/img/IMG-20250820-WA0017.jpg";

const categories = [
  { img: category1, name: "Baños" },
  { img: category2, name: "Pisos" },
  { img: category3, name: "Herramientas" },
  { img: category4, name: "Exterior" },
  { img: category5, name: "Construcción" },
  { img: category6, name: "Muebles" },
  { img: category7, name: "Electro" },
  { img: category8, name: "Aberturas" },
  { img: category9, name: "Dormitorio" },
];

const brands = [
  { name: "LG", logo: news1 },
  { name: "BOSCH", logo: news2 },
  { name: "MOTOROLA", logo: news3 },
  { name: "HP", logo: news4 },
];

const categoriesRecomended = [
  "CAFETERAS",
  "IMPRESORAS",
  "NOTEBOOKS",
  "FREIDORAS",
  "DORMITORIO",
  "DEPORTE",
  "SEGURIDAD",
];

const products = [
  { title: "Producto 1", price: 999.99, image: "P1", discount: 15 },
  { title: "Producto 2", price: 499.99, image: "P2" },
  { title: "Producto 3", price: 799.99, image: "P3", discount: 20 },
  { title: "Producto 4", price: 1299.99, image: "P4" },
  { title: "Producto 5", price: 299.99, image: "P5", discount: 10 },
];
const brandsRecomended = [
  "APPLE",
  "NIKE",
  "SAMSUNG",
  "HUAWEI",
  "ELECTROLUX",
  "STANLEY",
  "WHIRLPOOL",
];

function Home() {
  const [brandRecomended, setBrandRecomended] = useState<string>(
    brandsRecomended[0]
  );
  const [catRecomended, setCatRecomended] = useState<string>(
    categoriesRecomended[0]
  );

  function handleSelectCatRecomended(category: string) {
    setCatRecomended(category);
  }

  function handleSelectBrandRecomended(brand: string) {
    setBrandRecomended(brand);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* CARROUSELL */}
        <section className="flex flex-col bg-primary">
          <div className="bg-gray-200 h-64 md:h-96 flex items-center justify-center">
            <div className="flex items-center gap-2 p-14 rounded-full text-center text-white border-8 border-white">
              <h2 className="text-8xl font-bold mb-4">12</h2>
              <div className="flex flex-col items-start mb-2 font-bold">
                <h2 className="text-4xl">CUOTAS</h2>
                <h2 className="text-4xl">SIN INTERÉS</h2>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 p-10 w-full max-w-[1400px] m-auto">
            <div className="grow">
              <img className="w-full rounded-[20px]" src={img1} alt="img-1" />
            </div>
            <div className="grow">
              <img className="w-full rounded-[20px]" src={img2} alt="img-2" />
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="w-full max-w-[1200px] m-auto py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4">
              {categories.map((category, index) => (
                <CategoryButton
                  key={index}
                  name={category.name}
                  icon={category.img}
                />
              ))}
            </div>
          </div>
        </section>

        {/* NEWS */}
        <HorizontalScroll title="Novedades">
          {brands.map((brand, index) => (
            <BrandCard key={index} name={brand.name} logo={brand.logo} />
          ))}
        </HorizontalScroll>

        {/* Categorías recomendadas */}
        <section>
          <div className="w-full bg-primary">
            <div className="max-w-[1200px] w-full py-6 m-auto">
              <Title type="secondary" text="Categorías recomendadas" />
              <div className="flex gap-4 px-4 py-6">
                {categoriesRecomended.map((cat) => (
                  <Button
                    type="secondary"
                    variant={catRecomended === cat ? "solid" : "outline"}
                    className="w-full font-bold"
                    onClick={() => handleSelectCatRecomended(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="relative flex justify-between items-center max-w-[1200px] m-auto p-10">
              <button className="absolute top-1/2 left-0 p-2 w-10 h-10 rounded-full bg-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button className="absolute top-1/2 right-0 p-2 w-10 h-10 rounded-full bg-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              {products.slice(0, 4).map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* Marcas recomendadas */}
        <section className="my-8">
          <div className="w-full bg-primary">
            <div className="max-w-[1200px] w-full py-6 m-auto">
              <Title type="secondary" text="Marcas recomendadas" />
              <div className="flex gap-4 px-4 py-6">
                {brandsRecomended.map((cat) => (
                  <Button
                    type="secondary"
                    variant={brandRecomended === cat ? "solid" : "outline"}
                    className="w-full font-bold"
                    onClick={() => handleSelectBrandRecomended(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4">
            <div>
              <div className="relative flex justify-between items-center max-w-[1200px] m-auto p-10">
                <button className="absolute top-1/2 left-0 p-2 w-10 h-10 rounded-full bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button className="absolute top-1/2 right-0 p-2 w-10 h-10 rounded-full bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                {products.slice(0, 4).map((product, index) => (
                  <ProductCard key={index} {...product} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ¿Qué quieres hacer hoy? */}
        <section className="py-8 bg-gray-100">
          <div className="w-full bg-primary">
            <div className="max-w-[1200px] w-full py-6 m-auto">
              <Title type="secondary" text="¿Qué quieres hacer hoy?" />
              <div className="flex justify-center gap-6 p-10 w-full max-w-[1400px] m-auto">
                <button className="grow" onClick={() => {}}>
                  <img
                    className="w-full rounded-[20px]"
                    src={img1}
                    alt="img-1"
                  />
                </button>
                <button className="grow" onClick={() => {}}>
                  <img
                    className="w-full rounded-[20px]"
                    src={img2}
                    alt="img-2"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-6 px-6 py-10 max-w-[1200px] w-full h-full m-auto">
            <div className="flex flex-col items-center ga-2 p-6 max-w-[400px] max-h-[350px] w-full h-full border-4 border-primary text-primary rounded-[20px] shadow-sm bg-white">
              <img className="w-64" src={img3} alt="payments" />
              <span className="m-4 text-center text-sm font-light">
                Transferencia bancaria, Mercado Pago o echeq para compras
                mayoristas. En FULL PROMOS tambien tarjeta de crédito o débito
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 p-6 max-w-[400px] max-h-[350px] w-full h-full border-4 border-primary text-primary rounded-[20px] shadow-sm bg-white">
              <div className="flex items-center gap-2 text-center">
                <h2 className="text-8xl font-bold mb-4">6</h2>
                <div className="flex flex-col items-start mb-2 font-bold">
                  <h2 className="text-3xl">CUOTAS</h2>
                  <h2 className="text-3xl">SIN INTERÉS</h2>
                </div>
              </div>
              <span className="text-xl">TODOS LOS DÍAS</span>
              <span className="text-xl">PAGANDO CON</span>
              <Button className="mt-1" type="secondary" onClick={() => {}}>
                Tarjeta de Crédito
              </Button>
              <Button
                className="mt-6 border-transparent hover:border-primary"
                type="primary"
                variant="outline"
                onClick={() => {}}
              >
                Ver productos
              </Button>
            </div>

            <div className="flex flex-col items-center gap-2 p-6 max-w-[400px] max-h-[350px] w-full h-full border-4 border-primary text-primary rounded-[20px] shadow-sm bg-white">
              <div className="flex items-center gap-2 text-center">
                <h2 className="text-8xl font-bold mb-4">12</h2>
                <div className="flex flex-col items-start mb-2 font-bold">
                  <h2 className="text-3xl">CUOTAS</h2>
                  <h2 className="text-3xl">SIN INTERÉS</h2>
                </div>
              </div>
              <span className="text-xl">TODOS LOS DÍAS</span>
              <span className="text-xl">PAGANDO CON</span>
              <Button className="mt-1" type="secondary" onClick={() => {}}>
                Tarjeta de Crédito
              </Button>
              <Button
                className="mt-6 border-transparent hover:border-primary"
                type="primary"
                variant="outline"
                onClick={() => {}}
              >
                Ver productos
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
