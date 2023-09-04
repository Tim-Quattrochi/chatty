import React from "react";
import Input from "../Input/Input";
import "./createChat.css";

const CreateChat = ({
  handleChange,
  roomInput,
  handleJoinOrCreateRoom,
}) => {
  return (
    <div className="create-room">
      <Input
        type="text"
        value={roomInput}
        handleChange={handleChange}
        placeholder="Create a room"
        onClick={null}
      />
      <Input
        type="submit"
        value="Create"
        className="create-room-btn"
        onClick={() => handleJoinOrCreateRoom(roomInput, null)}
      />
    </div>
  );
};

export default CreateChat;
