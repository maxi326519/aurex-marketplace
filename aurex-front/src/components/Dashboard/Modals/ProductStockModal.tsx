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
                header: "Total",
                key: "quantity",
                render: (row: Stock) => <span>{row.amount}</span>,
              },
              {
                header: "Publicado",
                key: "enabled",
                render: (row: Stock) => <span>{row.enabled}</span>,
              },
              {
                header: "Ubicación",
                key: "location",
                render: (row: Stock) => (
                  <span>
                    {row.storage?.rag}/{row.storage?.site}
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
