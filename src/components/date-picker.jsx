import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

export default function DateInput({ value, placeholder, handleChange }) {
  const [date, setDate] = useState(null);

  useEffect(() => {
    const updatedValue = value ? value : null;
    setDate(updatedValue);
  }, [value]);

  return (
    <div className="date-picker-container">
      <DatePicker
        selected={date}
        onChange={handleChange}
        placeholderText={placeholder}
        dateFormat="dd/MM/yyyy"
        className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring focus:ring-purple-100 transition-all duration-200 outline-none"
        popperModifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 10],
            },
          },
        ]}
        portalId="date-picker-portal"
        withPortal
      />
    </div>
  );
}
