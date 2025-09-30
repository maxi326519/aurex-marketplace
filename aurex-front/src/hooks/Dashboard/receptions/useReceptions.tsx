import { Reception, ReceptionStatus } from "../../../interfaces/Receptions";
import { Keys, useReceptionsStore } from "./useReceptionsStore";
import axios from "axios";
import Swal from "sweetalert2";

export interface UseReceptions {
  pendings: {
    data: Reception[];
    create: (
      reception: Reception,
      productsFile: File,
      recipeFile: File
    ) => Promise<Reception>;
    get: () => Promise<void>;
    update: (reception: Reception) => Promise<void>;
    remove: (receptionId: string) => Promise<void>;
    aprove: (reception: Reception) => Promise<void>;
  };
  approved: {
    data: Reception[];
    create: (
      reception: Reception,
      productsFile: File,
      recipeFile: File
    ) => Promise<Reception>;
    get: () => Promise<void>;
    update: (reception: Reception) => Promise<void>;
    complete: (reception: Reception) => Promise<void>;
    remove: (receptionId: string) => Promise<void>;
  };
  history: {
    data: Reception[];
    create: (
      reception: Reception,
      productsFile: File,
      recipeFile: File
    ) => Promise<Reception>;
    get: () => Promise<void>;
    update: (reception: Reception) => Promise<void>;
    remove: (receptionId: string) => Promise<void>;
  };
}

export default function useReceptions(): UseReceptions {
  const {
    pendings,
    approved,
    history,
    setReceptions,
    addReception,
    updateReception,
    removeReception,
  } = useReceptionsStore();

  const postReception = async (
    reception: Reception,
    productsFile: File,
    recipeFile: File
  ): Promise<Reception> => {
    const formData = new FormData();

    // Agrego todos los campos del objeto Reception al form-data
    Object.entries(reception).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    // Agrego los archivos
    formData.append("products", productsFile);
    formData.append("remittance", recipeFile);

    const response = await axios.post("/receptions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  const getReceptions = async (
    state: ReceptionStatus
  ): Promise<Reception[]> => {
    const response = await axios.get(
      `/receptions${state ? `?state=${state}` : ""}`
    );
    return response.data;
  };

  const updateReceptionAPI = async (
    reception: Reception
  ): Promise<Reception> => {
    await axios.patch("/receptions", reception);
    return reception;
  };

  const deleteReceptionAPI = async (receptionId: string): Promise<void> => {
    await axios.delete(`/receptions/${receptionId}`);
  };

  // Reception operations
  async function createReception(
    reception: Reception,
    productsFile: File,
    recipeFile: File,
    key: Keys
  ): Promise<Reception> {
    try {
      const newReception = await postReception(
        reception,
        productsFile,
        recipeFile
      );
      addReception(newReception, key);
      Swal.fire("Created", "Successfully created reception", "success");
      return newReception;
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to create the reception, try later", "error");
      throw error;
    }
  }

  async function getAllReceptions(
    state: ReceptionStatus,
    key: Keys
  ): Promise<void> {
    try {
      const receptions = await getReceptions(state);
      setReceptions(receptions, key);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to get the receptions, try later", "error");
      throw error;
    }
  }

  async function updateReceptionById(
    reception: Reception,
    key: Keys
  ): Promise<void> {
    try {
      await updateReceptionAPI(reception);
      updateReception(reception, key);
      Swal.fire("Updated", "Successfully updated reception", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to update the reception, try later", "error");
      throw error;
    }
  }

  async function aprovePending(reception: Reception) {
    try {
      const newReception = {
        ...reception,
        state: ReceptionStatus.RECEIVED,
      };

      await updateReceptionAPI(newReception);
      updateReception(reception, "approved");

      Swal.fire("Updated", "Successfully updated reception", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al aprobar la recepción, try later", "error");
    }
  }


  async function completePending(reception: Reception) {
    try {
      const newReception = {
        ...reception,
        state: ReceptionStatus.COMPLETED,
      };

      await updateReceptionAPI(newReception);
      updateReception(reception, "history");

      Swal.fire("Updated", "Successfully updated reception", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al aprobar la recepción, try later", "error");
    }
  }

  async function removeReceptionById(
    receptionId: string,
    key: Keys
  ): Promise<void> {
    try {
      await deleteReceptionAPI(receptionId);
      removeReception(receptionId, key);
      Swal.fire("Deleted", "Successfully deleted reception", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to delete the reception, try later", "error");
      throw error;
    }
  }

  const createPendings = async (
    data: Reception,
    productsFile: File,
    recipeFile: File
  ) => createReception(data, productsFile, recipeFile, "pendings");
  const getPendings = async () =>
    getAllReceptions(ReceptionStatus.PENDING, "pendings");
  const updatePendings = async (data: Reception) =>
    updateReceptionById(data, "pendings");
  const removePendings = async (dataId: string) =>
    removeReceptionById(dataId, "pendings");

  const createApproved = async (
    data: Reception,
    productsFile: File,
    recipeFile: File
  ) => createReception(data, productsFile, recipeFile, "approved");
  const getApproved = async () =>
    getAllReceptions(ReceptionStatus.RECEIVED, "approved");
  const updateApproved = async (data: Reception) =>
    updateReceptionById(data, "approved");
  const removeApproved = async (dataId: string) =>
    removeReceptionById(dataId, "approved");

  const createHistory = async (
    data: Reception,
    productsFile: File,
    recipeFile: File
  ) => createReception(data, productsFile, recipeFile, "history");
  const getHistory = async () =>
    getAllReceptions(ReceptionStatus.COMPLETED, "history");
  const updateHistory = async (data: Reception) =>
    updateReceptionById(data, "history");
  const removeHistory = async (dataId: string) =>
    removeReceptionById(dataId, "history");

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
