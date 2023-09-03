import React, { useState } from "react";
import "./chatSideBar.css";

const ChatSideBar = ({ allUsers, handleJoinOrCreateRoom, user }) => {
  const [slide, setSlide] = useState(false);

  const handleSlide = () => {
    setSlide((prev) => !prev);
  };

  return (
    <div className="toggle" onClick={handleSlide}>
      <div className={`sidebar ${slide ? "show" : "unshow"}`}>
        {slide ? "Hide Users" : "Show Users"}
        {slide && (
          <ul className="other-users">
            <h2 className="other-users-title">Other users</h2>
            {/* this is mapping over ALL the users. */}
            {allUsers &&
              allUsers
                .filter((otherUser) => otherUser._id !== user._id)
                .map((otherUser) => (
                  <li
                    key={otherUser._id}
                    className="listed-users"
                    /* this creates a chat room when I click on the user name */
                    onClick={() =>
                      handleJoinOrCreateRoom(
                        `${otherUser.name} and ${user.name}'s chat`,
                        otherUser._id
                      )
                    }
                  >
                    {otherUser.name}
                  </li>
                ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatSideBar;
