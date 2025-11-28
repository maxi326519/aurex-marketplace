import { RefreshCcw, Plus } from "lucide-react";
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

const tableColumns = [
  { header: "EAN", key: "ean", sortable: true },
  { header: "SKU", key: "sku", sortable: true },
  { header: "Nombre", key: "name", sortable: true },
  { header: "Valor declarado", key: "price" },
  { header: "Tipo volumen", key: "volumeType" },
  { header: "Stock", key: "totalStock", sortable: true },
];

export default function SellersProductsPage() {
  const navigate = useNavigate();
  const products = useProducts();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

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
          columns={tableColumns}
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
