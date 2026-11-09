import type { DeviceState, EngineResult, PracticeEngine, TerminalLine } from "../../types/practice";
import { err, isPrefix, muted, normalize, out, parseGigabit, sep, syslog } from "./helpers";

const DHCP_IP = "8.8.8.10";
const DHCP_DELAY_MS = 1200;
const TOTAL = 6;

const HINTS: Record<number, string> = {
  1: "Inicia la configuración del router ingresando al modo privilegiado con `enable`.",
  2: "¡Bien! Ahora entra a la configuración global con `configure terminal`.",
  3: "Asigna un nombre al router con `hostname TecSup`.",
  4: "Selecciona la interfaz GigabitEthernet 0/1 conectada al módem DSL: `interface gigabitEthernet 0/1`.",
  5: "Enciende la interfaz física con el comando `no shutdown`.",
  6: "¡Excelente! Ahora solicita la dirección IP al proveedor DSL mediante DHCP: `ip address dhcp`.",
};

const FINAL =
  "🎉 **¡Felicidades!** Has completado la práctica. El router recibió su IP pública por DSL y registró la ruta por defecto en la tabla de enrutamiento.";

const result = (device: DeviceState, lines: TerminalLine[] = [], completed: number[] = [], clear = false): EngineResult => ({
  device,
  lines,
  completed,
  clear: clear || undefined,
});

function show(d: DeviceState, tokens: string[]): TerminalLine[] {
  const ip = String(d.ip);

  if (tokens[1] === "ip" && isPrefix(tokens[2], "interface", 3) && isPrefix(tokens[3], "brief", 1)) {
    const ipDisp = ip || "unassigned";
    const stDisp = d.up ? "up" : "administratively down";
    const protoDisp = d.up && ip ? "up" : "down";
    return [
      out("Interface              IP-Address      OK? Method Status                  Protocol"),
      out("GigabitEthernet0/0     192.168.1.1     YES manual up                      up"),
      out(`GigabitEthernet0/1     ${ipDisp.padEnd(15)} YES DHCP   ${stDisp.padEnd(23)} ${protoDisp}`),
    ];
  }

  if (tokens[1] === "ip" && isPrefix(tokens[2], "route", 2)) {
    if (ip) {
      return [
        out("Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP"),
        out("Gateway of last resort is 8.8.8.1 to network 0.0.0.0"),
        out("S*   0.0.0.0/0 [254/0] via 8.8.8.1"),
        out("C    192.168.1.0/24 is directly connected, GigabitEthernet0/0"),
        out("C    8.8.8.0/24 is directly connected, GigabitEthernet0/1"),
      ];
    }
    return [
      out("Codes: C - connected, S - static"),
      out("Gateway of last resort is not set"),
      out("C    192.168.1.0/24 is directly connected, GigabitEthernet0/0"),
    ];
  }

  return [err("% Invalid show subcommand.")];
}

export const dslEngine: PracticeEngine = {
  totalObjectives: TOTAL,

  createDevice: () => ({
    mode: "user", // user | priv | config | config-if
    host: "TecSUp",
    currentInt: "",
    up: false,
    dhcp: false,
    ip: "",
    dhcpPending: false,
  }),

  banner: [
    out("Cisco IOS Software, C2900 Software (C2900-UNIVERSALK9-M), Version 15.1(4)M4, RELEASE SOFTWARE (fc1)"),
    out("Technical Support: http://www.cisco.com/techsupport"),
    out("Copyright (c) 1986-2026 by Cisco Systems, Inc."),
    muted("Presiona Enter para iniciar o escribe comandos. Soporta alias ('en', 'conf t', 'int g0/1', 'no sh')."),
    sep(),
  ],

  prompt: (d) => {
    const h = String(d.host);
    switch (d.mode) {
      case "user":
        return `${h}>`;
      case "priv":
        return `${h}#`;
      case "config":
        return `${h}(config)#`;
      default:
        return `${h}(config-if)#`;
    }
  },

  run(current, input) {
    const raw = input.trim();
    const tokens = normalize(raw).split(" ");
    const cmd = tokens[0];
    const d: DeviceState = { ...current };

    if (cmd === "clear" || cmd === "cls") return result(d, [], [], true);

    switch (d.mode) {
      case "user": {
        if (isPrefix(cmd, "enable", 2)) {
          d.mode = "priv";
          return result(d, [], [1]);
        }
        return result(d, [err("% Unknown command or computer name, or unable to find address string.")]);
      }

      case "priv": {
        if (isPrefix(cmd, "configure", 4) && isPrefix(tokens[1], "terminal", 1)) {
          d.mode = "config";
          return result(d, [], [2]);
        }
        if (cmd === "disable") {
          d.mode = "user";
          return result(d);
        }
        if (isPrefix(cmd, "show", 2)) return result(d, show(d, tokens));
        return result(d, [err("% Invalid command in privileged mode.")]);
      }

      case "config": {
        if (cmd === "exit") {
          d.mode = "priv";
          return result(d);
        }
        if (cmd === "hostname") {
          const name = raw.split(/\s+/)[1];
          if (!name) return result(d, [err("% Incomplete command.")]);
          d.host = name;
          return result(d, [], [3]);
        }
        if (isPrefix(cmd, "interface", 3) && tokens.length > 1 && parseGigabit(tokens.slice(1)) === "0/1") {
          d.mode = "config-if";
          d.currentInt = "g0/1";
          return result(d, [], [4]);
        }
        return result(d, [err("% Invalid command in global config mode.")]);
      }

      default: {
        // config-if
        if (cmd === "exit") {
          d.mode = "config";
          return result(d);
        }
        if (cmd === "no" && isPrefix(tokens[1], "shutdown", 2)) {
          d.up = true;
          return result(
            d,
            [
              syslog("%LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to up"),
              syslog("%LINEPROTO-5-UPSTATUS: Line protocol on Interface GigabitEthernet0/1, changed state to up"),
            ],
            [5]
          );
        }
        if (cmd === "shutdown") {
          d.up = false;
          return result(d, [syslog("%LINK-5-CHANGED: Interface GigabitEthernet0/1, changed state to administratively down")]);
        }
        if (cmd === "ip" && isPrefix(tokens[1], "address", 2) && tokens[2] === "dhcp") {
          if (!d.up) return result(d, [err("% Interface must be up before enabling DHCP.")]);
          d.dhcp = true;
          if (!d.ip) d.dhcpPending = true; // la IP llega con retraso (ver onTimer)
          return result(d, [], [6]);
        }
        return result(d, [err("% Invalid command in interface config mode.")]);
      }
    }
  },

  timer: (d) => (d.dhcpPending ? DHCP_DELAY_MS : null),

  onTimer(current) {
    const d: DeviceState = { ...current, ip: DHCP_IP, dhcpPending: false };
    return result(d, [
      syslog(`%DHCP-6-ADDRESS_ASSIGN: Interface GigabitEthernet0/1 assigned DHCP address ${DHCP_IP} 255.255.255.0`),
    ]);
  },

  feedback(done, d) {
    if (d.ip) return FINAL;
    for (let i = 1; i <= TOTAL; i++) if (!done.includes(i)) return HINTS[i];
    return HINTS[TOTAL];
  },

  isComplete: (done, d) => done.length >= TOTAL && !!d.ip,
};
