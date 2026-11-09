import type { DeviceState, EngineResult, PracticeEngine, TerminalLine } from "../../types/practice";
import { err, muted, normalize, ok, out, sep, warn } from "./helpers";

const TOTAL = 5;

const HINTS: Record<number, string> = {
  1: "Comienza actualizando los repositorios e instalando el paquete `openssh-server`.",
  2: "¡Excelente! Ahora verifica si el servicio está activo con `sudo systemctl status ssh`.",
  3: "El servicio está corriendo. Permite el tráfico SSH en el firewall: `sudo ufw allow ssh`.",
  4: "Regla agregada. Ahora habilita el firewall ejecutando `sudo ufw enable`.",
  5: "¡Muy bien! Por último consulta la IP de tu MV ejecutando `ip a`.",
};

const FINAL =
  "🎉 **¡Práctica SSH Completada!** Ya puedes conectarte desde tu Mac ejecutando: `ssh ubuntu@192.168.100.50`.";

const result = (device: DeviceState, lines: TerminalLine[] = [], completed: number[] = [], clear = false): EngineResult => ({
  device,
  lines,
  completed,
  clear: clear || undefined,
});

const APT_UPDATE = /^(sudo )?apt(-get)? update$/;
const APT_INSTALL = /\bapt(-get)? install\b/;
const STATUS = /^(sudo )?systemctl status (ssh|sshd|ssh\.service)$/;
const UFW_ALLOW_SSH = /^(sudo )?ufw allow (ssh|openssh|22|22\/tcp)$/;
const UFW_ALLOW_PORT = /^(sudo )?ufw allow \d+(\/(tcp|udp))?$/;
const UFW_ENABLE = /^(sudo )?ufw enable$/;
const IP_ADDR = /^ip (a|addr|address)$/;

export const sshEngine: PracticeEngine = {
  totalObjectives: TOTAL,

  createDevice: () => ({
    sshInstalled: false,
    ufwAllowed: false,
    ufwEnabled: false,
  }),

  banner: [
    out("Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-31-generic x86_64)"),
    muted("Inicia la instalación de OpenSSH Server."),
    sep(),
  ],

  prompt: () => "ubuntu@vm:~$",

  run(current, input, done) {
    const raw = input.trim();
    const n = normalize(raw);
    const d: DeviceState = { ...current };

    if (n === "clear" || n === "cls") return result(d, [], [], true);

    // 1. Instalar OpenSSH Server (con o sin `apt update` previo)
    if (APT_INSTALL.test(n) && n.includes("openssh-server")) {
      const lines: TerminalLine[] = [];
      if (/\bapt(-get)? update\b/.test(n)) {
        lines.push(out("Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease"), out("Reading package lists... Done"));
      }
      lines.push(
        out("Setting up openssh-server (1:9.6p1-3ubuntu13)..."),
        out("Processing triggers for systemd (255.4-1ubuntu8)...")
      );
      d.sshInstalled = true;
      return result(d, lines, [1]);
    }

    if (APT_UPDATE.test(n)) {
      return result(d, [out("Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease"), out("Reading package lists... Done")]);
    }

    // 2. Verificar el servicio
    if (STATUS.test(n)) {
      if (!d.sshInstalled) return result(d, [err("Unit ssh.service could not be found.")]);
      return result(
        d,
        [
          ok("● ssh.service - OpenSSH server daemon"),
          out("     Loaded: loaded (/usr/lib/systemd/system/ssh.service; enabled)"),
          ok("     Active: active (running) since Tue 2026-10-27 12:00:00 CST; 5min ago"),
        ],
        [2]
      );
    }

    // 3. Permitir SSH en UFW
    if (UFW_ALLOW_SSH.test(n)) {
      d.ufwAllowed = true;
      return result(d, [out("Rules updated"), out("Rules updated (v6)")], [3]);
    }
    if (UFW_ALLOW_PORT.test(n)) {
      return result(d, [out("Rules updated"), out("Rules updated (v6)")]);
    }

    // 4. Activar UFW (solo si SSH ya fue permitido)
    if (UFW_ENABLE.test(n)) {
      if (!d.ufwAllowed) {
        return result(d, [err("Debes permitir la regla SSH antes de habilitar UFW para evitar bloqueos.")]);
      }
      d.ufwEnabled = true;
      return result(
        d,
        [
          out("Command may disrupt existing ssh connections. Proceed with operation (y|n)? y"),
          ok("Firewall is active and enabled on system startup"),
        ],
        [4]
      );
    }

    // 5. Consultar la IP
    if (IP_ADDR.test(n)) {
      return result(
        d,
        [
          out("1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN"),
          out("2: enp18: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP"),
          warn("    inet 192.168.100.50/24 brd 192.168.100.255 scope global enp18"),
        ],
        done.includes(5) ? [] : [5]
      );
    }

    return result(d, [err(`bash: ${raw.split(/\s+/)[0]}: command not found`)]);
  },

  feedback(done) {
    for (let i = 1; i <= TOTAL; i++) if (!done.includes(i)) return HINTS[i];
    return FINAL;
  },

  isComplete: (done) => done.length >= TOTAL,
};
