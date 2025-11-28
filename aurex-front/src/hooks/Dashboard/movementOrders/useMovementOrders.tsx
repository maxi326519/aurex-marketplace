import { MovementOrder, MovementOrderStatus } from "../../../interfaces/MovementOrders";
import { Keys, useMovementOrdersStore } from "./useMovementOrdersStore";
import axios from "axios";
import Swal from "sweetalert2";

export interface UseMovementOrders {
  pendings: {
    data: MovementOrder[];
    create: (
      movementOrder: MovementOrder,
      productsFile: File,
      recipeFile: File | null
    ) => Promise<MovementOrder>;
    get: () => Promise<void>;
    update: (movementOrder: MovementOrder) => Promise<void>;
    remove: (movementOrderId: string) => Promise<void>;
    aprove: (movementOrder: MovementOrder) => Promise<void>;
  };
  approved: {
    data: MovementOrder[];
    create: (
      movementOrder: MovementOrder,
      productsFile: File,
      recipeFile: File | null
    ) => Promise<MovementOrder>;
    get: () => Promise<void>;
    update: (movementOrder: MovementOrder) => Promise<void>;
    complete: (movementOrder: MovementOrder) => Promise<void>;
    completeWithStock: (
      movementOrderId: string,
      stockItems: Array<{ ean: string; sku: string; cantidad: number; almacen: string }>,
      state: string
    ) => Promise<void>;
    remove: (movementOrderId: string) => Promise<void>;
  };
  history: {
    data: MovementOrder[];
    create: (
      movementOrder: MovementOrder,
      productsFile: File,
      recipeFile: File | null
    ) => Promise<MovementOrder>;
    get: () => Promise<void>;
    update: (movementOrder: MovementOrder) => Promise<void>;
    remove: (movementOrderId: string) => Promise<void>;
  };
}

export default function useMovementOrders(): UseMovementOrders {
  const {
    pendings,
    approved,
    history,
    setMovementOrders,
    addMovementOrder,
    updateMovementOrder,
    removeMovementOrder,
  } = useMovementOrdersStore();

  const postMovementOrder = async (
    movementOrder: MovementOrder,
    productsFile: File,
    recipeFile: File | null
  ): Promise<MovementOrder> => {
    const formData = new FormData();

    // Agrego todos los campos del objeto MovementOrder al form-data
    Object.entries(movementOrder).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value as any);
        }
      }
    });

    // Agrego los archivos
    formData.append("products", productsFile);
    
    // Solo agregar remito si existe (para ingresos)
    if (recipeFile && recipeFile.size > 0) {
      formData.append("remittance", recipeFile);
    }

    const response = await axios.post("/movement-orders", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  const getMovementOrders = async (
    state: MovementOrderStatus | MovementOrderStatus[]
  ): Promise<MovementOrder[]> => {
    let queryParam = "";
    if (state) {
      if (Array.isArray(state)) {
        // Si es un array, unir los estados con comas
        queryParam = `?state=${state.filter(s => s).join(",")}`;
      } else {
        // Si es un solo estado
        queryParam = `?state=${state}`;
      }
    }
    const response = await axios.get(`/movement-orders${queryParam}`);
    return response.data;
  };

  const updateMovementOrderAPI = async (
    movementOrder: MovementOrder
  ): Promise<MovementOrder> => {
    await axios.patch("/movement-orders", movementOrder);
    return movementOrder;
  };

  const deleteMovementOrderAPI = async (movementOrderId: string): Promise<void> => {
    await axios.delete(`/movement-orders/${movementOrderId}`);
  };

  // MovementOrder operations
  async function createMovementOrder(
    movementOrder: MovementOrder,
    productsFile: File,
    recipeFile: File | null,
    key: Keys
  ): Promise<MovementOrder> {
    try {
      const newMovementOrder = await postMovementOrder(
        movementOrder,
        productsFile,
        recipeFile
      );
      addMovementOrder(newMovementOrder, key);
      Swal.fire("Creado", "Orden de movimiento creada exitosamente", "success");
      return newMovementOrder;
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al crear la orden de movimiento, intenta más tarde", "error");
      throw error;
    }
  }

  async function getAllMovementOrders(
    state: MovementOrderStatus | MovementOrderStatus[],
    key: Keys
  ): Promise<void> {
    try {
      const movementOrders = await getMovementOrders(state);
      setMovementOrders(movementOrders, key);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al obtener las órdenes de movimiento, intenta más tarde", "error");
      throw error;
    }
  }

  async function updateMovementOrderById(
    movementOrder: MovementOrder,
    key: Keys
  ): Promise<void> {
    try {
      await updateMovementOrderAPI(movementOrder);
      updateMovementOrder(movementOrder, key);
      Swal.fire("Actualizado", "Orden de movimiento actualizada exitosamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al actualizar la orden de movimiento, intenta más tarde", "error");
      throw error;
    }
  }

  async function aprovePending(movementOrder: MovementOrder) {
    try {
      const newMovementOrder = {
        ...movementOrder,
        state: MovementOrderStatus.RECEIVED,
      };

      await updateMovementOrderAPI(newMovementOrder);
      updateMovementOrder(movementOrder, "approved");

      Swal.fire("Actualizado", "Orden de movimiento aprobada exitosamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al aprobar la orden de movimiento, intenta más tarde", "error");
    }
  }

  async function completePending(movementOrder: MovementOrder) {
    try {
      const newMovementOrder = {
        ...movementOrder,
        state: MovementOrderStatus.COMPLETED,
      };

      await updateMovementOrderAPI(newMovementOrder);
      updateMovementOrder(movementOrder, "history");

      Swal.fire("Actualizado", "Orden de movimiento completada exitosamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al completar la orden de movimiento, intenta más tarde", "error");
    }
  }

  const completeWithStockAPI = async (
    movementOrderId: string,
    stockItems: Array<{ ean: string; sku: string; cantidad: number; almacen: string }>,
    state: string
  ): Promise<any> => {
    const response = await axios.post(`/movement-orders/${movementOrderId}/complete`, {
      stockItems,
      state,
    });
    return response.data;
  };

  async function completeWithStock(
    movementOrderId: string,
    stockItems: Array<{ ean: string; sku: string; cantidad: number; almacen: string }>,
    state: string
  ): Promise<void> {
    try {
      const result = await completeWithStockAPI(movementOrderId, stockItems, state);
      
      // Actualizar la orden en el store
      const movementOrder = approved.find((order) => order.id === movementOrderId);
      if (movementOrder) {
        const updatedOrder = {
          ...movementOrder,
          state: result.state === "Completado" ? MovementOrderStatus.COMPLETED : MovementOrderStatus.PARTIAL,
        };
        updateMovementOrder(updatedOrder, "approved");
        
        // Si está completado o parcial, moverlo al historial (ambos son estados finalizados)
        if (result.state === "Completado" || result.state === "Parcial") {
          updateMovementOrder(updatedOrder, "history");
        }
      }

      const message = result.state === "Completado"
        ? `Orden completada exitosamente. ${result.successCount} producto(s) procesado(s).`
        : `Orden completada parcialmente. ${result.successCount} producto(s) procesado(s).`;
      
      Swal.fire("Actualizado", message, result.state === "Completado" ? "success" : "warning");
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.error || error.message || "Error al completar la orden de movimiento";
      Swal.fire("Error", errorMessage, "error");
      throw error;
    }
  }

  async function removeMovementOrderById(
    movementOrderId: string,
    key: Keys
  ): Promise<void> {
    try {
      await deleteMovementOrderAPI(movementOrderId);
      removeMovementOrder(movementOrderId, key);
      Swal.fire("Eliminado", "Orden de movimiento eliminada exitosamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al eliminar la orden de movimiento, intenta más tarde", "error");
      throw error;
    }
  }

  const createPendings = async (
    data: MovementOrder,
    productsFile: File,
    recipeFile: File | null
  ) => createMovementOrder(data, productsFile, recipeFile, "pendings");
  const getPendings = async () =>
    getAllMovementOrders(MovementOrderStatus.PENDING, "pendings");
  const updatePendings = async (data: MovementOrder) =>
    updateMovementOrderById(data, "pendings");
  const removePendings = async (dataId: string) =>
    removeMovementOrderById(dataId, "pendings");

  const createApproved = async (
    data: MovementOrder,
    productsFile: File,
    recipeFile: File | null
  ) => createMovementOrder(data, productsFile, recipeFile, "approved");
  const getApproved = async () =>
    getAllMovementOrders(MovementOrderStatus.RECEIVED, "approved");
  const updateApproved = async (data: MovementOrder) =>
    updateMovementOrderById(data, "approved");
  const removeApproved = async (dataId: string) =>
    removeMovementOrderById(dataId, "approved");

  const createHistory = async (
    data: MovementOrder,
    productsFile: File,
    recipeFile: File | null
  ) => createMovementOrder(data, productsFile, recipeFile, "history");
  const getHistory = async () =>
    getAllMovementOrders([MovementOrderStatus.COMPLETED, MovementOrderStatus.PARTIAL], "history");
  const updateHistory = async (data: MovementOrder) =>
    updateMovementOrderById(data, "history");
  const removeHistory = async (dataId: string) =>
    removeMovementOrderById(dataId, "history");

  return {
    pendings: {
      data: pendings,
      create: createPendings,
      get: getPendings,
      update: updatePendings,
      aprove: aprovePending,
      remove: removePendings,
    },
    approved: {
      data: approved,
      create: createApproved,
      get: getApproved,
      update: updateApproved,
      complete: completePending,
      completeWithStock: completeWithStock,
      remove: removeApproved,
    },
    history: {
      data: history,
      create: createHistory,
      get: getHistory,
      update: updateHistory,
      remove: removeHistory,
    },
  };
}

