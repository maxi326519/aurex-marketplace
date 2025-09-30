import { Storage } from "../../../interfaces/Storage";
import useStorageStore from "./useStorageStore";
import axios from "axios";
import Swal from "sweetalert2";

export interface UseStorage {
  data: Storage[];
  set: (storage: Storage) => Promise<void>;
  get: () => Promise<void>;
  update: (storage: Storage) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useStorage(): UseStorage {
  const {
    data,
    setLoading,
    setStorages,
    addStorage,
    updateStorage: updateStorageInStore,
    removeStorage,
  } = useStorageStore();

  // API functions
  const postStorageAPI = async (storage: Storage): Promise<Storage> => {
    const response = await axios.post("/storages", storage);
    return response.data;
  };

  const getStorageAPI = async (): Promise<Storage[]> => {
    const response = await axios.get("/storages");
    return response.data;
  };

  const updateStorageAPI = async (storage: Storage): Promise<Storage> => {
    await axios.patch("/storagse", storage);
    return storage;
  };

  const deleteStorageAPI = async (id: string): Promise<void> => {
    await axios.delete(`/storages/${id}`);
  };

  async function setStorageItem(storage: Storage): Promise<void> {
    setLoading(true);
    try {
      const newStorage = await postStorageAPI(storage);
      addStorage(newStorage);
      Swal.fire("Created", "Storage created successfully", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to create the storage, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getStorageData(): Promise<void> {
    setLoading(true);
    try {
      const storages = await getStorageAPI();
      setStorages(storages);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to get the storages, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateStorageItem(storage: Storage): Promise<void> {
    setLoading(true);
    try {
      await updateStorageAPI(storage);
      updateStorageInStore(storage);
      Swal.fire("Updated", "Storage updated successfully", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to update the storage, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function removeStorageItem(id: string): Promise<void> {
    const response = await Swal.fire({
      icon: "info",
      text: "Are you sure you want to delete this storage?",
      showCancelButton: true,
      confirmButtonText: "Accept",
      cancelButtonText: "Cancel",
    });

    if (response.isConfirmed) {
      setLoading(true);
      try {
        await deleteStorageAPI(id);
        removeStorage(id);
        Swal.fire("Deleted", "Storage deleted successfully", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Error to delete the storage, try later", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    }
  }

  return {
    data,
    set: setStorageItem,
    get: getStorageData,
    update: updateStorageItem,
    remove: removeStorageItem,
  };
}
