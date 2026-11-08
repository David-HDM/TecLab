import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import ProgressChart from "../components/dashboard/ProgressChart";
import ScoreHistoryChart from "../components/dashboard/ScoreHistoryChart";
import TopicProgressTable from "../components/dashboard/TopicProgressTable";
import { useAuth } from "../hooks/useAuth";
import { scoreHistory, topicProgress } from "../data/catalog";
import DesplegableFiltro from "../components/ui/DesplegableFiltro";
import { LABORATORIOS, NIVELES } from "../config/constants";
import { useState } from "react";
import Button from "../components/ui/Button";

export default function Dashboard() {
  const { user } = useAuth();
  const overall = Math.round(topicProgress.reduce((s, t) => s + t.progreso, 0) / topicProgress.length);
  const [ laboratorio, setLaboratorio ] = useState("");
  const [ niveltema, setNiveltema ] = useState("");
  const [ tema, setTema ] = useState("");
  const [ practica, setPractica ] = useState("");

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-blue-900">Hola, {user?.nombre}</h1>
      <p className="mt-1 text-gray-600">Aquí tienes un resúmen de tu progreso.</p>

      <DesplegableFiltro
        id="laboratorio"
        defaultValue=""
        className="mt-8"
        onChange={(e) => setLaboratorio(e.target.value)}
      >
        <option value="" disabled>
          Seleccionar Laboratorio
        </option>
        {LABORATORIOS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </DesplegableFiltro>

      { !laboratorio ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <h1>Para mostrar tus estadísticas, selecciona un Laboratorio arriba.</h1>
        </div>
       ) : (
        <div>

          <Card className="mt-6">
            <ProgressBar value={overall} label="Progreso general" />
          </Card>

            <Card title="Progreso por Tema" className="mt-4">

              <label htmlFor="niveles">Nivel:</label>
              <DesplegableFiltro
                id="niveles"
                defaultValue=""
                onChange={(e) => setNiveltema(e.target.value)}
                className="mt-2 mb-4 ml-2"
              >
                <option value="" >
                  Todos los niveles
                </option>
                {NIVELES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </DesplegableFiltro>
              <ProgressChart data={topicProgress} />
            </Card>
            
            

            <Card title="Progreso de Prácticas" className="mt-4">
              <label htmlFor="temas">Tema:</label>
              <DesplegableFiltro
                id="temas"
                defaultValue=""
                onChange={(e) => setTema(e.target.value)}
                className="mt-2 mb-4 ml-2"
              >
                <option value="" >
                  Selecciona un Tema
                </option>
                {NIVELES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </DesplegableFiltro>
              { tema ? 

                <ProgressChart data={topicProgress} /> 
                
                :
                
                <h3 className="text-center mt-4 mb-4">No has seleccionado un Tema</h3>

              }
              
              
            </Card>

            { tema ? (

              <Card title="Historial de Quiz" className="mt-4">
                <label htmlFor="practicas">Práctica:</label>
                <DesplegableFiltro
                  id="practicas"
                  defaultValue=""
                  onChange={(e) => setPractica(e.target.value)}
                  className="mt-2 mb-4 ml-2"
                >
                  <option value="" >
                    Última realizada
                  </option>
                  {NIVELES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </DesplegableFiltro>
                <Button className="ml-4">Ir a Práctica</Button>
              <div className="flex flex-row gap-4">
                <ScoreHistoryChart data={scoreHistory} />
                <TopicProgressTable data={topicProgress} />
              </div>
              </Card>
            ) : (
              <></>
            )
            }
        </div>
      )}
    </PageContainer>
  );
}