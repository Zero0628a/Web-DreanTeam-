// src/app/api/preguntas/route.ts
export async function GET() {
  return new Response(JSON.stringify({ mensaje: "Hola desde la API 🎉" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  return new Response(JSON.stringify({
    recibido: body,
    mensaje: "¡Datos recibidos correctamente! 🚀",
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
