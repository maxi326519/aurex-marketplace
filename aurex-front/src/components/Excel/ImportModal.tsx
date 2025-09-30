import { useState } from "react";
import type { Product } from "../../interfaces/Product";

import DragAndDrop from "./DragAndDrop";
import ViewCSV from "./ViewCSV";

interface Props {
  onSubmit: (data: Product[]) => Promise<void>;
  onClose: () => void;
}

export default function ImportModal({ onSubmit, onClose }: Props) {
  const [file, setFile] = useState<File>();

  return (
    <div className="fixed z-50 top-0 left-0 flex justify-center items-center w-full h-full bg-[#0006]">
      <div className="flex p-3 rounded-[10px] bg-white">
        <header className="flex flex-col gap-4 min-w-[400px]">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Importar historial</h4>
            <button
              className="btn-close py-2 px-4 hover:bg-gray-100 rounded-full"
              onClick={onClose}
            >
              x
            </button>
          </div>
          {file ? (
            <ViewCSV
              file={file}
              remito={null}
              onSubmitRemittance={() => {}}
              onSubmit={(data) => onSubmit(data)}
              onBack={() => setFile(undefined)}
              onClose={onClose}
            />
          ) : (
            <DragAndDrop setFile={setFile} />
          )}
        </header>
      </div>
    </div>
  );
}
