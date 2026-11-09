import type { DeviceState, EngineResult, PracticeEngine, TerminalLine } from "../../types/practice";
import { err, isPrefix, muted, normalize, ok, out, parseGigabit, sep, syslog } from "./helpers";

const TOTAL = 8;

const HINTS: Record<number, string> = {
  1: "Inicia asignando el nombre del router con `hostname Router2911`.",
  2: "Entra a la interfaz GigabitEthernet0/0 para asignar la IP WAN pública del nodo ITSSLP: `interface gigabitEthernet 0/0`.",
  3: "Asigna la IP WAN: `ip address 172.168.173.81 255.255.255.0` y activa `ip nat outside`.",
  4: "Entra a la interfaz LAN conectada al puente `vmbr0` de Proxmox: `interface gigabitEthernet 0/1`.",
  5: "Asigna la IP LAN del Gateway: `ip address 192.168.100.1 255.255.255.0` y activa `ip nat inside`.",
  6: "Escribe `exit` y configura la ruta por defecto: `ip route 0.0.0.0 0.0.0.0 172.168.173.1`.",
  7: "¡Excelente! Ahora crea la Access List para la red Proxmox: `access-list 1 permit 192.168.100.0 0.0.0.255`.",
  8: "Lista de acceso creada. Ahora activa el NAT Overload: `ip nat inside source list 1 interface GigabitEthernet0/0 overload`.",
};

const FINAL =
  "🎉 **¡Felicidades!** La infraestructura Proxmox VE / Cisco 2911 está completamente configurada y lista para dar salida a Internet a las MVs.";

const WAN_IP = "ip address 172.168.173.81 255.255.255.0";
const LAN_IP = "ip address 192.168.100.1 255.255.255.0";
const DEFAULT_ROUTE = "ip route 0.0.0.0 0.0.0.0 172.168.173.1";
const ACL = "access-list 1 permit 192.168.100.0 0.0.0.255";
const PAT_PREFIX = "ip nat inside source list 1 interface";

const isPat = (tokens: string[]): boolean =>
  tokens.length >= 9 &&
  tokens.slice(0, 7).join(" ") === PAT_PREFIX &&
  tokens[tokens.length - 1] === "overload" &&
  parseGigabit(tokens.slice(7, -1)) === "0/0";

export const proxmoxEngine: PracticeEngine = {
  totalObjectives: TOTAL,

  createDevice: () => ({
    mode: "config", // config | config-if (la práctica inicia en configuración global)
    host: "Router2911",
    currentInt: "",
    wanIp: false,
    wanNat: false,
    lanIp: false,
    lanNat: false,
    route: false,
    acl: false,
    pat: false,
  }),

  banner: [
    out("Cisco IOS Software, C2900 Software (C2900-UNIVERSALK9-M), Version 15.1(4)M4"),
    muted("Inicia la configuración técnica de la infraestructura Proxmox."),
    out("Router2911# configure terminal"),
    out("Enter configuration commands, one per line. End with CNTL/Z."),
    sep(),
  ],

  prompt: (d) => (d.mode === "config-if" ? `${d.host}(config-if)#` : `${d.host}(config)#`),

  run(current, input, done) {
    const raw = input.trim();
    const n = normalize(raw);
    const tokens = n.split(" ");
    const cmd = tokens[0];
    const d: DeviceState = { ...current };
    const completed: number[] = [];

    if (cmd === "clear" || cmd === "cls") return { device: d, lines: [], completed: [], clear: true };

    // Los pasos 3 y 5 se cumplen cuando la interfaz tiene IP y NAT configurados
    const finish = (lines: TerminalLine[] = []): EngineResult => {
      if (d.wanIp && d.wanNat && !done.includes(3) && !completed.includes(3)) completed.push(3);
      if (d.lanIp && d.lanNat && !done.includes(5) && !completed.includes(5)) completed.push(5);
      return { device: d, lines, completed };
    };

    const inIf = d.mode === "config-if";
    const int = String(d.currentInt);

    /* ---- Comandos globales (válidos en config y en config-if, como en IOS) ---- */
    if (cmd === "hostname") {
      const name = raw.split(/\s+/)[1];
      if (!name) return finish([err("% Incomplete command.")]);
      d.host = name;
      d.mode = "config";
      completed.push(1);
      return finish();
    }

    if (isPrefix(cmd, "interface", 3) && tokens.length > 1) {
      const num = parseGigabit(tokens.slice(1));
      if (num === "0/0" || num === "0/1") {
        d.mode = "config-if";
        d.currentInt = `g${num}`;
        completed.push(num === "0/0" ? 2 : 4);
        return finish();
      }
      return finish([err("% Invalid command in global config mode.")]);
    }

    if (n === DEFAULT_ROUTE) {
      d.mode = "config";
      d.route = true;
      completed.push(6);
      return finish();
    }

    if (n === ACL) {
      d.mode = "config";
      d.acl = true;
      completed.push(7);
      return finish();
    }

    if (isPat(tokens)) {
      d.mode = "config";
      d.pat = true;
      completed.push(8);
      return finish([ok("% PAT Overload activated successfully.")]);
    }

    if (cmd === "exit") {
      if (inIf) {
        d.mode = "config";
        d.currentInt = "";
        return finish();
      }
      return finish([err("% Invalid command in global config mode.")]);
    }

    /* ---- Comandos de interfaz ---- */
    if (inIf) {
      if (n === WAN_IP && int === "g0/0") {
        d.wanIp = true;
        return finish([out("% Interface GigabitEthernet0/0, IP address assigned.")]);
      }
      if (n === "ip nat outside" && int === "g0/0") {
        d.wanNat = true;
        return finish([out("% NAT Outside enabled on GigabitEthernet0/0.")]);
      }
      if (n === LAN_IP && int === "g0/1") {
        d.lanIp = true;
        return finish([out("% Interface GigabitEthernet0/1, IP address assigned.")]);
      }
      if (n === "ip nat inside" && int === "g0/1") {
        d.lanNat = true;
        return finish([out("% NAT Inside enabled on GigabitEthernet0/1.")]);
      }
      if (cmd === "no" && isPrefix(tokens[1], "shutdown", 2)) {
        return finish([syslog(`%LINK-3-UPDOWN: Interface GigabitEthernet${int.slice(1)}, changed state to up`)]);
      }
      return finish([muted("% Command executed in interface mode.")]);
    }

    return finish([err("% Invalid command in global config mode.")]);
  },

  feedback(done) {
    for (let i = 1; i <= TOTAL; i++) if (!done.includes(i)) return HINTS[i];
    return FINAL;
  },

  isComplete: (done) => done.length >= TOTAL,
};
