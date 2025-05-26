import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import 'react-datepicker/dist/react-datepicker.css';

export default function DateInput({ value, placeholder, handleChange }) {
  const [date, setDate] = useState(null);

  useEffect(() => {
    const updatedValue = value ? value : null;
    setDate(updatedValue);
  }, [value]);

  return (
    <DatePicker
      selected={date}
      onChange={handleChange}
      placeholderText={placeholder}
      dateFormat="dd/MM/yyyy"
      className="w-full border-0 border-b-2 border-transparent text-[30px] focus:border-gray-400 focus:outline-none transition duration-200 text-sm text-gray-700"
    />
    
  );
}
