import { createClient } from "npm:@supabase/supabase-js@2";

const MAX_FALLOS_POR_CUENTA = 5;
const MAX_FALLOS_POR_IP = 20;
const VENTANA_MINUTOS = 15;

// Acepta tanto las claves clásicas (anon / service_role) como las nuevas (publishable / secret)
function clave(simple: string, plural: string): string | undefined {
  const v = Deno.env.get(simple);
  if (v) return v;
  const json = Deno.env.get(plural);
  if (json) {
    try {
      return JSON.parse(json).default;
    } catch {
      /* ignorar */
    }
  }
  return undefined;
}

const url = Deno.env.get("SUPABASE_URL")!;
const anonKey = clave("SUPABASE_ANON_KEY", "SUPABASE_PUBLISHABLE_KEYS")!;
const serviceKey = clave("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEYS")!;
const origenesPermitidos = (Deno.env.get("ALLOWED_ORIGINS") ?? "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

const sinSesion = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(url, serviceKey, sinSesion);

function cors(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": origenesPermitidos.includes(origin) ? origin : origenesPermitidos[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function responder(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(req), "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });
  if (req.method !== "POST") return responder(req, { error: "metodo_no_permitido" }, 405);

  // 1. Validar la solicitud
  let body: { numero_control?: unknown; password?: unknown } | null = null;
  try {
    body = await req.json();
  } catch {
    return responder(req, { error: "solicitud_invalida" }, 400);
  }
  const numeroControl = typeof body?.numero_control === "string" ? body.numero_control : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!/^\d{8}$/.test(numeroControl) || password.length === 0 || password.length > 72) {
    return responder(req, { error: "solicitud_invalida" }, 400);
  }

  const ip = (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0] ??
    "desconocida"
  ).trim();

  // 2. Límite de intentos fallidos
  const desde = new Date(Date.now() - VENTANA_MINUTOS * 60_000).toISOString();
  const [porCuenta, porIp] = await Promise.all([
    admin.from("login_attempts").select("id", { count: "exact", head: true })
      .eq("numero_control", numeroControl).gte("created_at", desde),
    admin.from("login_attempts").select("id", { count: "exact", head: true })
      .eq("ip", ip).gte("created_at", desde),
  ]);
  if ((porCuenta.count ?? 0) >= MAX_FALLOS_POR_CUENTA || (porIp.count ?? 0) >= MAX_FALLOS_POR_IP) {
    return responder(req, { error: "demasiados_intentos" }, 429);
  }

  // 3. Buscar el correo asociado al número de control (solo en el servidor)
  let email: string | null = null;
  const { data: perfil } = await admin
    .from("profiles").select("id").eq("numero_control", numeroControl).maybeSingle();
  if (perfil) {
    const { data } = await admin.auth.admin.getUserById(perfil.id);
    email = data.user?.email ?? null;
  }

  // 4. Iniciar sesión. Si el número no existe se usa un correo falso para que la
  //    respuesta sea idéntica a la de una contraseña incorrecta.
  const cliente = createClient(url, anonKey, sinSesion);
  const { data, error } = await cliente.auth.signInWithPassword({
    email: email ?? "no-existe@example.invalid",
    password,
  });

  if (error || !data.session) {
    if (error?.code === "email_not_confirmed") {
      return responder(req, { error: "email_no_confirmado" }, 403);
    }
    await admin.from("login_attempts").insert({ numero_control: numeroControl, ip });
    // Limpieza ocasional de registros con más de un día
    if (Math.random() < 0.05) {
      const ayer = new Date(Date.now() - 24 * 60 * 60_000).toISOString();
      await admin.from("login_attempts").delete().lt("created_at", ayer);
    }
    return responder(req, { error: "credenciales_invalidas" }, 401);
  }

  // 5. Éxito: se borran los fallos previos y se devuelven solo los tokens
  await admin.from("login_attempts").delete().eq("numero_control", numeroControl);
  return responder(req, {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
});