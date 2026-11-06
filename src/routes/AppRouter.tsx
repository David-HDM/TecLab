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

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/temas" element={<Topics />} />
        <Route path="/temas/:topicId" element={<TopicDetail />} />
        <Route path="/practicas" element={<Practices />} />
        <Route path="/practicas/:practiceId" element={<PracticeRunner />} />
        <Route path="/evaluacion/:topicId" element={<Quiz />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}