import React, { useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatDateToDDMMYYYY, extractNumber } from "../utils/stringUtils";

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
  5: "5",
  4: "4",
  3: "3",
  2: "2",
  1: "1",
  0: "0",
};

const moodColors = {
  5: "#FFD700", // Gold for happy
  4: "#98FB98", // Pale green for content
  3: "#87CEEB", // Sky blue for peaceful
  2: "#DDA0DD", // Plum for anxious
  1: "#B0C4DE", // Light steel blue for sad
  0: "#FF6B6B", // Coral red for angry
};

const MoodChart = ({ journals }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const chartRef = useRef(null);

  const processData = () => {
    return journals
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((journal) => {
        const moodValue = extractNumber(journal.ai?.score) ?? 3;
        return {
          date: formatDateToDDMMYYYY(journal.date),
          mood: moodValue,
          moodEmoji: journal.ai?.mood || "🙂",
          color: moodColors[moodValue],
        };
      });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const moodValue = payload[0].value;
      const color = moodColors[moodValue];
      const { moodEmoji } = payload[0].payload;

      return (
        <div
          className="bg-white p-4 rounded-xl shadow-lg border-2 transition-all duration-300"
          style={{
            borderColor: color,
            transform: "scale(1.05)",
          }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: "#666" }}>
            {label}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{moodEmoji}</span>
            <span className="text-lg font-semibold" style={{ color }}>
              {moodValue}/5
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = ({ cx, cy, payload, value }) => {
    const isHovered =
      hoveredPoint &&
      hoveredPoint.date === payload.date &&
      hoveredPoint.mood === payload.mood;

    return (
      <g>
        {/* Outer circle (glow effect) */}
        {/* <circle
          cx={cx}
          cy={cy}
          r={isHovered ? 12 : 8}
          fill={payload.color}
          opacity={0.2}
          className="transition-all duration-300"
        /> */}
        {/* Inner circle */}
        {/* <circle
          cx={cx}
          cy={cy}
          r={isHovered ? 6 : 4}
          fill={payload.color}
          className="transition-all duration-300"
        /> */}
        {/* Emoji */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="15px"
          
        >
          {payload.moodEmoji}
        </text>
      </g>
    );
  };

  const data = processData();

  return (
    <div className="w-full h-[500px] bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="mb-6">
        <h2 className="text-3xl h-[45px] font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Hành trình cảm xúc ✨
        </h2>
        <p className="text-gray-500 mt-2">
          Theo dõi những con sóng cảm xúc theo thời gian
        </p>
      </div>

      <div className="relative h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            ref={chartRef}
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            onMouseMove={(e) => {
              if (e.activePayload) {
                setHoveredPoint(e.activePayload[0].payload);
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12, fill: "#666" }}
              tickLine={{ stroke: "#eee" }}
            />

            <YAxis
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              tickFormatter={(value) => valueToMood[value]}
              tick={{ dx: -10, fontSize: 14 }}
              axisLine={{ stroke: "#eee" }}
              tickLine={{ stroke: "#eee" }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#ddd", strokeWidth: 1 }}
            />

            <Line
              type="monotone"
              dataKey="mood"
              stroke="url(#moodGradient)"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={false}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodChart;
