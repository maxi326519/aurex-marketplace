import { User } from "../../../interfaces/Users";
import useUsersStore from "./useUsersStore";
import axios from "axios";
import Swal from "sweetalert2";

export interface UseUsers {
  data: User[];
  create: (user: User, file?: File | null) => Promise<void>;
  get: () => Promise<void>;
  update: (user: User) => Promise<void>;
  delete: (userId: string) => Promise<void>;
}

export default function useUsers(): UseUsers {
  const {
    data,
    setLoading,
    setUsers,
    addUser,
    updateUser: updateUserInStore,
    removeUser,
  } = useUsersStore();

  // API functions
  const postUser = async (user: User, file?: File | null): Promise<User> => {
    console.log(file);

    // TODO: Implement file upload
    /*
    const formData = new FormData();
    formData.append("user", JSON.stringify(user));
    if (file) {
      formData.append("file", file);
    }
    const response = await axios.post("/users", formData);
    */

    const response = await axios.post("/users", user);
    return response.data;
  };

  const getUsersAPI = async (): Promise<User[]> => {
    const response = await axios.get("/users");
    return response.data;
  };

  const updateUserAPI = async (user: User): Promise<User> => {
    await axios.patch("/users", user);
    return user;
  };

  const deleteUserAPI = async (userId: string): Promise<void> => {
    await axios.delete(`/users/${userId}`);
  };

  async function createUser(user: User, file?: File | null): Promise<void> {
    setLoading(true);
    try {
      const newUser = await postUser(user, file);
      addUser(newUser);
      Swal.fire("Created", "User created successfully", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to create the user, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getUsersData(): Promise<void> {
    setLoading(true);
    try {
      const users = await getUsersAPI();
      setUsers(users);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to get the users, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateUserData(user: User): Promise<void> {
    setLoading(true);
    try {
      await updateUserAPI(user);
      updateUserInStore(user);
      Swal.fire("Updated", "User updated successfully", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to update the user, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function removeUsers(userId: string): Promise<void> {
    const response = await Swal.fire({
      icon: "info",
      text: "Are you sure you want to delete this user?",
      showCancelButton: true,
      confirmButtonText: "Accept",
      cancelButtonText: "Cancel",
    });

    if (response.isConfirmed) {
      setLoading(true);
      try {
        await deleteUserAPI(userId);
        removeUser(userId);
        Swal.fire("Deleted", "User deleted successfully", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Error to delete the user, try later", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    }
  }

  return {
    data,
    create: createUser,
    get: getUsersData,
    update: updateUserData,
    delete: removeUsers,
  };
}
