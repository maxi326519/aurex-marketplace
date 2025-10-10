import { ReceptionTS } from "../../interfaces/ReceptionsTS";
import { Reception } from "../../db";
import { WhereOptions } from "sequelize";

const createReception = async (
  data: ReceptionTS,
  productsFile: Express.Multer.File,
  recipeFile: Express.Multer.File,
  BusinessId: string
) => {
  // Check parameters
  if (!data.date) throw new Error("missing parameter date");
  if (!data.state) throw new Error("missing parameter state");
  if (!BusinessId) throw new Error("BusinessId not found");

  // Create Reception
  const newReception: any = await Reception.create({
    date: data.date,
    state: data.state,
    sheetFile: productsFile.path,
    remittance: recipeFile.path,
  });

  // Bind to Business
  newReception.setBusiness(BusinessId);

  return newReception.dataValues;
};

const getAllReceptions = async (state?: string) => {
  const where: WhereOptions<any> = {};
  if (state) where.state = state;

  // Obtener todos los Receptions y sus usuarios asociados
  const receptions: any = await Reception.findAll({ where });

  // Retornamos todos los receptions
  return receptions;
};

const updateReception = async (data: ReceptionTS) => {
  // Verificamos los parametros
  if (!data.date) throw new Error("Missing parameter name");
  if (!data.state) throw new Error("Missing parameter name");

  // Obtenermos el reception
  const currentReception = await Reception.findByPk(data.id);

  // Verificamos que exista el reception
  if (!currentReception) throw new Error();

  // Actualizar el nombre del Reception si es necesario
  await currentReception?.update({ ...data });

  return currentReception.dataValues;
};

const deleteReception = async (receptionId: string) => {
  const reception = await Reception.findOne({ where: { id: receptionId } });

  if (!reception) throw new Error("Reception not found");

  await reception.destroy();
};

export { createReception, getAllReceptions, updateReception, deleteReception };
