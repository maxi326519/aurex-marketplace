import { PaymentOptions } from "../../db";

const getPaymentOptionsByUser = async (userId: string) => {
  console.log('Getting payment options for userId:', userId);
  const options = await PaymentOptions.findAll({
    where: { userId },
  });
  console.log('Found payment options:', options);
  return options;
};

const createPaymentOption = async (data: any) => {
  if (!data.userId) throw new Error("missing parameter (userId)");
  if (!data.type) throw new Error("missing parameter (type)");

  const newOption = await PaymentOptions.create({
    ...data,
    UserId: data.userId,
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
  getPaymentOptionsByUser,
  createPaymentOption,
  updatePaymentOption,
  deletePaymentOption,
};
