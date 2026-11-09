import { useMemo } from "react";
import PracticeShell from "./PracticeShell";
import NetworkTopology, { deviceNode, snakeEdges } from "./NetworkTopology";
import type { TerminalTheme } from "./Terminal";
import { usePracticeSession } from "../../hooks/usePracticeSession";
import type { DeviceState, Practice } from "../../types/practice";

const THEME: TerminalTheme = {
  dot: "bg-emerald-500",
  out: "text-emerald-400",
  prompt: "text-slate-300",
  input: "text-emerald-300",
};

/** Router CPE → módem DSL → DSLAM (nube del ISP) → servidor DNS */
function buildTopology(d: DeviceState) {
  const up = d.up === true;
  const ip = String(d.ip);
  const online = ip !== "";

  const nodes = [
    deviceNode("r1", 0, {
      sigla: "R1",
      nombre: String(d.host),
      detalle: "Router CPE",
      iconClass: "text-blue-400",
      active: up,
      badges: [
        { label: up ? "g0/1 up" : "g0/1 down", ok: up },
        { label: online ? `IP ${ip}` : "Sin IP", ok: online },
      ],
    }),
    deviceNode("modem", 1, {
      sigla: "DSL",
      nombre: "Módem",
      detalle: "Demarcación",
      iconClass: "text-emerald-400",
      active: online,
    }),
    deviceNode("dslam", 2, {
      sigla: "DSLAM",
      nombre: "Nube ISP",
      detalle: "Central Telefónica",
      iconClass: "text-purple-400",
      active: online,
    }),
    deviceNode("dns", 3, {
      sigla: "8.8.8.8",
      nombre: "DNS Server",
      detalle: "Servidor ISP",
      iconClass: "text-amber-400",
      active: online,
    }),
  ];

  const edges = snakeEdges(
    ["r1", "modem", "dslam", "dns"],
    [
      { active: up, label: "g0/1" },
      { active: online, label: "RJ-11" },
      { active: online, label: "Troncal ISP" },
    ]
  );

  return { nodes, edges };
}

export default function DslPractice({ practice }: { practice: Practice }) {
  const lab = usePracticeSession(practice.id);
  const device = lab.session.device;
  const { nodes, edges } = useMemo(() => buildTopology(device), [device]);
  const ip = String(device.ip);

  const badge = ip ? (
    <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
      <span className="h-2 w-2 rounded-full bg-emerald-400" />
      Enlace WAN: Activo (IP: {ip})
    </span>
  ) : (
    <span className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium text-amber-400">
      <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
      Enlace WAN: Inactivo (Sin IP)
    </span>
  );

  return (
    <PracticeShell
      practice={practice}
      lab={lab}
      theme={THEME}
      badge={badge}
      topology={<NetworkTopology nodes={nodes} edges={edges} />}
    />
  );
}
