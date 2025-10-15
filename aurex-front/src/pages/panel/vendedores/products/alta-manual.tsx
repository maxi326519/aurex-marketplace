import { initPost, Post } from "../../../../interfaces/Posts";
import { useState } from "react";
import {
  initProduct,
  initStock,
  Product,
  Stock,
} from "../../../../interfaces/Product";
import useProducts from "../../../../hooks/Dashboard/products/useProduct";
import useStock from "../../../../hooks/Dashboard/stock/useStock";

import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import Separator from "../../../../components/Separator";
import Input from "../../../../components/ui/Inputs/Input";
import Checkbox from "../../../../components/Dashboard/Inputs/Checkbox";
import TextAreaInput from "../../../../components/Dashboard/Inputs/TextareaInput";
import Button from "../../../../components/ui/Button";

type ReactInputEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

export default function SellersNewProductsPage() {
  const products = useProducts();
  const stocks = useStock();
  const [product, setProduct] = useState<Product>(initProduct());
  const [stock, setStock] = useState<Stock>(initStock());
  const [post, setPost] = useState<Post>(initPost());

  function handleChangeProduct(event: ReactInputEvent) {
    const { name, value } = event.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  }

  function handleChangeStock(event: ReactInputEvent) {
    const { name, value } = event.target;
    setStock((prev) => ({ ...prev, [name]: value }));
  }

  function handleChangePost(event: ReactInputEvent) {
    const { name, value } = event.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log(product);
    console.log(stock);
    console.log(post);
    const newProduct = await products.create(product);

    console.log("Producto creado", newProduct);
    console.log("Producto creado", newProduct);

    await stocks.create({ ...stock, ProductId: newProduct.id });
  }

  return (
    <DashboardLayout title="Productos / Alta Manual" requireActiveUser={true}>
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
            type="text"
            value={product.volumeType}
            onChange={handleChangeProduct}
          />
        </div>

        <Separator />
        <h2 className="p-2 uppercase text-gray-800 font-semibold">
          Inventario
        </h2>
        <div className="grid grid-cols-2 gap-3 px-4">
          <Input
            name="amount"
            label="Stock total"
            type="number"
            value={stock.amount}
            onChange={handleChangeStock}
          />
          <Input
            name="enabled"
            label="Stock para publicar"
            type="number"
            value={stock.enabled}
            onChange={handleChangeStock}
          />
          <div className="flex gap-10 p-2">
            <Checkbox
              name="isFull"
              label="Almacenes de Aurex"
              value={stock.isFull}
              onCheck={() => setStock((prev) => ({ ...prev, isFull: true }))}
            />
            <Checkbox
              name="isFull"
              label="Almacenes propios"
              value={!stock.isFull}
              onCheck={() => setStock((prev) => ({ ...prev, isFull: false }))}
            />
          </div>
        </div>

        <Separator />
        <h2 className="p-2 uppercase text-gray-800 font-semibold">
          Publicación
        </h2>
        <div className="flex flex-col gap-3 px-4">
          <TextAreaInput
            name="content"
            label="Contenido"
            value={post.content}
            onChange={handleChangePost}
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
