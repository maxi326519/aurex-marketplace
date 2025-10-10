import { PaymentOptions, Business } from "../../db";

const getPaymentOptionsByBusiness = async (businessId: string) => {
  console.log('Getting payment options for businessId:', businessId);
  const options = await PaymentOptions.findAll({
    where: { businessId },
  });
  console.log('Found payment options:', options);
  return options;
};

const createPaymentOption = async (data: any) => {
  if (!data.businessId) throw new Error("missing parameter (businessId)");
  if (!data.type) throw new Error("missing parameter (type)");

  const newOption = await PaymentOptions.create({
    ...data,
    BusinessId: data.businessId,
  });
  return newOption;
};

const updatePaymentOption = async (id: string, data: any) => {
  const option = await PaymentOptions.findByPk(id);
  if (!option) throw new Error("Payment option not found");

  await option.update(data);
  return option;
};

const deletePaymentOption = async (id: string) => {
  const option = await PaymentOptions.findByPk(id);
  if (!option) throw new Error("Payment option not found");

  await option.destroy();
  return { message: "Payment option deleted successfully" };
};

export {
  getPaymentOptionsByBusiness,
  createPaymentOption,
  updatePaymentOption,
  deletePaymentOption,
};
