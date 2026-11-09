import { useMemo } from "react";
import PracticeShell from "./PracticeShell";
import NetworkTopology, { deviceNode, snakeEdges } from "./NetworkTopology";
import type { TerminalTheme } from "./Terminal";
import { usePracticeSession } from "../../hooks/usePracticeSession";
import type { DeviceState, Practice } from "../../types/practice";

const THEME: TerminalTheme = {
  dot: "bg-purple-500",
  out: "text-slate-300",
  prompt: "text-purple-400",
  input: "text-slate-100",
};

/** Mac (cliente) → Proxmox VE → firewall UFW → MV Ubuntu Server */
function buildTopology(d: DeviceState, ipSeen: boolean) {
  const installed = d.sshInstalled === true;
  const allowed = d.ufwAllowed === true;
  const enabled = d.ufwEnabled === true;
  const ready = installed && allowed; // el tráfico SSH ya puede llegar a la MV

  const nodes = [
    deviceNode("mac", 0, {
      sigla: "Mac",
      nombre: "Cliente SSH",
      detalle: "macOS · Terminal",
      iconClass: "text-slate-200",
      active: ready,
    }),
    deviceNode("pve", 1, {
      sigla: "PVE",
      nombre: "Proxmox VE",
      detalle: "Dell PowerEdge R820",
      iconClass: "text-amber-400",
      active: ready,
    }),
    deviceNode("ufw", 2, {
      sigla: "UFW",
      nombre: "Firewall",
      detalle: "Puerto 22/tcp",
      iconClass: "text-rose-400",
      active: allowed,
      badges: [
        { label: "allow 22", ok: allowed },
        { label: "activo", ok: enabled },
      ],
    }),
    deviceNode("vm", 3, {
      sigla: "VM",
      nombre: "ubuntu-server",
      detalle: "Ubuntu 24.04 LTS",
      iconClass: "text-purple-400",
      active: installed,
      badges: [
        { label: "openssh-server", ok: installed },
        { label: ipSeen ? "192.168.100.50" : "IP ?", ok: ipSeen },
      ],
    }),
  ];

  const edges = snakeEdges(
    ["mac", "pve", "ufw", "vm"],
    [
      { active: ready, label: "SSH :22" },
      { active: ready, label: "vmbr0" },
      { active: ready, label: "enp18" },
    ]
  );

  return { nodes, edges };
}

export default function SshPractice({ practice }: { practice: Practice }) {
  const lab = usePracticeSession(practice.id);
  const { device, completed } = lab.session;
  const ipSeen = completed.includes(5);
  const { nodes, edges } = useMemo(() => buildTopology(device, ipSeen), [device, ipSeen]);

  return (
    <PracticeShell
      practice={practice}
      lab={lab}
      theme={THEME}
      topology={<NetworkTopology nodes={nodes} edges={edges} />}
    />
  );
}
