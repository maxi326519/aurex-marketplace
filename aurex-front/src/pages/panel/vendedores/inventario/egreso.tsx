import { Download, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  MovementOrderStatus,
  MovementOrderType,
} from "../../../../interfaces/MovementOrders";
import useMovementOrders from "../../../../hooks/Dashboard/movementOrders/useMovementOrders";

import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import DragAndDrop from "../../../../components/Excel/DragAndDrop";
import ViewCSV from "../../../../components/Excel/ViewCSV";
import Button from "../../../../components/ui/Button";

export default function SellersEgressPage() {
  const navigate = useNavigate();
  const movementOrders = useMovementOrders();
  const [productsFile, setProductsFile] = useState<File>();

  async function handleSubmit() {
    if (productsFile) {
      // Para egresos solo se requiere el Excel, no el remito
      await movementOrders.pendings.create(
        {
          date: new Date(),
          type: MovementOrderType.SALIDA,
          state: MovementOrderStatus.PENDING,
          sheetFile: "",
          remittance: "",
        },
        productsFile,
        null // No se requiere remito para egresos
      );
      // Reset form and navigate back
      setProductsFile(undefined);
      navigate("/panel/vendedor/productos/ordenes");
    }
  }

  function downloadExcel() {
    const fileUrl = `/modelo-excel.xlsx`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const breadcrumb = [
    { label: "Inventario" },
    { label: "Solicitudes", path: "/panel/vendedor/inventario/solicitudes" },
    { label: "Nuevo Egreso" },
  ];

  return (
    <DashboardLayout
      title="Nuevo Egreso"
      breadcrumb={breadcrumb}
      requireActiveUser={true}
    >
      {productsFile && (
        <div className="flex gap-4 pb-4 border-b border-gray-300">
          <div
            className={`flex-1 grow flex flex-col justify-center items-center p-2 rounded-sm border border-primary text-primary ${
              productsFile ? "text-white bg-primary" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              <b className="flex justify-center items-center w-4 h-4 rounded-full text-xs text-primary bg-white">
                1
              </b>{" "}
              Subir Excel
            </span>
            <span className="text-gray-400 text-xs">
              {productsFile ? productsFile.name : ""}
            </span>
          </div>
          <div
            className={`flex-1 grow flex flex-col justify-center items-center p-2 rounded-sm border border-primary text-primary`}
          >
            <span className="flex items-center gap-2">
              <b className="flex justify-center items-center w-4 h-4 rounded-full text-xs text-primary bg-white">
                2
              </b>{" "}
              Confirmar datos
            </span>
          </div>
        </div>
      )}
      {productsFile ? (
        <div>
          <ViewCSV
            file={productsFile}
            remito={null}
            onSubmitRemittance={() => {}}
            onSubmit={() => handleSubmit()}
            onBack={() => {
              setProductsFile(undefined);
            }}
            onClose={() => navigate("/panel/vendedor/productos/ordenes")}
            requireRemittance={false}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full h-full rounded-md">
          <Button type="primary" onClick={downloadExcel}>
            <FileSpreadsheet />
            <span>Descargar modelo</span>
            <Download />
          </Button>
          <div className="bg-white">
            <DragAndDrop setFile={setProductsFile} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
