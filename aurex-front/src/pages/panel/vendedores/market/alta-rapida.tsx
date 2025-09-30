import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import { useState } from "react";

interface InputProps {
  name: string;
  value: string | number | undefined;
  label: string;
  type?: string;
  formulated?: boolean;
  error?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface Post {
  id: string;
  date: Date;
  title: string;
  content: string;
  price: number;
  clicks: string;
}

export default function SellersNewPostPage() {
  const [formData, setFormData] = useState<Post>({
    id: "",
    date: new Date(),
    title: "",
    content: "",
    price: 0,
    clicks: "0",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Post creado:", formData);
    // Aquí puedes llamar a la función para guardar el post
  };

  return (
    <DashboardLayout title="Mi Tienda / Alta Rápida">
      <form className="bg-white p-2 pt-4 pb-6" onSubmit={handleSubmit}>
        <h2 className="p-2 uppercase text-gray-800 font-semibold">Producto</h2>
        <div className="flex flex-col gap-2 px-4">
          <Input
            name="title"
            value={formData.title}
            label="Título"
            onChange={handleChange}
          />
          <Input
            name="content"
            value={formData.content}
            label="Contenido"
            onChange={handleChange}
          />
          <Input
            name="price"
            value={formData.price}
            label="Precio"
            type="number"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Crear Post
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}

function Input({ name, value, label, type = "text", onChange }: InputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        className="border border-gray-300 rounded px-3 py-2"
      />
    </div>
  );
}
