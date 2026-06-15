import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { formatTime } from "../utils/reusable";
import "../App.css";

const getBestChargingTime = async (hour: string) => {
  const { data } = await axios.get(`http://localhost:5000/api/second/${hour}`);
  return data;
};

export default function Second() {
  const [hour, setHour] = useState("");
  const [submittedHour, setSubmittedHour] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["chargingTime", submittedHour],
    queryFn: () => getBestChargingTime(submittedHour),
    enabled: submittedHour !== "",
  });

  return (
    <div style={{ marginTop: "50px" }}>
      <h2>Check best time to charge car using clean energy </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (hour) {
            setSubmittedHour(hour);
          }
        }}
      >
        <label htmlFor="hour-options">
          How many hours you plan to charge your car =
        </label>
        <select
          className="select"
          id="hour-options"
          name="hours"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
        >
          <option value="" disabled>
            select hour
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
        <button type="submit" disabled={!hour}>
          Check
        </button>
      </form>

      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error.message}</div>}
      {data && (
        <div style={{ marginTop: "20px" }}>
          <h2>Best {submittedHour} hour window would be:</h2>
          <h3>
            From{" "}
            <span style={{ color: "red" }}>{formatTime(data.startBest)}</span>{" "}
            to <span style={{ color: "red" }}>{formatTime(data.endBest)}</span>
          </h3>
          <h3>
            Clean energy:{" "}
            <span style={{ color: "green" }}>{data.averge.toFixed(2)}%</span>
          </h3>
        </div>
      )}
    </div>
  );
}
