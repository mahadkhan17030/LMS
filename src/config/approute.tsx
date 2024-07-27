import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/dashboard.tsx";
import Signup from '../pages/nestedPages/signup.tsx'
import Login from '../pages/nestedPages/login.tsx'
export default function AppRoute() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard/*" element={<Dashboard />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}
