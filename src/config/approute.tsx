import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard.tsx";

export default function AppRoute() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Dashboard />} />
          <Route path="dashboard/*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
