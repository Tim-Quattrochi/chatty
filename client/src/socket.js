import io from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? undefined
    : "http://localhost:3001";

export const socket = io(URL);
