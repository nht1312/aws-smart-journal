import React from "react";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}