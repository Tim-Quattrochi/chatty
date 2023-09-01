  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    time: "EST",
  };
export const formatDate = (timestamp) => {
  if (!timestamp) return new Date().toLocaleDateString("en-US");


  const date = new Date(timestamp);
  const dateString = date.toLocaleDateString("en-US", options);
  const timeString = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateString} ${timeString}`;
};