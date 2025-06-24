export async function GET() {
  const data = { mensaje: 'Hola desde la API 🎉' };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    return new Response(JSON.stringify({
      recibido: body,
      mensaje: '¡Datos recibidos correctamente! 🚀',
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Ocurrió un error al procesar el JSON',
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
