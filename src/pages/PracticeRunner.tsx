import { Link, useParams } from "react-router";
import { useEffect, useRef, useState, ComponentType } from "react";
import PageContainer from "../components/layout/PageContainer";
import { practices } from "../data/catalog";
import { Practice } from "../types/practice";
import DslPractice from "../components/practices/DslPractice";
import SshPractice from "../components/practices/SshPractice";
import ProxmoxPractice from "../components/practices/ProxmoxPractice";

const views: Record<string, ComponentType<{ practice: Practice }>> = {
  dsl: DslPractice,
  ssh: SshPractice,
  proxmox: ProxmoxPractice,
};

export default function PracticeRunner() {
  const { labId, topicId, practiceId } = useParams();
  const practice = practices.find((p) => p.id === practiceId);
  const View = practice ? views[practice.id] : undefined;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === containerRef.current);

    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("No se pudo entrar a pantalla completa:", err);
    }
  };

  if (!practice || !View) {
    return (
      <PageContainer>
        <p className="text-gray-600">Práctica no encontrada.</p>
        <Link
          to={`/${labId}/${topicId}`}
          className="font-semibold text-blue-700 hover:underline"
        >
          Volver a Prácticas
        </Link>
      </PageContainer>
    );
  }

  return (
    <div
      ref={containerRef}
      className={isFullscreen ? "h-screen w-screen overflow-auto bg-white" : ""}
    >
      <PageContainer>
        <div className="flex items-center justify-between">
          <Link
            to={`/${labId}/${topicId}`}
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            ← Prácticas
          </Link>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            className="rounded-lg border border-blue-600 p-2 hover:bg-blue-50"
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            <img
              src={isFullscreen ? "/exit-full-screen.png" : "/full-screen.png"}
              alt={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              className="h-5 w-5"
            />
          </button>
        </div>

        <h1 className="mt-2 text-2xl font-bold text-blue-900">{practice.titulo}</h1>
        <p className="mt-2 text-gray-600">{practice.descripcion}</p>

        <div className="mt-6">
          <View practice={practice} />
        </div>
      </PageContainer>
    </div>
  );
}