import { useEffect } from "react";
import {
  Background,
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  getBezierPath,
  Handle,
  Position,
  ReactFlow,
  useNodesState,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */
// OJO: React Flow exige `type` (no `interface`) para los datos de nodos y aristas
export type DeviceBadge = { label: string; ok: boolean };

export type DeviceData = {
  sigla: string;
  nombre: string;
  detalle: string;
  /** Color del texto de la sigla (clase de Tailwind) */
  iconClass: string;
  /** Equipo configurado/en línea: se resalta en verde */
  active: boolean;
  badges?: DeviceBadge[];
};
export type DeviceNodeType = Node<DeviceData, "device">;

export type PacketEdgeData = { active: boolean; label?: string };
export type PacketEdgeType = Edge<PacketEdgeData, "packet">;

/* ------------------------------------------------------------------ */
/* Nodo: equipo de red                                                 */
/* ------------------------------------------------------------------ */
// Handles invisibles en los 4 lados para poder enlazar la topología en forma de "S"
const HANDLE_STYLE = { opacity: 0, width: 6, height: 6 };

function DeviceNode({ data }: NodeProps<DeviceNodeType>) {
  return (
    <div
      className={`flex w-28 flex-col items-center rounded-lg border p-2.5 text-center text-xs transition-colors ${
        data.active
          ? "border-emerald-700/70 bg-slate-800 shadow-[0_0_14px_rgba(16,185,129,0.25)]"
          : "border-slate-700 bg-slate-800/80"
      }`}
    >
      <Handle id="tl" type="target" position={Position.Left} style={HANDLE_STYLE} />
      <Handle id="sl" type="source" position={Position.Left} style={HANDLE_STYLE} />
      <Handle id="tr" type="target" position={Position.Right} style={HANDLE_STYLE} />
      <Handle id="sr" type="source" position={Position.Right} style={HANDLE_STYLE} />
      <Handle id="tt" type="target" position={Position.Top} style={HANDLE_STYLE} />
      <Handle id="sb" type="source" position={Position.Bottom} style={HANDLE_STYLE} />

      <div
        className={`mb-1 flex h-8 min-w-8 items-center justify-center rounded bg-slate-700 px-1 text-[11px] font-bold ${data.iconClass}`}
      >
        {data.sigla}
      </div>
      <span className="font-medium text-slate-200">{data.nombre}</span>
      <span className="text-[10px] text-slate-400">{data.detalle}</span>

      {data.badges && data.badges.length > 0 && (
        <div className="mt-1.5 flex flex-wrap justify-center gap-1">
          {data.badges.map((b) => (
            <span
              key={b.label}
              className={`rounded border px-1.5 py-0.5 text-[9px] font-medium ${
                b.ok
                  ? "border-emerald-800 bg-emerald-950/80 text-emerald-300"
                  : "border-slate-700 bg-slate-900 text-slate-500"
              }`}
            >
              {b.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Arista: enlace con paquete animado cuando está activo                */
/* ------------------------------------------------------------------ */
function PacketEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<PacketEdgeType>) {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const active = !!data?.active;

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke: active ? "#10b981" : "#475569",
          strokeWidth: 2,
          strokeDasharray: active ? undefined : "5 4",
        }}
      />
      {active && (
        <circle r="3.5" fill="#34d399">
          <animateMotion dur="1.8s" repeatCount="indefinite" path={path} />
        </circle>
      )}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "none",
            }}
            className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[9px] font-medium text-slate-400"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

// Fuera del componente: si se crean dentro, React Flow los recrea en cada render
const nodeTypes = { device: DeviceNode };
const edgeTypes = { packet: PacketEdge };

/* ------------------------------------------------------------------ */
/* Ayudas para armar topologías de 4 equipos en forma de "S"            */
/*   1 → 2                                                             */
/*       ↓                                                             */
/*   4 ← 3                                                             */
/* ------------------------------------------------------------------ */
const SNAKE = [
  { x: 0, y: 0 },
  { x: 170, y: 0 },
  { x: 170, y: 150 },
  { x: 0, y: 150 },
];

export function deviceNode(id: string, slot: 0 | 1 | 2 | 3, data: DeviceData): DeviceNodeType {
  return { id, type: "device", position: { ...SNAKE[slot] }, data };
}

export function snakeEdges(
  ids: [string, string, string, string],
  links: [PacketEdgeData, PacketEdgeData, PacketEdgeData]
): PacketEdgeType[] {
  const handles = [
    ["sr", "tl"], // 1 → 2: sale por la derecha, entra por la izquierda
    ["sb", "tt"], // 2 → 3: sale por abajo, entra por arriba
    ["sl", "tr"], // 3 → 4: sale por la izquierda, entra por la derecha
  ] as const;

  return handles.map(([sourceHandle, targetHandle], i) => ({
    id: `e${i + 1}`,
    type: "packet" as const,
    source: ids[i],
    target: ids[i + 1],
    sourceHandle,
    targetHandle,
    data: links[i],
  }));
}

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */
interface NetworkTopologyProps {
  nodes: DeviceNodeType[];
  edges: PacketEdgeType[];
  height?: number;
}

export default function NetworkTopology({ nodes: nodesProp, edges, height = 290 }: NetworkTopologyProps) {
  // El estado interno conserva las posiciones que el usuario arrastra;
  // cuando cambia la práctica solo se actualizan los datos (estado/badges) de cada nodo.
  const [nodes, setNodes, onNodesChange] = useNodesState<DeviceNodeType>(nodesProp);

  useEffect(() => {
    setNodes((current) =>
      nodesProp.map((n) => {
        const prev = current.find((c) => c.id === n.id);
        return prev ? { ...n, position: prev.position } : n;
      })
    );
  }, [nodesProp, setNodes]);

  return (
    <div style={{ height }} className="overflow-hidden rounded-lg border border-slate-800">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        nodesConnectable={false}
        zoomOnScroll={false}
        preventScrolling={false}
        minZoom={0.5}
        maxZoom={1.5}
        colorMode="dark"
        style={{ background: "#020617" }}
      >
        <Background gap={16} color="#1e293b" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
