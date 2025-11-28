import { Stock } from "../../../interfaces/Product";
import Modal from "../../Modal";
import Table from "../Table/Table";

interface Props {
  stocks: Stock[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductStockModal({ stocks, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <Modal title="Stock" onClose={onClose}>
      <div className="p-6">
        {stocks.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">
              No hay stock registrado para este producto
            </div>
          </div>
        ) : (
          <Table
            data={stocks}
            columns={[
              {
                header: "Unidades",
                key: "amount",
                render: (row: Stock) => (
                  <span className="font-medium text-gray-900">
                    {row.amount || 0}
                  </span>
                ),
              },
              {
                header: "Ubicación",
                key: "location",
                render: (row: Stock) => (
                  <span className="text-gray-700">
                    {row.storage?.rag && row.storage?.site
                      ? `${row.storage.rag}/${row.storage.site}`
                      : "-"}
                  </span>
                ),
              },
            ]}
          />
        )}
      </div>
    </Modal>
  );
}
