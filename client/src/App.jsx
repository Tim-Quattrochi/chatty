import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Welcome from "./pages/Welcome/Welcome";
import DashBoard from "./pages/DashBoard/DashBoard";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./Header";
import useAuthContext from "./hooks/useAuthContext";

import ChatRoom from "./components/ChatRoom/ChatRoom";
function App() {
  const {
    authState: { user, isAuthenticated },
  } = useAuthContext();

  const [roomInput, setRoomInput] = useState("");
  const [error, setError] = useState(null);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route
          path="/chat/:roomId"
          element={
            <ChatRoom
              roomInput={roomInput}
              setRoomInput={setRoomInput}
              error={error}
              setError={setError}
              user={user}
              userId={user?._id}
            />
          }
        />

        {/* Private Routes */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashBoard />} />
        </Route>
      </Routes>
    </div>
  );
}
export default App;
