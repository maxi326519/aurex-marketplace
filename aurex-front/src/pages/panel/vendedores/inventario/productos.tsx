import { RefreshCcw, Plus, History } from "lucide-react";
import { ProductStatus, Product } from "../../../../interfaces/Product";
import { useEffect, useState } from "react";
import { FilterConfig } from "../../../../components/Dashboard/Filters/Filters";
import { useNavigate } from "react-router-dom";
import useProducts from "../../../../hooks/Dashboard/products/useProduct";
import Swal from "sweetalert2";

import DashboardLayout from "../../../../components/Dashboard/SellerDashboard";
import Table from "../../../../components/Dashboard/Table/Table";
import Controls from "../../../../components/Dashboard/Controls/Controls";
import Button from "../../../../components/ui/Button";
import ProductForm from "../../../../components/Dashboard/Forms/ProductForm";
import ProductMovementsModal from "../../../../components/Dashboard/Modals/ProductMovementsModal";

const tableColumns = (handleViewMovements: (product: Product) => void) => [
  {
    header: "EAN",
    key: "ean",
    sortable: true,
    render: (row: Product) => (
      <span className="font-mono text-sm text-gray-700">{row.ean}</span>
    ),
  },
  {
    header: "SKU",
    key: "sku",
    sortable: true,
    render: (row: Product) => (
      <span className="font-semibold text-gray-900">{row.sku}</span>
    ),
  },
  {
    header: "Nombre",
    key: "name",
    sortable: true,
    render: (row: Product) => <span className="text-gray-800">{row.name}</span>,
  },
  {
    header: "Valor declarado",
    key: "price",
    render: (row: Product) => (
      <span className="font-medium text-gray-700">
        ${Number(row.price)?.toFixed(2)}
      </span>
    ),
  },
  {
    header: "Tipo volumen",
    key: "volumeType",
    render: (row: Product) => (
      <span className="text-sm text-gray-600 capitalize">{row.volumeType}</span>
    ),
  },
  {
    header: "Stock",
    key: "stock",
    render: (row: Product) => {
      const totalStock = Number(row.totalStock) || 0;
      const reservedStock = Number(row.reservedStock) || 0;
      const availableStock = totalStock - reservedStock;

      return (
        <div className="flex flex-col gap-0.5 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">T:</span>
            <span className="font-medium text-gray-700">
              {totalStock.toFixed(0)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-green-600">D:</span>
            <span className="font-medium text-green-700">
              {availableStock.toFixed(0)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-orange-600">R:</span>
            <span className="font-medium text-orange-700">
              {reservedStock.toFixed(0)}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: "Acciones",
    key: "actions",
    render: (row: Product) => (
      <div className="flex gap-2">
        <button
          title="Ver movimientos"
          onClick={() => handleViewMovements(row)}
          className="p-2 rounded-full border border-blue-300 hover:bg-blue-100 transition"
        >
          <History className="h-4 w-4 text-blue-600" />
        </button>
      </div>
    ),
  },
];

export default function SellersProductsPage() {
  const navigate = useNavigate();
  const products = useProducts();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openMovementsModal, setOpenMovementsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (products.data.length <= 0) {
      handleGetData();
    }
  }, []);

  const handleGetData = (page: number = 1, limit: number = 10) => {
    products.get(page, limit, searchTerm, products.filters.status);
  };

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    products.searchProducts(searchTerm);
  };

  const handlePageChange = (page: number) => {
    handleGetData(page);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleImportQuantity = () => {
    navigate("/panel/vendedor/inventario/importar-productos");
  };

  const handleViewMovements = (product: Product) => {
    setSelectedProduct(product);
    setOpenMovementsModal(true);
  };

  const handleIndividualSubmit = async (product: Product) => {
    if (
      !product.ean ||
      !product.sku ||
      !product.name ||
      !product.price ||
      product.price <= 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor completa todos los campos requeridos",
      });
      return;
    }

    try {
      await products.create(product);
      Swal.fire({
        icon: "success",
        title: "Producto creado",
        text: "El producto se ha creado exitosamente",
      });
      handleGetData();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al crear el producto",
      });
      throw error;
    }
  };

  // Configuración de filtros
  const filterConfig: FilterConfig = [
    {
      key: "status",
      type: "select",
      label: "Estado",
      options: Object.values(ProductStatus),
    },
  ];

  const breadcrumb = [{ label: "Inventario" }, { label: "Productos" }];

  return (
    <DashboardLayout
      title="Productos"
      breadcrumb={breadcrumb}
      requireActiveUser={true}
    >
      <div className="flex flex-col gap-4">
        {openModal && (
          <ProductForm
            onClose={handleCloseModal}
            onImportQuantity={handleImportQuantity}
            onSubmit={handleIndividualSubmit}
          />
        )}
        <ProductMovementsModal
          product={selectedProduct}
          isOpen={openMovementsModal}
          onClose={() => {
            setOpenMovementsModal(false);
            setSelectedProduct(null);
          }}
          getMovementsByProduct={products.api.getMovementsByProduct}
          filterTypes={["Ingreso", "Egreso", "Venta"]}
          showStorage={false}
        />
        <Controls
          filtersConfig={filterConfig}
          filtersData={products.filters as Record<string, string>}
          btnConfig={[
            {
              component: (
                <Button
                  type="primary"
                  className="flex items-center justify-center h-full gap-2"
                  onClick={handleOpenModal}
                >
                  <Plus size={16} />
                  <span>Nuevos Productos</span>
                </Button>
              ),
              onClick: () => {},
            },
            {
              component: (
                <Button
                  type="primary"
                  variant="outline"
                  className="flex items-center justify-center h-full"
                  onClick={handleGetData}
                >
                  <RefreshCcw size={16} />
                </Button>
              ),
              onClick: () => {},
            },
          ]}
          onFilter={(filters: Record<string, any>) =>
            products.onFilterChange({ status: filters.status ?? "" })
          }
          onApplyFilters={products.onFilterApply}
          onResetFilters={products.onFilterReset}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
        <Table
          columns={tableColumns(handleViewMovements)}
          data={products.data}
          enableInternalPagination={false}
          pagination={products.pagination}
          onPageChange={handlePageChange}
          loading={products.loading.get || products.loading.search}
        />
      </div>
    </DashboardLayout>
  );
}
