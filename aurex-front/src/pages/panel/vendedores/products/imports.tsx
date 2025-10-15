import { Download, FileSpreadsheet } from "lucide-react";
import { ReceptionStatus } from "../../../../interfaces/Receptions";
import { useState } from "react";
import useReceptions from "../../../../hooks/Dashboard/receptions/useReceptions";

import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import DragAndDrop from "../../../../components/Excel/DragAndDrop";
import ViewCSV from "../../../../components/Excel/ViewCSV";
import Button from "../../../../components/ui/Button";
import Modal from "../../../../components/Modal";

export default function SellersImportsPage() {
  const receptions = useReceptions();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [productsFile, setProductsFile] = useState<File>();
  const [remittanceFile, setRemittanceFile] = useState<File | null>(null);

  async function handleSubmit() {
    if (productsFile && remittanceFile) {
      await receptions.pendings.create(
        {
          date: new Date(),
          state: ReceptionStatus.PENDING,
          sheetFile: "",
          remittance: "",
        },
        productsFile,
        remittanceFile
      );
    }
  }

  function downloadExcel() {
    // ruta relativa al directorio public/
    const fileUrl = `/modelo-excel.xlsx`;

    // crear link temporal
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl;

    // forzar clic y eliminar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleSetRemittance(file: File) {
    setRemittanceFile(file);
    setOpenModal(false);
  }

  return (
    <DashboardLayout title="Productos / Importación" requireActiveUser={true}>
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
            className={`flex-1 grow flex flex-col justify-center items-center p-2 rounded-sm border border-primary text-primary ${
              remittanceFile ? "text-white bg-primary" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              <b className="flex justify-center items-center w-4 h-4 rounded-full text-xs text-primary bg-white">
                2
              </b>{" "}
              Subir Remito
            </span>
            <span className="text-gray-400 text-xs">
              {remittanceFile ? remittanceFile.name : ""}
            </span>
          </div>
          <div
            className={`flex-1 grow flex flex-col justify-center items-center p-2 rounded-sm border border-primary text-primary`}
          >
            <span className="flex items-center gap-2">
              <b className="flex justify-center items-center w-4 h-4 rounded-full text-xs text-primary bg-white">
                3
              </b>{" "}
              Confirmar datos
            </span>
          </div>
        </div>
      )}
      {productsFile ? (
        <div>
          {openModal && (
            <Modal title="Subir Remito" onClose={() => setOpenModal(false)}>
              <DragAndDrop
                setFile={handleSetRemittance}
                allowedTypes={["pdf"]}
              />
            </Modal>
          )}
          <ViewCSV
            file={productsFile}
            remito={remittanceFile}
            onSubmitRemittance={() => setOpenModal(true)}
            onSubmit={() => handleSubmit()}
            onBack={() => {
              setRemittanceFile(null);
              setProductsFile(undefined);
            }}
            onClose={() => {}}
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
