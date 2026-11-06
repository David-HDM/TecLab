import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import ProgressChart from "../components/dashboard/ProgressChart";
import ScoreHistoryChart from "../components/dashboard/ScoreHistoryChart";
import TopicProgressTable from "../components/dashboard/TopicProgressTable";
import { useAuth } from "../hooks/useAuth";
import { scoreHistory, topicProgress } from "../data/catalog";

export default function Dashboard() {
  const { user } = useAuth();
  const overall = Math.round(topicProgress.reduce((s, t) => s + t.progreso, 0) / topicProgress.length);

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-blue-900">Hola, {user?.nombre}</h1>
      <p className="mt-1 text-gray-600">Este es tu progreso en TecLab.</p>

      <Card className="mt-6">
        <ProgressBar value={overall} label="Progreso general" />
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Progreso por tema">
          <ProgressChart data={topicProgress} />
        </Card>
        <Card title="Historial de puntajes">
          <ScoreHistoryChart data={scoreHistory} />
        </Card>
      </div>

      <Card title="Detalle por tema" className="mt-6">
        <TopicProgressTable data={topicProgress} />
      </Card>
    </PageContainer>
  );
}