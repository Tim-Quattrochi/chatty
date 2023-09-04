import React from "react";
import "./input.css";

const Input = ({
  className,
  handleChange,
  placeholder,
  value,
  type,
  name,
  onClick,
}) => {
  return (
    <input
      className={className}
      type={type}
      name={name}
      onChange={handleChange}
      placeholder={placeholder}
      value={value}
      onClick={onClick ? onClick : null}
    />
  );
};

export default Input;
