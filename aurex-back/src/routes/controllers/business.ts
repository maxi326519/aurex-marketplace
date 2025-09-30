import { Business, User } from "../../db";

const createBusiness = async (businessData: any) => {
  if (!businessData.businessName) throw new Error("missing parameter (businessName)");
  if (!businessData.businessType) throw new Error("missing parameter (businessType)");
  if (!businessData.address) throw new Error("missing parameter (address)");
  if (!businessData.city) throw new Error("missing parameter (city)");
  if (!businessData.state) throw new Error("missing parameter (state)");
  if (!businessData.zipCode) throw new Error("missing parameter (zipCode)");
  if (!businessData.taxId) throw new Error("missing parameter (taxId)");
  if (!businessData.bankAccount) throw new Error("missing parameter (bankAccount)");
  if (!businessData.userId) throw new Error("missing parameter (userId)");

  // Verificar que el usuario existe
  const user = await User.findByPk(businessData.userId);
  if (!user) throw new Error("User not found");

  // Verificar que el usuario no tenga ya un negocio
  const existingBusiness = await Business.findOne({
    where: { userId: businessData.userId }
  });
  if (existingBusiness) throw new Error("User already has a business");

  const newBusiness = await Business.create(businessData);
  return newBusiness;
};

const getAllBusinesses = async () => {
  const allBusinesses = await Business.findAll({
    include: [{
      model: User,
      as: 'User',
      attributes: ['id', 'name', 'email', 'rol', 'status']
    }]
  });
  return allBusinesses;
};

const getBusinessById = async (id: string) => {
  const business = await Business.findByPk(id, {
    include: [{
      model: User,
      as: 'User',
      attributes: ['id', 'name', 'email', 'rol', 'status']
    }]
  });
  
  if (!business) throw new Error("Business not found");
  return business;
};

const updateBusiness = async (businessData: any) => {
  if (!businessData.id) throw new Error("missing parameter (id)");

  const business = await Business.findByPk(businessData.id);
  if (!business) throw new Error("Business not found");

  await business.update(businessData);
  return business;
};

const deleteBusiness = async (id: string) => {
  const business = await Business.findByPk(id);
  if (!business) throw new Error("Business not found");

  await business.destroy();
  return { message: "Business deleted successfully" };
};

const getBusinessByUserId = async (userId: string) => {
  const business = await Business.findOne({
    where: { userId },
    include: [{
      model: User,
      as: 'User',
      attributes: ['id', 'name', 'email', 'rol', 'status']
    }]
  });
  
  if (!business) throw new Error("Business not found for this user");
  return business;
};

export { 
  createBusiness, 
  getAllBusinesses, 
  getBusinessById, 
  updateBusiness, 
  deleteBusiness,
  getBusinessByUserId 
};
