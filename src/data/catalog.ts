import type { Topic, TopicProgress } from "../types/topic";
import type { Practice } from "../types/practice";
import type { Question } from "../types/quiz";

export const topics: Topic[] = [
  { id: "modelo-osi", titulo: "Modelo OSI", descripcion: "Las siete capas y sus funciones." },
  { id: "direccionamiento-ip", titulo: "Direccionamiento IP y subredes", descripcion: "Clases, máscaras y cálculo de subredes." },
  { id: "enrutamiento", titulo: "Enrutamiento", descripcion: "Tablas de rutas y reenvío de paquetes." },
  { id: "dns", titulo: "DNS", descripcion: "Resolución de nombres y tipos de registros." },
];

export const practices: Practice[] = [
  { id: "subnetting", topicId: "direccionamiento-ip", titulo: "Subredes paso a paso", descripcion: "Calcula red, broadcast y rango de hosts." },
  { id: "routing", topicId: "enrutamiento", titulo: "Topología y enrutamiento", descripcion: "Arma una red y envía un paquete entre nodos." },
  { id: "dns", topicId: "dns", titulo: "Consultas DNS y geolocalización", descripcion: "Resuelve dominios reales y ubícalos en un mapa." },
];

export const questions: Question[] = [
  {
    id: "osi-1", topicId: "modelo-osi", concepto: "Capas del modelo OSI",
    enunciado: "¿Cuántas capas tiene el modelo OSI?",
    opciones: ["4", "5", "7", "9"], correcta: 2,
    explicacion: "El modelo OSI define siete capas, de Física a Aplicación.",
  },
  {
    id: "osi-2", topicId: "modelo-osi", concepto: "Capa de transporte",
    enunciado: "¿En qué capa operan TCP y UDP?",
    opciones: ["Red", "Transporte", "Enlace de datos", "Sesión"], correcta: 1,
    explicacion: "TCP y UDP son protocolos de la capa de Transporte (capa 4).",
  },
  {
    id: "ip-1", topicId: "direccionamiento-ip", concepto: "Máscara de subred",
    enunciado: "¿Cuántos hosts utilizables tiene una red /24?",
    opciones: ["256", "254", "255", "252"], correcta: 1,
    explicacion: "2^8 = 256 direcciones, menos la de red y la de broadcast: 254.",
  },
  {
    id: "ip-2", topicId: "direccionamiento-ip", concepto: "Direcciones privadas",
    enunciado: "¿Cuál es una dirección IP privada?",
    opciones: ["8.8.8.8", "172.32.0.1", "192.168.1.10", "200.10.5.4"], correcta: 2,
    explicacion: "192.168.0.0/16 es un rango privado definido en la RFC 1918.",
  },
  {
    id: "rt-1", topicId: "enrutamiento", concepto: "Ruta por defecto",
    enunciado: "¿Qué destino representa la ruta por defecto en IPv4?",
    opciones: ["127.0.0.0/8", "0.0.0.0/0", "255.255.255.255/32", "10.0.0.0/8"], correcta: 1,
    explicacion: "0.0.0.0/0 coincide con cualquier destino sin una ruta más específica.",
  },
  {
    id: "rt-2", topicId: "enrutamiento", concepto: "Selección de ruta",
    enunciado: "Si dos rutas coinciden con un destino, ¿cuál elige el router?",
    opciones: ["La de prefijo más corto", "La de prefijo más largo", "La más antigua", "La primera de la tabla"], correcta: 1,
    explicacion: "Gana la coincidencia de prefijo más largo (longest prefix match).",
  },
  {
    id: "dns-1", topicId: "dns", concepto: "Registros DNS",
    enunciado: "¿Qué registro DNS asocia un nombre con una dirección IPv4?",
    opciones: ["MX", "CNAME", "A", "NS"], correcta: 2,
    explicacion: "El registro A asocia un nombre de dominio con una dirección IPv4.",
  },
  {
    id: "dns-2", topicId: "dns", concepto: "Registros de correo",
    enunciado: "¿Qué registro indica los servidores de correo de un dominio?",
    opciones: ["TXT", "MX", "PTR", "AAAA"], correcta: 1,
    explicacion: "Los registros MX definen los servidores que reciben el correo del dominio.",
  },
];

export const topicProgress: TopicProgress[] = [
  { topicId: "modelo-osi", titulo: "Modelo OSI", progreso: 100, mejorPuntaje: 90 },
  { topicId: "direccionamiento-ip", titulo: "Direccionamiento IP", progreso: 60, mejorPuntaje: 70 },
  { topicId: "enrutamiento", titulo: "Enrutamiento", progreso: 30, mejorPuntaje: null },
  { topicId: "dns", titulo: "DNS", progreso: 0, mejorPuntaje: null },
];

export const scoreHistory = [
  { fecha: "01/10", puntaje: 50 },
  { fecha: "08/10", puntaje: 65 },
  { fecha: "15/10", puntaje: 70 },
  { fecha: "22/10", puntaje: 85 },
  { fecha: "29/10", puntaje: 90 },
];