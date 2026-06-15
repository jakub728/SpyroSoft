import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import First from "./pages/First";
import Second from "./pages/Second";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<First />} />
          <Route path="/second" element={<Second />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
