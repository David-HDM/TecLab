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

/** MVs → puente vmbr0 de Proxmox → Router 2911 → Internet (el sentido del tráfico de salida) */
function buildTopology(d: DeviceState) {
  const wan = d.wanIp === true && d.wanNat === true;
  const lan = d.lanIp === true && d.lanNat === true;

  const nodes = [
    deviceNode("vms", 0, {
      sigla: "VM",
      nombre: "MVs Ubuntu",
      detalle: "192.168.100.0/24",
      iconClass: "text-purple-400",
      active: lan,
    }),
    deviceNode("pve", 1, {
      sigla: "PVE",
      nombre: "Proxmox VE",
      detalle: "vmbr0 · R820",
      iconClass: "text-amber-400",
      active: lan,
    }),
    deviceNode("router", 2, {
      sigla: "C2911",
      nombre: String(d.host),
      detalle: "Cisco 2911 ISR",
      iconClass: "text-emerald-400",
      active: wan || lan,
      badges: [
        { label: "WAN", ok: wan },
        { label: "LAN", ok: lan },
        { label: "Ruta", ok: d.route === true },
        { label: "ACL 1", ok: d.acl === true },
        { label: "PAT", ok: d.pat === true },
      ],
    }),
    deviceNode("isp", 3, {
      sigla: "ISP",
      nombre: "Internet",
      detalle: "GW 172.168.173.1",
      iconClass: "text-blue-400",
      active: d.route === true,
    }),
  ];

  const edges = snakeEdges(
    ["vms", "pve", "router", "isp"],
    [
      { active: lan, label: "vmbr0" },
      { active: lan, label: "G0/1 · LAN" },
      { active: wan, label: "G0/0 · WAN" },
    ]
  );

  return { nodes, edges };
}

export default function ProxmoxPractice({ practice }: { practice: Practice }) {
  const lab = usePracticeSession(practice.id);
  const device = lab.session.device;
  const { nodes, edges } = useMemo(() => buildTopology(device), [device]);

  return (
    <PracticeShell
      practice={practice}
      lab={lab}
      theme={THEME}
      topology={<NetworkTopology nodes={nodes} edges={edges} />}
    />
  );
}
