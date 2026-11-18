import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Point {
  intento: number;
  fecha: string;
  puntaje: number;
}

export default function ScoreHistoryChart({ data }: { data: Point[] }) {
  return (
    <div className="w-full">
      <h3 className="mb-2 text-center text-sm font-semibold text-gray-700">
        Puntaje de la evaluación de reforzamiento
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="intento"
              tickFormatter={(value: number) => `#${value}`}
              tick={{ fontSize: 12 }}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={(label, payload) => {
                const point = payload[0]?.payload;
                return point ? `${point.fecha} · Intento #${label}` : `Intento #${label}`;
              }}
            />
            <Line type="monotone" dataKey="puntaje" name="Puntaje" stroke="#1B3A7A" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}