import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useGetUsers = () => {
  const [users, setUsers] = useState([]);
  const axios = useAxiosPrivate();

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/users/all");

      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  return users;
};
export default useGetUsers;
