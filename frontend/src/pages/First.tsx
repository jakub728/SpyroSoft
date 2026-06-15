import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import RoundChart from "../components/RoundChart";
import { type FirstEndpointElement } from "../types/all";

const downloadThreeDaysData = async () => {
  const { data } = await axios.get("http://localhost:5000/api/first");
  return data;
};

export default function First() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["threeDaysData"],
    queryFn: downloadThreeDaysData,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  console.log(data);

  return (
    <div>
      {data.map((item: FirstEndpointElement, index: number) => (
        <RoundChart key={index} data={item} />
      ))}
    </div>
  );
}
