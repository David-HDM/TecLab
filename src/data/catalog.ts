import type { Topic, TopicProgress } from "../types/topic";
import type { Practice } from "../types/practice";
import type { Question } from "../types/quiz";
import type { Lab } from "../types/lab";

export const labs: Lab[] = [
  { id: "redes", titulo: "Redes y Telecomunicaciones", descripcion_corta: "Aquí aprenderás redes", imgOferta: "/labs/redes.jpg", imgDetalle: "/labs/detail/redes.jpg", estatus: "COMENZADO", descripcion_larga: "Espacio dedicado al diseño, configuración y análisis de redes de datos y sistemas de comunicación. Aquí el estudiante aprende cómo viajan los datos desde un dispositivo hasta su destino: direccionamiento IP y subredes, enrutamiento y conmutación, servicios como DNS y DHCP, seguridad perimetral, redes inalámbricas y principios de transmisión de señales. A través de prácticas guiadas y simulaciones, se arman topologías, se configuran equipos, se diagnostican fallas con herramientas de captura y monitoreo, y se comprenden los protocolos que sostienen internet. El objetivo es que el alumno desarrolle criterio técnico para planear, implementar y mantener infraestructuras de red confiables, escalables y seguras, tanto en entornos académicos como empresariales."},
  { id: "software", titulo: "Desarrollo de Software", descripcion_corta: "Aquí aprenderás herramientas de programación",imgOferta: "/labs/software.avif", imgDetalle: "/labs/detail/software.jpg", estatus: "SIN COMENZAR", descripcion_larga: "Espacio enfocado en el ciclo completo de creación de aplicaciones, desde el análisis de requerimientos hasta su puesta en marcha. Se practican la programación en distintos lenguajes y paradigmas, el diseño de estructuras de datos y algoritmos, el desarrollo web y móvil, el manejo de bases de datos, el consumo de servicios y APIs, el control de versiones y las pruebas de software. Se promueve el trabajo colaborativo con metodologías ágiles, buenas prácticas de código limpio y documentación. El objetivo es que el estudiante construya aplicaciones funcionales, mantenibles y seguras, y adquiera la experiencia necesaria para integrarse a equipos de desarrollo y resolver problemas reales con tecnología."},
  { id: "ia", titulo: "Inteligencia Artificial", descripcion_corta: "Aquí aprenderás a programar IAs",imgOferta: "/labs/ia.jpg", imgDetalle: "/labs/detail/ia.jpg", estatus: "SIN COMENZAR", descripcion_larga: "Espacio orientado al estudio y la aplicación de técnicas que permiten a las computadoras aprender, razonar y tomar decisiones a partir de datos. Se trabajan fundamentos como el aprendizaje automático supervisado y no supervisado, redes neuronales, visión por computadora, procesamiento de lenguaje natural y análisis de datos, además de la preparación, limpieza y evaluación de conjuntos de datos. Mediante proyectos prácticos, el estudiante entrena modelos, mide su desempeño, interpreta resultados y reflexiona sobre sus límites, sesgos y consideraciones éticas. El propósito es formar la capacidad de plantear problemas reales como tareas de aprendizaje, seleccionar herramientas adecuadas y construir soluciones inteligentes que puedan integrarse en aplicaciones y procesos del mundo real."},
  { id: "microcontroladores", titulo: "Microcontroladores y Electrónica", descripcion_corta: "Aquí aprenderás a programar microcontroladores", imgOferta: "/labs/micro.jpg", imgDetalle: "/labs/detail/micro.png", estatus: "SIN COMENZAR", descripcion_larga: "Espacio dedicado a conocer, construir y programar sistemas electrónicos que combinan hardware y software. Se estudian los componentes básicos de un circuito, la lectura de señales analógicas y digitales, el uso de sensores y actuadores, la comunicación entre dispositivos y la programación de microcontroladores para controlar procesos. Las prácticas incluyen el armado de circuitos en protoboard, la medición con instrumentos como multímetro y osciloscopio, la depuración de fallas y el desarrollo de pequeños sistemas embebidos. Su finalidad es que el alumno pase de la teoría al prototipo funcional, desarrollando habilidades para diseñar, probar y documentar soluciones electrónicas aplicables a automatización, instrumentación e internet de las cosas."},
];

export const topics: Topic[] = [
  { id: "modelo-osi", labId: "redes", titulo: "Modelo OSI", descripcion: "Las siete capas y sus funciones." },
  { id: "direccionamiento-ip", labId: "redes", titulo: "Direccionamiento IP y subredes", descripcion: "Clases, máscaras y cálculo de subredes." },
  { id: "enrutamiento", labId: "redes", titulo: "Enrutamiento", descripcion: "Tablas de rutas y reenvío de paquetes." },
  { id: "dns", labId: "redes", titulo: "DNS", descripcion: "Resolución de nombres y tipos de registros." },
  {
    id: "administracion",
    labId: "redes",
    titulo: "Administración de Sistemas",
    descripcion:
      "Configuración y seguridad de servicios en servidores Linux y máquinas virtuales.",
  },
  {
    id: "redesDatosAvanzadas",
    labId: "redes",
    titulo: "Redes de Datos Avanzadas",
    descripcion:
      "Enrutamiento, NAT y listas de acceso en routers Cisco con infraestructura virtualizada.",
  },
];

export const practices: Practice[] = [
  {
    id: "dsl",
    topicId: "enrutamiento",
    titulo: "Conectividad Banda Ancha DSL",
    descripcion: "Configuración de la interfaz WAN en el router CPE, multiplexor DSLAM y DHCP en Cisco IOS.",
    sigla: "DSL",
    color: "blue",
    modulo: "Módulo DSL",
    categoria: "Conmutación y Enrutamiento",
    tituloGuiado: "Práctica Guiada: Conectividad DSL en Cisco IOS",
    introduccion: "Sigue la secuencia técnica de comandos para configurar el router CPE de la sucursal.",
    tituloNota: "Nota Pedagógica:",
    consola: { titulo: "Terminal de Consola — Router TecSUp (Cisco IOS)", detalle: "Bauds: 9600" },
    objetivos: [
      { id: 1, texto: "Entrar a modo privilegiado:", comando: "enable" },
      { id: 2, texto: "Configuración global:", comando: "configure terminal" },
      { id: 3, texto: "Nombre de Host:", comando: "hostname TecSup" },
      { id: 4, texto: "Interfaz WAN g0/1:", comando: "interface gigabitEthernet 0/1" },
      { id: 5, texto: "Activar la interfaz:", comando: "no shutdown" },
      { id: 6, texto: "Solicitar IP por DHCP:", comando: "ip address dhcp" },
    ],
  },
  {
    id: "ssh",
    topicId: "administracion",
    titulo: "Servicio SSH en Ubuntu Server",
    descripcion:
      "Despliegue de OpenSSH Server, reglas de Firewall UFW, endurecimiento de seguridad e identificación de red.",
    sigla: "SSH",
    color: "purple",
    modulo: "Módulo SSH",
    categoria: "Administración de Sistemas",
    tituloGuiado: "Práctica Guiada: Servicio SSH & Firewall UFW en Ubuntu",
    introduccion:
      "Despliega el servicio OpenSSH Server y configura la seguridad perimetral de la máquina virtual.",
    tituloNota: "Indicación Docente:",
    informacion: {
      titulo: "Escenario Real",
      lineas: [
        "Para gestionar remotamente tus MVs con Ubuntu Server alojadas en el hipervisor Proxmox VE sin depender de noVNC, debes desplegar el daemon OpenSSH y permitir el tráfico a través del firewall UFW en el puerto 22.",
      ],
    },
    consola: { titulo: "Terminal noVNC — ubuntu-server (Ubuntu 24.04 LTS)", detalle: "Proxmox VE 9.x" },
    objetivos: [
      { id: 1, texto: "Instalar paquete:", comando: "sudo apt install -y openssh-server" },
      { id: 2, texto: "Verificar servicio:", comando: "sudo systemctl status ssh" },
      { id: 3, texto: "Abrir puerto en UFW:", comando: "sudo ufw allow ssh" },
      { id: 4, texto: "Activar Firewall:", comando: "sudo ufw enable" },
      { id: 5, texto: "Consultar IP de la interfaz:", comando: "ip a" },
    ],
  },
  {
    id: "proxmox",
    topicId: "redesDatosAvanzadas",
    titulo: "Proxmox VE & Cisco 2911",
    descripcion:
      "Enrutamiento de hipervisor Proxmox VE en Dell PowerEdge R820, subredes WAN/LAN y NAT Overload (PAT).",
    sigla: "C2911",
    color: "emerald",
    modulo: "Módulo Proxmox / Cisco",
    categoria: "Redes de Datos Avanzadas",
    tituloGuiado: "Práctica Guiada: Cisco 2911 ISR & Proxmox VE",
    introduccion:
      "Configura subredes WAN/LAN, traducción NAT Overload (PAT) y listas de acceso en el router enlazado al hipervisor.",
    tituloNota: "Nota Pedagógica:",
    informacion: {
      titulo: "Matriz de Direccionamiento",
      lineas: [
        "• **WAN G0/0:** `172.168.173.81/24` (Gateway: 172.168.173.1)",
        "• **LAN G0/1:** `192.168.100.1/24` (Proxmox Bridge vmbr0)",
      ],
    },
    consola: { titulo: "Terminal de Consola — Router2911 (Cisco IOS)", detalle: "Bauds: 9600" },
    objetivos: [
      { id: 1, texto: "Nombre de Host:", comando: "hostname Router2911" },
      { id: 2, texto: "Interfaz WAN g0/0:", comando: "interface gigabitEthernet 0/0" },
      { id: 3, texto: "IP WAN & NAT Outside:", comando: "ip address 172.168.173.81 255.255.255.0" },
      { id: 4, texto: "Interfaz LAN g0/1:", comando: "interface gigabitEthernet 0/1" },
      { id: 5, texto: "IP Gateway & NAT Inside:", comando: "ip address 192.168.100.1 255.255.255.0" },
      { id: 6, texto: "Ruta por Defecto:", comando: "ip route 0.0.0.0 0.0.0.0 172.168.173.1" },
      { id: 7, texto: "Crear ACL 1:", comando: "access-list 1 permit 192.168.100.0 0.0.0.255" },
      { id: 8, texto: "Activar PAT:", comando: "ip nat inside source list 1 interface g0/0 overload" },
    ],
  },
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
   /* ---------------- DSL ---------------- */
  {
    id: "dsl-1",
    topicId: "dsl",
    concepto: "Función del DSLAM",
    enunciado: "¿Qué función cumple el multiplexor DSLAM en la central telefónica del ISP?",
    opciones: [
      "Convierte la red LAN a fibra óptica directamente.",
      "Separar y multiplexar las señales analógicas de datos y voz hacia la red troncal.",
      "Asignar direcciones MAC públicas a los hosts de la LAN.",
    ],
    correcta: 1,
    explicacion:
      "El DSLAM concentra las líneas DSL de los abonados, separa la voz de los datos y los multiplexa hacia la red troncal del ISP.",
  },
  {
    id: "dsl-2",
    topicId: "dsl",
    concepto: "Ruta por defecto con DHCP",
    enunciado: "Al ejecutar `ip address dhcp` en la WAN, ¿qué tipo de ruta se instala automáticamente?",
    opciones: [
      "Una ruta por defecto (Default route S*) hacia el Gateway entregado por el ISP.",
      "Una ruta estática estricta con métrica 110.",
      "Una tabla de traducción PAT dinámica.",
    ],
    correcta: 0,
    explicacion:
      "Con `ip address dhcp` el router aprende también el gateway del ISP e instala una ruta por defecto (marcada con S en la tabla de enrutamiento) hacia él.",
  },
  {
    id: "dsl-3",
    topicId: "dsl",
    concepto: "Conector del módem DSL",
    enunciado: "¿Qué conector físico se utiliza para enlazar el módem DSL con la línea telefónica de cobre?",
    opciones: ["Conector RJ-45.", "Conector RJ-11.", "Conector BNC coaxial."],
    correcta: 1,
    explicacion:
      "La línea telefónica de cobre usa conectores RJ-11; el RJ-45 corresponde a las conexiones Ethernet de la LAN.",
  },
  {
    id: "dsl-4",
    topicId: "dsl",
    concepto: "Interfaz sin dirección IP",
    enunciado: 'Si la consola muestra *"Internet protocol processing disabled"* en una interfaz, significa que:',
    opciones: [
      "El cable físico está roto o desconectado.",
      "La interfaz está activa en Capa 1/2 pero no tiene habilitada una IP (Capa 3).",
      "El puerto está bloqueado por el protocolo Spanning Tree.",
    ],
    correcta: 1,
    explicacion:
      "Ese mensaje indica que la interfaz no tiene dirección IP configurada, por lo que la Capa 3 está deshabilitada aunque las Capas 1 y 2 funcionen.",
  },
  {
    id: "dsl-5",
    topicId: "dsl",
    concepto: "Ruta por defecto sin gateway",
    enunciado:
      '¿Por qué aparece la advertencia *"%Default route without gateway..."* al usar `ip route 0.0.0.0 0.0.0.0 g0/1`?',
    opciones: [
      "Porque Ethernet es una red multiacceso y el router debe consultar ARP por cada paquete hacia la WAN.",
      "Porque la interfaz GigabitEthernet está apagada.",
      "Porque falta configurar el nombre de dominio en IOS.",
    ],
    correcta: 0,
    explicacion:
      "Una ruta que apunta solo a una interfaz Ethernet (red multiacceso) obliga al router a resolver por ARP cada destino; por eso se recomienda indicar la IP del siguiente salto.",
  },
  {
    id: "dsl-6",
    topicId: "dsl",
    concepto: "Autenticación en DSL",
    enunciado: "¿Qué protocolo de autenticación suele emplear DSL en la vida real para autenticar usuarios?",
    opciones: ["PPPoE (Point-to-Point Protocol over Ethernet).", "BGP (Border Gateway Protocol).", "SNMPv3."],
    correcta: 0,
    explicacion:
      "Los proveedores DSL suelen usar PPPoE, que encapsula PPP sobre Ethernet para autenticar al abonado y asignarle su dirección.",
  },
  {
    id: "dsl-7",
    topicId: "dsl",
    concepto: "Secuencia DORA de DHCP",
    enunciado: "En la secuencia DORA de DHCP, ¿cuál es el primer paquete enviado por el router cliente?",
    opciones: ["DHCP Offer.", "DHCP Discover.", "DHCP Request."],
    correcta: 1,
    explicacion:
      "DORA significa Discover, Offer, Request y Acknowledge: el cliente inicia con un DHCP Discover y el servidor responde con el Offer.",
  },
  {
    id: "dsl-8",
    topicId: "dsl",
    concepto: "Central Office en Packet Tracer",
    enunciado:
      "En Cisco Packet Tracer, ¿qué componente representa a la Central Office (CO) para cruzar los puertos?",
    opciones: ["Generic Cloud (PT-Cloud).", "Switch 2960.", "Access Point de oficina."],
    correcta: 0,
    explicacion:
      "La nube genérica (PT-Cloud) permite emular la Central Office y relacionar sus puertos, por ejemplo DSL con Ethernet.",
  },
  {
    id: "dsl-9",
    topicId: "dsl",
    concepto: "Verificar interfaces",
    enunciado: "¿Qué comando te permite verificar la IP obtenida por DHCP y el estado lógico de las interfaces?",
    opciones: ["`show ip route`.", "`show ip interface brief`.", "`show running-config interface`."],
    correcta: 1,
    explicacion:
      "`show ip interface brief` muestra en una sola tabla la dirección IP de cada interfaz y su estado (Status y Protocol).",
  },
  {
    id: "dsl-10",
    topicId: "dsl",
    concepto: "Guardar la configuración",
    enunciado: "¿Cuál es la función del comando `write memory`?",
    opciones: [
      "Guardar la configuración activa de la RAM en la memoria NVRAM.",
      "Reiniciar la interfaz GigabitEthernet.",
      "Solicitar una nueva IP pública al servidor DHCP.",
    ],
    correcta: 0,
    explicacion:
      "`write memory` copia la configuración activa (running-config, en RAM) a la NVRAM como startup-config, para conservarla tras un reinicio.",
  },

  /* ---------------- SSH ---------------- */
  {
    id: "ssh-1",
    topicId: "ssh",
    concepto: "Puerto por defecto de SSH",
    enunciado: "¿En qué puerto por defecto escucha peticiones el daemon OpenSSH?",
    opciones: ["Puerto 80.", "Puerto 22.", "Puerto 443."],
    correcta: 1,
    explicacion: "SSH usa el puerto TCP 22 por defecto; el 80 corresponde a HTTP y el 443 a HTTPS.",
  },
  {
    id: "ssh-2",
    topicId: "ssh",
    concepto: "Configuración de OpenSSH",
    enunciado: "¿En qué archivo de configuración se deshabilita el login directo de root?",
    opciones: ["/etc/ssh/sshd_config", "/etc/network/interfaces", "/etc/ufw/user.rules"],
    correcta: 0,
    explicacion:
      "El daemon se configura en `/etc/ssh/sshd_config`; ahí se establece `PermitRootLogin no` para impedir el acceso directo de root.",
  },
  {
    id: "ssh-3",
    topicId: "ssh",
    concepto: "Recargar la configuración de SSH",
    enunciado: "¿Qué comando recarga las reglas de SSH sin cortar sesiones activas?",
    opciones: ["`sudo systemctl reload ssh`", "`sudo ufw reload`", "`service ssh stop`"],
    correcta: 0,
    explicacion:
      "`reload` vuelve a leer la configuración sin detener el servicio, así que las sesiones abiertas continúan; `stop` terminaría el servicio.",
  },
  {
    id: "ssh-4",
    topicId: "ssh",
    concepto: "Orden de las reglas de UFW",
    enunciado: "Si habilitas UFW antes de autorizar el puerto SSH, ¿qué sucederá?",
    opciones: [
      "La sesión continuará normalmente.",
      "El firewall bloqueará el tráfico al puerto 22 y perderás la conexión.",
      "El servidor se reiniciará.",
    ],
    correcta: 1,
    explicacion:
      "UFW deniega por defecto el tráfico entrante; sin una regla que permita el puerto 22, las conexiones SSH quedan bloqueadas. Por eso primero se ejecuta `ufw allow ssh` y después `ufw enable`.",
  },
  {
    id: "ssh-5",
    topicId: "ssh",
    concepto: "Conexión SSH desde macOS",
    enunciado: "Comando en macOS para conectarse a una MV con IP `192.168.100.50`:",
    opciones: [
      "`connect 192.168.100.50`",
      "`ssh usuario_ubuntu@192.168.100.50`.",
      "`telnet 192.168.100.50`",
    ],
    correcta: 1,
    explicacion:
      "`ssh usuario@IP` es la sintaxis del cliente SSH; `telnet` usa otro protocolo sin cifrado y `connect` no existe.",
  },
  {
    id: "ssh-6",
    topicId: "ssh",
    concepto: "Telnet frente a SSH",
    enunciado: "¿Qué diferencia principal existe entre Telnet y SSH?",
    opciones: [
      "Telnet es más rápido.",
      "Telnet transmite en texto plano y SSH cifra todo el canal.",
      "SSH requiere fibra óptica.",
    ],
    correcta: 1,
    explicacion:
      "Telnet envía usuario, contraseña y datos en texto plano; SSH cifra toda la comunicación y por eso lo sustituyó en la administración remota.",
  },
  {
    id: "ssh-7",
    topicId: "ssh",
    concepto: "Firewall de la VM en Proxmox",
    enunciado: "En Proxmox VE, si el Firewall de la VM está activo y no hay respuesta SSH, debes:",
    opciones: [
      "Verificar la regla de entrada en la interfaz de red de la VM.",
      "Cambiar la IP de Proxmox.",
      "Reiniciar el servidor Dell PowerEdge R820.",
    ],
    correcta: 0,
    explicacion:
      "El firewall de Proxmox puede bloquear el puerto 22 aunque el servicio SSH funcione; hay que revisar que exista una regla de entrada que lo permita en la interfaz de red de la VM.",
  },
  {
    id: "ssh-8",
    topicId: "ssh",
    concepto: "Consultar la IP en Ubuntu",
    enunciado: "¿Qué comando muestra las direcciones IP asociadas en Ubuntu Server?",
    opciones: ["`ipconfig /all`", "`ip a`.", "`show interfaces`"],
    correcta: 1,
    explicacion:
      "`ip a` (o `ip addr`) lista las interfaces y sus direcciones IP en Linux; `ipconfig` es de Windows y `show interfaces` de Cisco.",
  },
  {
    id: "ssh-9",
    topicId: "ssh",
    concepto: "Puerto personalizado en UFW",
    enunciado: "¿Cómo se permite el puerto 2222 en UFW?",
    opciones: ["`sudo ufw allow 2222/tcp`", "`sudo ufw open port 2222`", "`set firewall 2222`"],
    correcta: 0,
    explicacion:
      "La sintaxis de UFW es `ufw allow <puerto>/<protocolo>`; los otros dos comandos no existen.",
  },
  {
    id: "ssh-10",
    topicId: "ssh",
    concepto: "Llaves públicas autorizadas",
    enunciado: "¿Qué archivo guarda las llaves públicas autorizadas para login sin contraseña?",
    opciones: ["`~/.ssh/authorized_keys`", "`/etc/pubkeys`", "`/var/log/auth.log`"],
    correcta: 0,
    explicacion:
      "SSH consulta `~/.ssh/authorized_keys` del usuario para validar las llaves públicas; `auth.log` solo registra eventos de autenticación.",
  },

  /* ---------------- Proxmox VE & Cisco 2911 ---------------- */
  {
    id: "px-1",
    topicId: "proxmox-cisco",
    concepto: "NAT Overload (PAT)",
    enunciado: "¿Qué función realiza NAT Overload (PAT) en la interfaz G0/0?",
    opciones: [
      "Asigna IP pública a cada VM.",
      "Traduce múltiples IPs privadas hacia una IP pública usando puertos TCP/UDP.",
      "Filtra paquetes maliciosos.",
    ],
    correcta: 1,
    explicacion:
      "PAT permite que muchos hosts con IP privada salgan a Internet compartiendo una sola IP pública, diferenciando cada conexión por su puerto TCP/UDP.",
  },
  {
    id: "px-2",
    topicId: "proxmox-cisco",
    concepto: "Gateway en Netplan",
    enunciado:
      "En Netplan (`/etc/netplan/50-cloud-init.yaml`), ¿qué parámetro especifica el router Cisco?",
    opciones: [
      "`via: 192.168.100.1` dentro de `routes`.",
      "`gateway: 172.168.173.1`",
      "`nameservers: [192.168.100.1]`",
    ],
    correcta: 0,
    explicacion:
      "La ruta por defecto de la VM se declara en `routes` con `via: 192.168.100.1`, la IP LAN del router Cisco que actúa como gateway.",
  },
  {
    id: "px-3",
    topicId: "proxmox-cisco",
    concepto: "Bridge de Proxmox",
    enunciado: "¿Qué interfaz puente lógica conecta las tarjetas físicas en Proxmox?",
    opciones: ["`eth0`", "`vmbr0`.", "`vlan100`"],
    correcta: 1,
    explicacion:
      "`vmbr0` es el bridge (puente Linux) de Proxmox al que se conectan las VMs y la tarjeta de red física.",
  },
  {
    id: "px-4",
    topicId: "proxmox-cisco",
    concepto: "Llave RSA para SSHv2",
    enunciado: "¿Qué longitud de módulo RSA se recomienda para SSHv2 en Cisco IOS?",
    opciones: ["512 bits.", "2048 bits.", "128 bits."],
    correcta: 1,
    explicacion:
      "Con 2048 bits las llaves RSA ofrecen una seguridad adecuada; 512 y 128 bits son demasiado débiles (SSHv2 en IOS exige al menos 768 bits).",
  },
  {
    id: "px-5",
    topicId: "proxmox-cisco",
    concepto: "Aplicar cambios de Netplan",
    enunciado: "¿Qué comando de Netplan aplica los cambios de red en tiempo real?",
    opciones: ["`sudo netplan apply`.", "`systemctl restart netplan`", "`ip reload netplan`"],
    correcta: 0,
    explicacion: "`sudo netplan apply` aplica la configuración de los archivos YAML sin reiniciar el equipo.",
  },
  {
    id: "px-6",
    topicId: "proxmox-cisco",
    concepto: "Máscara wildcard en ACL",
    enunciado: "¿Qué función cumple la máscara comodín (wildcard) `0.0.0.255` en la ACL 1?",
    opciones: [
      "Especifica que los primeros 24 bits coinciden, permitiendo la subred /24.",
      "Bloquea el tráfico de 255 hosts.",
      "Asigna la máscara DNS.",
    ],
    correcta: 0,
    explicacion:
      'En una wildcard, el bit 0 significa "debe coincidir" y el 1 "se ignora"; `0.0.0.255` compara los primeros 24 bits y abarca toda la subred /24.',
  },
  {
    id: "px-7",
    topicId: "proxmox-cisco",
    concepto: "Gestión fuera de banda",
    enunciado:
      "En el servidor físico Dell PowerEdge R820, ¿qué interfaz de gestión fuera de banda se utiliza?",
    opciones: ["iDRAC (Integrated Dell Remote Access Controller).", "CIMC.", "ILO."],
    correcta: 0,
    explicacion: "iDRAC es el controlador de acceso remoto de Dell; CIMC pertenece a Cisco e iLO a HPE.",
  },
  {
    id: "px-8",
    topicId: "proxmox-cisco",
    concepto: "Líneas VTY",
    enunciado: "Comando para habilitar líneas VTY con SSH y Telnet en Cisco IOS:",
    opciones: ["`transport input telnet ssh`.", "`allow remote access`", "`session remote enable`"],
    correcta: 0,
    explicacion:
      "Dentro de `line vty`, `transport input telnet ssh` define qué protocolos aceptan las líneas virtuales.",
  },
  {
    id: "px-9",
    topicId: "proxmox-cisco",
    concepto: "DNS en resolv.conf",
    enunciado: "Para probar navegación DNS en `/etc/resolv.conf` agregan:",
    opciones: ["`nameserver 8.8.8.8`.", "`dns-server 8.8.8.8`", "`ip dns 8.8.8.8`"],
    correcta: 0,
    explicacion: "En `/etc/resolv.conf` cada servidor DNS se declara con la directiva `nameserver`.",
  },
  {
    id: "px-10",
    topicId: "proxmox-cisco",
    concepto: "Tabla de traducciones NAT",
    enunciado: "¿Qué comando muestra la tabla activa de traducciones NAT en Cisco 2911?",
    opciones: ["`show ip nat translations`", "`show ip route nat`", "`show access-lists nat`"],
    correcta: 0,
    explicacion:
      "`show ip nat translations` lista las traducciones activas entre direcciones internas y externas.",
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