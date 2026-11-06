import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import AppRouter from "./routes/AppRouter";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="min-w-0 flex-1">
          <AppRouter />
        </main>
      </div>
      <Footer />
    </div>
  );
}