import React from "react";
import "./input.css";

const Input = ({
  className,
  handleChange,
  placeholder,
  value,
  type,
  name,
}) => {
  return (
    <input
      className={className}
      type={type}
      name={name}
      onChange={handleChange}
      placeholder={placeholder}
      value={value}
    />
  );
};

export default Input;
