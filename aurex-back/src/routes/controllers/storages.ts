import { StorageTS } from "../../interfaces/StorageTS";
import { Storage } from "../../db";

const createStorage = async (storage: StorageTS) => {
  // Verificar si name existe
  if (!storage.rag) throw new Error("missing parameter 'rag'");
  if (!storage.site) throw new Error("missing parameter 'site'");
  if (!storage.positions) throw new Error("missing parameter 'positions'");
  if (!storage.currentCapacity)
    throw new Error("missing parameter 'currentCapacity'");
  if (!storage.totalCapacity)
    throw new Error("missing parameter 'totalCapacity'");

  // Creamos el Storage
  const newStorage: any = await Storage.create({ ...storage });

  return newStorage.dataValues;
};

const getAllStorage = async () => {
  // Obtener todos los Storage y sus usuarios asociados
  const storages: any = await Storage.findAll();

  // Retornamos todos los storages
  return storages;
};

const updateStorage = async (storage: StorageTS) => {
  // Verificar si name existe
  if (!storage.id) throw new Error("missing parameter 'id'");
  if (!storage.rag) throw new Error("missing parameter 'rag'");
  if (!storage.site) throw new Error("missing parameter 'site'");
  if (!storage.positions) throw new Error("missing parameter 'positions'");
  if (!storage.currentCapacity)
    throw new Error("missing parameter 'currentCapacity'");
  if (!storage.totalCapacity)
    throw new Error("missing parameter 'totalCapacity'");

  // Obtenermos el storage
  const currentStorage = await Storage.findOne({ where: { id: storage.id } });

  // Verificamso que exista el storage
  if (!currentStorage) throw new Error();

  // Actualizar el nombre del Storage si es necesario
  await currentStorage?.update({ ...storage });

  return currentStorage.dataValues;
};

const deleteStorage = async (storageId: string) => {
  const storage = await Storage.findOne({ where: { id: storageId } });

  if (!storage) throw new Error("Product not found");

  await storage.destroy();
};

const disableStorage = async (storageId: string) => {
  const storage: any = await Storage.findOne({ where: { id: storageId } });

  // Verificar el storage
  if (!storage) throw new Error("Storage not found");

  // Habilitar o desabilitar
  if (storage.disabled) {
    await storage.update({ disabled: false });
  } else {
    await storage.update({ disabled: true });
  }
};

export {
  createStorage,
  getAllStorage,
  updateStorage,
  deleteStorage,
  disableStorage,
};
