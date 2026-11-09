import { Routes, Route, Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Topics from "../pages/Topics";
import TopicDetail from "../pages/TopicDetail";
import Practices from "../pages/Practices";
import PracticeRunner from "../pages/PracticeRunner";
import Quiz from "../pages/Quiz";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import LabDetail from "../pages/LabDetail";
import Explorer from "../pages/Explorer";
import MyLaboratories from "../pages/MyLaboratories";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar" element={<ForgotPassword />} />
      <Route path="/restablecer-contrasena" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>

        {/* Para navegar al Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Para navegar a Mis Laboratorios */}
        <Route path="/mis-laboratorios" element={<MyLaboratories />} />

        {/* Para navegar a Explorar */}
        <Route path="/explorar" element={<Explorer />} />


        {/* Para navegar a un Laboratorio */}
        <Route path="/:labId" element={<LabDetail />} />

        {/* Para navegar a un Tema */}
        <Route path="/:labId/:topicId" element={<TopicDetail />} />

        {/* Para navegar a una Practica */}
        <Route path="/:labId/:topicId/:practiceId" element={<PracticeRunner />} />

        <Route path="/evaluacion/:topicId" element={<Quiz />} />

      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}