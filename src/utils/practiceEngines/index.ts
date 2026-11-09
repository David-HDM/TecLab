import type { PracticeEngine } from "../../types/practice";
import { dslEngine } from "./dslEngine";
import { proxmoxEngine } from "./proxmoxEngine";
import { sshEngine } from "./sshEngine";

/** La clave es el `id` de la práctica en catalog.ts */
export const engines: Record<string, PracticeEngine> = {
  dsl: dslEngine,
  ssh: sshEngine,
  proxmox: proxmoxEngine,
};
