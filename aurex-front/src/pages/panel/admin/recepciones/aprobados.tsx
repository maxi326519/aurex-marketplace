import { CheckCheck, Download, RefreshCw, Store } from "lucide-react";
import { Product, ProductStatus } from "../../../../interfaces/Product";
import { useEffect, useState } from "react";
import { Reception } from "../../../../interfaces/Receptions";
import { User } from "../../../../interfaces/Users";
import * as XLSX from "xlsx";
import useReceptions from "../../../../hooks/Dashboard/receptions/useReceptions";
import useProducts from "../../../../hooks/Dashboard/products/useProduct";
import useUsers from "../../../../hooks/Dashboard/users/useUsers";

import DashboardLayout from "../../../../components/Dashboard/AdminDashboard";
import Table from "../../../../components/Dashboard/Table/Table";
import Button from "../../../../components/ui/Button";
import Modal from "../../../../components/Modal";
import DragAndDrop from "../../../../components/Excel/DragAndDrop";

export default function ReceptionsApproved() {
  const users = useUsers();
  const products = useProducts();
  const { approved } = useReceptions();
  const [openModal, setOpenModal] = useState<Reception | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [comparedApproved, setComparedApproved] = useState<boolean>(false);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [progress, setProgress] = useState<number>(0);

    /* TODO: Agregar opcion para pdoer realizr ingresos parciales */

  useEffect(() => {
    if (approved.data.length === 0) handleGetData();
  }, []);

  const handleGetData = () => {
    approved.get();
  };

  const handleGetUser = (reception: Reception): User | undefined => {
    return users.data.find((user) => user.id === reception.UserId);
  };

  const handleOpenModal = (reception: Reception) => {
    setOpenModal(reception);
  };

  const handleViewExcel = (data: Reception) => {
    window.open(`${import.meta.env.VITE_API_URL}/${data.sheetFile}`);
  };

  const handleClose = () => {
    setOpenModal(null);
    setErrors([]);
    setComparedApproved(false);
    setProgress(0);
  };

  const handleCompare = async (file: File | null) => {
    if (openModal && file) {
      try {
        // 1) Obtener ambos excels
        const vendorRows = await readExcel(
          `${import.meta.env.VITE_API_URL}/${openModal.sheetFile}`
        ); // URL del vendedor
        const adminRows = await readExcel(file); // File admin

        // 2) Agrupar productos
        const vendorProducts: Product[] = groupProducts(vendorRows);
        const adminProducts: Product[] = groupProducts(adminRows);

        // 3) Comparar
        const result = compareProducts(vendorProducts, adminProducts);

        // 4) Mostrar resultado
        if (result.length > 0) setErrors(result);
        else setNewProducts(vendorProducts);
      } catch (err) {
        console.log(err);
        console.error("Error comparando excels:", err);
      }
    }
  };

  const handleSubmit = (reception: Reception) => {
    newProducts.map((product, index) => {
      products.create(product);
      setProgress((index / 100) * newProducts.length);
      approved.complete(reception);
    });
  };

  /**
   * Lee un Excel y devuelve todas las filas como objetos.
   * Sirve tanto para File (admin) como para URL (vendedor).
   */
  const readExcel = async (input: File | string): Promise<any[]> => {
    let data: ArrayBuffer;

    if (typeof input === "string") {
      // Caso URL (Excel del vendedor)
      const res = await fetch(input);
      if (!res.ok)
        throw new Error("No se pudo descargar el archivo desde la URL");
      data = await res.arrayBuffer();
    } else {
      // Caso File (Excel subido por admin)
      data = await input.arrayBuffer();
    }

    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
  };

  /**
   * Agrupa productos por EAN y SKU, sumando cantidades
   */
  const groupProducts = (rows: any[]): Product[] => {
    const products: Product[] = [];

    rows.forEach((row) => {
      // Create product by row
      const product: Product = {
        ean: String(row["EAN"] || 0),
        sku: String(row["SKU"] || 0),
        name: String(row["Producto"]),
        price: Number(row["Valor declarado"]),
        volumeType: String(row["Tipo de volumen"]) as Product["volumeType"],
        weight: 0,
        category1: String(row["Categoria 1"]),
        category2: String(row["Categoria 2"]),
        totalStock: Number(row["Cantidad"] || row["Cantidad"] || 0),
        status: ProductStatus.PUBLISHED,
      };
      const deposito = String(row["Deposito"]);

      // Check all values
      if (
        !product.ean &&
        !product.sku &&
        !product.name &&
        !product.price &&
        !product.volumeType &&
        !product.category1 &&
        !product.category2 &&
        !product.totalStock &&
        !deposito
      )
        return; // fila inválida

      // Create or add amount
      const productFinded = products.find((p) => p.ean === product.ean);
      if (productFinded) {
        productFinded.totalStock += product.totalStock;
      } else {
        products.push(product);
      }
    });

    return products;
  };

  /**
   * Compara los productos del vendedor y del admin
   */
  const compareProducts = (vendor: Product[], admin: Product[]): string[] => {
    const errors: string[] = [];

    // Revisar productos del vendedor contra admin
    for (const key in vendor) {
      if (!admin[key]) {
        errors.push(
          `❌ Producto ${key} está en el Excel del vendedor pero no en el del administrador`
        );
      } else if (vendor[key].totalStock !== admin[key].totalStock) {
        errors.push(
          `⚠️ Producto ${key} tiene cantidades diferentes (Vendedor: ${vendor[key].totalStock}, Admin: ${admin[key].totalStock})`
        );
      }
    }

    // Revisar productos del admin contra vendedor
    for (const key in admin) {
      if (!vendor[key]) {
        errors.push(
          `❌ Producto ${vendor[key]} está en el Excel del administrador pero no en el del vendedor`
        );
      }
    }

    if (!errors.length) {
      setComparedApproved(true);
    }

    return errors;
  };

  return (
    <DashboardLayout title="Recepciones / Aprobados">
      <div className="flex flex-col gap-3">
        {openModal && !comparedApproved && (
          <Modal title="Subir Remito" onClose={handleClose}>
            {errors.length > 0 ? (
              <div>
                {errors.map((error) => (
                  <p>{error}</p>
                ))}
              </div>
            ) : (
              <DragAndDrop
                setFile={handleCompare}
                allowedTypes={["xls", "xlsx"]}
              />
            )}
          </Modal>
        )}
        {progress === 0 && comparedApproved && (
          <Modal title="" onClose={handleClose}>
            <div className="flex flex-col gap-4 justify-center items-center">
              <CheckCheck size={30} color="green" />
              <span className="w-48 text-center">
                Todos los productos coinciden perfectamente
              </span>
              <Button type="primary" onClick={() => handleSubmit(openModal!)}>
                Completar
              </Button>
            </div>
          </Modal>
        )}
        {progress > 0 && (
          <Modal title="" onClose={handleClose}>
            <div className="flex flex-col gap-4 justify-center items-center">
              <CheckCheck size={30} color="green" />
              <span className="w-48 text-center">% {progress.toFixed(2)}</span>
            </div>
          </Modal>
        )}
        <div className="flex justify-end">
          <Button type="primary" onClick={handleGetData}>
            <RefreshCw size={20} />
          </Button>
        </div>
        <Table
          columns={tableColumns(
            handleGetUser,
            handleViewExcel,
            handleOpenModal
          )}
          data={approved.data}
        />
      </div>
    </DashboardLayout>
  );
}

const tableColumns = (
  handleGetUser: (row: Reception) => User | undefined,
  handleViewExcel: (data: Reception) => void,
  handleCompare: (row: Reception) => void
) => {
  return [
    {
      header: "Vendedor",
      key: "",
      render: (row: Reception) => {
        const user = handleGetUser(row);

        return (
          <div className="flex items-center gap-4">
            <div className="flex justify-center items-center w-14 h-14 rounded-full border border-[#888] overflow-hidden">
              {user ? (
                <img className="w-full h-full object-cover" src={user.photo} />
              ) : (
                <Store strokeWidth={1} size={25} color="#888" />
              )}
            </div>
            <span>{user?.name || ""}</span>
          </div>
        );
      },
    },
    {
      header: "Fecha",
      key: "date",
      render: (row: Reception) =>
        new Date(row.date).toLocaleString("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
    },
    {
      header: "Tipo",
      key: "type",
    },
    {
      header: "Acciones",
      key: "",
      render: (row: Reception) => (
        <div className="flex gap-2 w-min">
          <Button
            type="primary"
            variant="outline"
            onClick={() => handleViewExcel(row)}
          >
            <Download size={18} /> Excel
          </Button>
          <Button type="primary" onClick={() => handleCompare(row)}>
            Comparar
          </Button>
        </div>
      ),
    },
  ];
};
