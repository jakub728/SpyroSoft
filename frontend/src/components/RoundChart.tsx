import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { type FirstEndpointElement, COLORS } from "../types/all";
import { formatTime } from "../utils/reusable";

interface RoundChartProps {
  data: FirstEndpointElement;
}

export default function RoundChart({ data }: RoundChartProps) {
  const chartData = Object.entries(data)
    .filter(([key]) => key !== "data" && key !== "cleanEnergy")
    .map(([key, value], index) => ({
      name: key.toUpperCase(),
      value: value as number,
      fill: COLORS[index % COLORS.length],
    }))
    .filter((item) => item.value > 0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        marginBottom: "100px",
        gap: "20px",
      }}
    >
      <hr style={{ height: "2px", color: "white", width: "100%" }} />
      <h1>{formatTime(data.data).slice(0, 10)}</h1>
      <div style={{ width: "100%", height: 350, position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${entry.name}: ${entry.value}%`}
            ></Pie>
          </PieChart>
        </ResponsiveContainer>
        <h2>Clean Energy: </h2>
        <div
          style={{
            width: "300px",
            position: "relative",
            backgroundColor: "lightgrey",
            margin: "auto",
          }}
        >
          <div
            style={{
              width: `${3 * data.cleanEnergy}px`,
              backgroundColor: "green",
              color: "white",
            }}
          >
            {data.cleanEnergy.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
}
