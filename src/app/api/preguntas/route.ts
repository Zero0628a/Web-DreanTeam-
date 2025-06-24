// src/app/api/preguntas/route.ts

export async function POST(request: Request) {
  const data = await request.json();

  return new Response(JSON.stringify({
    recibido: data,
    mensaje: "¡Datos recibidos correctamente! 🚀",
  }), {
    headers: { "Content-Type": "application/json" },
    status: 200
  });
}

export async function GET() {
  return new Response(JSON.stringify({
    mensaje: "Hola desde la API 🎉"
  }), {
    headers: { "Content-Type": "application/json" },
    status: 200
  });
}
