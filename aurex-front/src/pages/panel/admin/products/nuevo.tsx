import { initProduct, Product } from "../../../../interfaces/Product";
import { useState } from "react";
import useProducts from "../../../../hooks/Dashboard/products/useProduct";

import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import Separator from "../../../../components/Separator";
import Input from "../../../../components/ui/Inputs/Input";
import Button from "../../../../components/ui/Button";

type ReactInputEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

export default function SellersNewProductsPage() {
  const products = useProducts();
  const [product, setProduct] = useState<Product>(initProduct());

  function handleChangeProduct(event: ReactInputEvent) {
    const { name, value } = event.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    console.log(product);

    const newProduct = await products.create(product);

    console.log("Producto creado", newProduct);
  }

  return (
    <DashboardLayout title="Productos / Nuevo">
      <form className="bg-white p-2 pt-4 pb-6" onSubmit={handleSubmit}>
        <h2 className="p-2 uppercase text-gray-800 font-semibold">Producto</h2>
        <div className="grid grid-cols-2 gap-2 px-4">
          <Input
            name="ean"
            label="EAN"
            type="number"
            value={product.ean}
            onChange={handleChangeProduct}
          />
          <Input
            name="sku"
            label="SKU"
            value={product.sku}
            onChange={handleChangeProduct}
          />
          <Input
            name="name"
            label="Nombre"
            value={product.name}
            onChange={handleChangeProduct}
          />
          <Input
            name="price"
            label="Valor declarado"
            type="number"
            value={product.price}
            onChange={handleChangeProduct}
          />
          <Input
            name="volumeType"
            label="Tipo volumen"
            type="number"
            value={product.volumeType}
            onChange={handleChangeProduct}
          />
        </div>

        <Separator />
        <div className="flex justify-end px-2">
          <Button type="primary" submit>
            Solicitar Alta
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
