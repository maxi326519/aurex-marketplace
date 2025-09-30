import { useState } from "react";
import { Product } from "../../../../interfaces/Product";

import DashboardLayout from "../../../../components/Dashboard/AdminDashboard";
import DragAndDrop from "../../../../components/Excel/DragAndDrop";
import ViewCSV from "../../../../components/Excel/ViewCSV";
import useProducts from "../../../../hooks/Dashboard/products/useProduct";

export default function ProductsImportsPage() {
  const products = useProducts();
  const [file, setFile] = useState<File>();

  async function handleSubmit(data: Product[]) {
    for (const product of data) {
      await products.create(product);
    }
  }

  function handleClose() {
    // setProducts([]);
  }

  return (
    <DashboardLayout title="Productos / Importación">
      <div className="flex flex-col gap-4 w-full h-full rounded-md bg-white">
        {file ? (
          <ViewCSV
            file={file}
            remito={null}
            onSubmitRemittance={() => {}}
            onSubmit={(data) => handleSubmit(data)}
            onBack={() => setFile(undefined)}
            onClose={handleClose}
          />
        ) : (
          <DragAndDrop setFile={setFile} />
        )}
      </div>
    </DashboardLayout>
  );
}
