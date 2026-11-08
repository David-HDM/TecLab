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
import Laboratories from "../pages/Laboratories";
import LabDetail from "../pages/LabDetail";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar" element={<ForgotPassword />} />
      <Route path="/restablecer-contrasena" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/temas" element={<Topics />} />
        <Route path="/laboratorios" element={<Laboratories />} />
        <Route path="/temas/:topicId" element={<TopicDetail />} />
        <Route path="/laboratorios/:labId" element={<LabDetail />} />
        <Route path="/practicas" element={<Practices />} />
        <Route path="/practicas/:practiceId" element={<PracticeRunner />} />
        <Route path="/evaluacion/:topicId" element={<Quiz />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}