import { Routes, Route, Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import TopicDetail from "../pages/TopicDetail";
import PracticeRunner from "../pages/PracticeRunner";
import Quiz from "../pages/Quiz";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import LabDetail from "../pages/LabDetail";
import Explorer from "../pages/Explorer";
import MyLaboratories from "../pages/MyLaboratories";

// Rutas públicas de cuenta y rutas privadas del contenido educativo.
export default function AppRouter() {
  return (
    <Routes>
      {/* Flujos públicos de autenticación. */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar" element={<ForgotPassword />} />
      <Route path="/restablecer-contrasena" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        {/* Inicio, catálogo y laboratorios del usuario. */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mis-laboratorios" element={<MyLaboratories />} />
        <Route path="/explorar" element={<Explorer />} />

        {/* Laboratorio → tema → simulador. */}
        <Route path="/:labId" element={<LabDetail />} />
        <Route path="/:labId/:topicId" element={<TopicDetail />} />
        <Route path="/:labId/:topicId/:practiceId" element={<PracticeRunner />} />

        {/* Evaluación de reforzamiento por práctica. */}
        <Route path="/evaluacion/:practiceId" element={<Quiz />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}