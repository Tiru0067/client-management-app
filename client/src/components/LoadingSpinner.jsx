import React from "react";
import { MoonLoader } from "react-spinners";

const LoadingSpinner = ({ loading = true, size = 35, color = "black" }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <MoonLoader size={size} color={color} />
    </div>
  );
};

export default LoadingSpinner;
