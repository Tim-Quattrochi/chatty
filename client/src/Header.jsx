import React from "react";
import { Link, NavLink } from "react-router-dom";
import useAuthContext from "./hooks/useAuthContext";
import useChatContext from "./hooks/useChatContext";

const Navbar = () => {
  const { authState, handleLogout } = useAuthContext();
  const { handleClearChatState } = useChatContext();

  const handleLogoutClick = () => {
    handleLogout();
    handleClearChatState();
  };

  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li>
          <NavLink
            exact={true.toString()}
            to="/dashboard"
            style={styles.navLink}
            activestyle={styles.activeNavLink}
          >
            Dashboard
          </NavLink>
        </li>
        <li style={{ marginLeft: "auto" }}>
          {!authState.isAuthenticated ? (
            <>
              <NavLink
                to="/register"
                style={styles.navLink}
                activestyle={styles.activeNavLink}
                exact={true.toString()}
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                style={styles.navLink}
                activestyle={styles.activeNavLink}
              >
                Login
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/chat"
                style={styles.navLink}
                activestyle={styles.activeNavLink}
              >
                Chat
              </NavLink>
              <>
                Hello, {authState.user.name}
                <Link
                  to="/"
                  style={styles.navLink}
                  onClick={handleLogoutClick}
                >
                  Logout
                </Link>
              </>
            </>
          )}
        </li>
      </ul>
    </nav>
    //test
  );
};

const styles = {
  navbar: {
    backgroundColor: "#333",
    padding: "10px",
  },
  navList: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    padding: "8px 16px",
  },
  activeNavLink: {
    fontWeight: "bold",
  },
  chatLink: {
    color: "#fff",
    textDecoration: "none",
    padding: "8px 16px",
    marginLeft: "auto",
  },
};

export default Navbar;
