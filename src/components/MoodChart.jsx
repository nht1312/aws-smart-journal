import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatDateToDDMMYYYY } from "../utils/stringUtils";

const moodToValue = {
  "😊": 5, // Happy
  "😃": 5,
  "😄": 5,
  "🙂": 4, // Content
  "😌": 3, // Peaceful
  "🧘": 3,
  "😰": 2, // Anxious
  "😨": 2,
  "😢": 1, // Sad
  "😭": 1,
  "😥": 1,
  "😡": 0, // Angry
  "😠": 0,
  "😤": 0,
};

const valueToMood = {
  5: "😊",
  4: "🙂",
  3: "😌",
  2: "😰",
  1: "😢",
  0: "😡",
};

const MoodChart = ({ journals }) => {
  const processData = () => {
    return journals
      .map((journal) => {
        const moodValue = moodToValue[journal.ai?.mood?.trim()] ?? 3;
        return {
          date: formatDateToDDMMYYYY(journal.date),
          mood: moodValue,
          moodEmoji: journal.ai?.mood || "😌",
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const moodValue = payload[0].value;
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="text-sm">{`Date: ${label}`}</p>
          <p className="text-lg">{`Mood: ${valueToMood[moodValue]} (${moodValue}/5)`}</p>
        </div>
      );
    }
    return null;
  };

  const data = processData();

  return (
    <div className="w-full h-[400px] bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Mood Timeline</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tickFormatter={(value) => valueToMood[value]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ stroke: "#8884d8", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 8 }}
            name="Mood Level"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;
