import React from "react";
import { useSocket } from "../../hooks/useSocket";
import Input from "../Input/Input";

const CreateChat = ({handleChange}) => {
    const socket = useSocket()
    return (
      <Input handleChange={handleChange} />
  );
};

export default CreateChat;
